import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type Role = "ORGANIZER" | "SPONSOR" | "PLAYER" | "ADMIN";
export type Session = { userId: string; role: Role; name: string };

const COOKIE = "ngesport_session";

export const HOME_BY_ROLE: Record<Role, string> = {
  ORGANIZER: "/organizer",
  SPONSOR: "/sponsor",
  PLAYER: "/player",
  ADMIN: "/admin",
};

// Akun demo dari seed — dipakai tombol "Masuk cepat" & fallback kalau DB mati (Vercel).
export const DEMO_ACCOUNTS: Array<{
  role: Role;
  label: string;
  name: string;
  email: string;
}> = [
  { role: "ORGANIZER", label: "Panitia", name: "BEM FSM Undip", email: "bem@undip.ac.id" },
  { role: "SPONSOR", label: "Sponsor", name: "Kopi Kos Ndalem", email: "kopi@ndalem.id" },
  { role: "PLAYER", label: "Player", name: "Bagas Pratama", email: "player1@ngesport.id" },
];

function demoByEmail(email: string) {
  return DEMO_ACCOUNTS.find((a) => a.email === email) ?? null;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (!parsed?.userId || !parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeSession(session: Session) {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(session), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

async function resolveSession(email: string): Promise<Session | null> {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user) {
      return { userId: user.id, role: user.role as Role, name: user.name };
    }
  } catch {
    // DB tidak tersedia (mis. Vercel tanpa SQLite) → jatuh ke akun demo.
  }
  const demo = demoByEmail(email);
  if (demo) {
    return {
      userId: `demo-${demo.role.toLowerCase()}`,
      role: demo.role,
      name: demo.name,
    };
  }
  return null;
}

export async function loginAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const next = String(formData.get("next") ?? "");

  const loginFail = (err: string): never =>
    redirect(`/login?error=${err}${next ? `&next=${encodeURIComponent(next)}` : ""}`);

  // Akun terdaftar tapi belum diverifikasi admin.
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (user && !user.approved) loginFail("pending");
  } catch {
    // DB mati → lanjut ke resolveSession (demo).
  }

  // Email pernah ditolak admin.
  try {
    const rej = await db.rejectedUser.findFirst({
      where: { email },
      orderBy: { rejectedAt: "desc" },
    });
    if (rej) loginFail(`rejected&reason=${encodeURIComponent(rej.reason)}`);
  } catch {
    // DB mati → lanjut.
  }

  const session = await resolveSession(email);
  if (!session) {
    loginFail("1");
    return;
  }

  await writeSession(session);
  redirect(next.startsWith("/") ? next : HOME_BY_ROLE[session.role]);
}

export async function registerAccountAction(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "PLAYER") as Role;
  const orgName = String(formData.get("orgName") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();

  if (name.length < 3) redirect("/register?error=nama");
  if (!/^\S+@\S+\.\S+$/.test(email)) redirect("/register?error=email");
  if (role !== "PLAYER" && role !== "ORGANIZER" && role !== "SPONSOR") {
    redirect("/register?error=role");
  }
  if (role !== "PLAYER" && orgName.length < 3) {
    redirect("/register?error=org");
  }

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      if (!existing.approved) redirect("/register?error=pending");
      redirect("/register?error=exists");
    }
    const rej = await db.rejectedUser.findFirst({
      where: { email },
      orderBy: { rejectedAt: "desc" },
    });
    if (rej) {
      redirect(`/register?error=rejected&reason=${encodeURIComponent(rej.reason)}`);
    }

    const approved = role === "PLAYER";
    const user = await db.user.create({
      data: {
        name,
        email,
        role,
        orgName: role === "PLAYER" ? null : orgName,
        city: city || null,
        approved,
      },
    });
    if (!approved) redirect("/register?success=pending");
    await writeSession({ userId: user.id, role: user.role as Role, name: user.name });
    redirect(HOME_BY_ROLE[user.role as Role]);
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    // DB mati → fallback sesi demo agar alur tetap jalan.
    const session = {
      userId: `demo-${role.toLowerCase()}`,
      role,
      name,
    } as Session;
    await writeSession(session);
    redirect(role === "PLAYER" ? HOME_BY_ROLE.PLAYER : "/register?success=pending");
  }
}

export async function approveUserAction(userId: string) {
  "use server";
  await requireRole("ADMIN");
  await db.user.update({ where: { id: userId }, data: { approved: true } });
  redirect("/admin");
}

export async function rejectUserAction(formData: FormData) {
  "use server";
  await requireRole("ADMIN");
  const userId = String(formData.get("userId") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 3) redirect("/admin?error=alasan");
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/admin");
  await db.rejectedUser.create({
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
      orgName: user.orgName,
      city: user.city,
      reason,
    },
  });
  await db.user.delete({ where: { id: userId } });
  redirect("/admin");
}

export async function logoutAction() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/");
}

export async function requireSession(nextPath = "/"): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

export async function requireRole(role: Role, nextPath?: string): Promise<Session> {
  const session = await requireSession(nextPath ?? HOME_BY_ROLE[role]);
  if (session.role !== role) {
    redirect(HOME_BY_ROLE[session.role]);
  }
  return session;
}
