import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Role = "ORGANIZER" | "SPONSOR" | "PLAYER";
export type Session = { userId: string; role: Role };

const COOKIE = "lombaesport_session";

const DEFAULT_USER: Record<Role, string> = {
  ORGANIZER: "org-bem",
  SPONSOR: "sp-kopi",
  PLAYER: "pl-1",
};

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const raw = store.get(COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function setRoleAndRedirect(role: Role) {
  "use server";
  const store = await cookies();
  const value: Session = { userId: DEFAULT_USER[role], role };
  store.set(COOKIE, JSON.stringify(value), { path: "/", maxAge: 60 * 60 * 24 * 7 });
  if (role === "ORGANIZER") redirect("/organizer");
  if (role === "SPONSOR") redirect("/sponsor");
  redirect("/player");
}

export async function switchRoleAction(formData: FormData) {
  "use server";
  const role = String(formData.get("role") ?? "PLAYER") as Role;
  const store = await cookies();
  store.set(COOKIE, JSON.stringify({ userId: DEFAULT_USER[role], role }), {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  if (role === "ORGANIZER") redirect("/organizer");
  if (role === "SPONSOR") redirect("/sponsor");
  redirect("/player");
}
