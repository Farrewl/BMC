import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export type Role = "ORGANIZER" | "SPONSOR" | "PLAYER";
export type Session = { userId: string; role: Role; name: string };

const COOKIE = "ngesport_session";

export const HOME_BY_ROLE: Record<Role, string> = {
  ORGANIZER: "/organizer",
  SPONSOR: "/sponsor",
  PLAYER: "/player",
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

  const session = await resolveSession(email);
  if (!session) {
    redirect(`/login?error=1${next ? `&next=${encodeURIComponent(next)}` : ""}`);
  }

  await writeSession(session);
  redirect(next.startsWith("/") ? next : HOME_BY_ROLE[session.role]);
}

export async function logoutAction() {
  "use server";
  const store = await cookies();
  store.delete(COOKIE);
  redirect("/");
}

export async function switchRoleAction(formData: FormData) {
  "use server";
  const role = String(formData.get("role") ?? "PLAYER") as Role;
  const demo = DEMO_ACCOUNTS.find((a) => a.role === role);
  if (!demo) redirect("/login");

  const session =
    (await resolveSession(demo.email)) ?? {
      userId: `demo-${role.toLowerCase()}`,
      role,
      name: demo.name,
    };
  await writeSession(session);
  redirect(HOME_BY_ROLE[role]);
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
