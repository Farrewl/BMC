import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getSession, logoutAction, type Role } from "@/lib/session";

const roleLabel: Record<Role, string> = {
  ORGANIZER: "Panitia",
  SPONSOR: "Sponsor",
  PLAYER: "Player",
  ADMIN: "Admin",
};

const navItems = [
  { href: "/tournaments", label: "Turnamen" },
  { href: "/lfg", label: "LFG" },
  { href: "/sponsors", label: "Sponsor" },
  { href: "/help", label: "Bantuan" },
];

export async function Navbar({ active }: { active?: string }) {
  const session = await getSession();
  return (
    <header className="no-print sticky top-0 z-40 border-b-4 border-black bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-10 w-10 overflow-hidden rounded-lg border-[3px] border-black bg-black shadow-bruta-sm">
            <Image
              src="/icon.png"
              alt="Logo Nge-Sport"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="font-display text-xl font-black tracking-tight text-cream">
            NGE-SPORT
          </span>
        </Link>
        <nav className="hidden items-center gap-1 font-body text-sm font-medium md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 transition-colors hover:bg-paperdark hover:text-cream",
                active === item.label ? "text-sun" : "text-mutedcream"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {session ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right lg:block">
              <p className="max-w-[12rem] truncate font-display text-[11px] font-bold uppercase tracking-wide text-cream">
                {session.name}
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="inline-block rounded-xl border-[3px] border-black bg-paperdark px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wide text-cream sm:px-4">
                {roleLabel[session.role]}
              </span>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="bruta-press cursor-pointer rounded-xl border-[3px] border-black bg-elevated px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wide text-cream shadow-bruta-sm"
              >
                Keluar
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="bruta-press rounded-xl border-[3px] border-black bg-arena px-4 py-2 font-display text-xs font-bold uppercase tracking-wide text-white shadow-bruta sm:px-5 sm:py-3 sm:text-sm"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 overflow-hidden rounded-lg border-[3px] border-black bg-black">
              <Image
                src="/icon.png"
                alt="Logo Nge-Sport"
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-display text-lg font-black text-cream">
              NGE-SPORT
            </span>
          </div>
          <p className="mt-3 max-w-xs font-body text-sm text-mutedcream">
            Platform turnamen e-sports kampus: bracket otomatis, matchmaking
            sponsor UMKM, dan LFG dalam satu tempat.
          </p>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-sun">
            Jelajahi
          </p>
          <ul className="mt-3 space-y-2 font-body text-sm text-mutedcream">
            <li>
              <Link href="/tournaments" className="hover:text-cream">
                Turnamen
              </Link>
            </li>
            <li>
              <Link href="/lfg" className="hover:text-cream">
                Looking For Group
              </Link>
            </li>
            <li>
              <Link href="/sponsors" className="hover:text-cream">
                Sponsor Directory
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-cream">
                Bantuan
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-xs font-bold uppercase tracking-widest text-sun">
            Akun
          </p>
          <ul className="mt-3 space-y-2 font-body text-sm text-mutedcream">
            <li>
              <Link href="/login" className="hover:text-cream">
                Masuk
              </Link>
            </li>
            <li>
              <Link href="/organizer" className="hover:text-cream">
                Dashboard Panitia
              </Link>
            </li>
            <li>
              <Link href="/sponsor" className="hover:text-cream">
                Dashboard Sponsor
              </Link>
            </li>
            <li>
              <Link href="/player" className="hover:text-cream">
                Dashboard Player
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t-2 border-black/40">
        <p className="mx-auto max-w-6xl px-4 py-4 font-body text-xs text-mutedcream">
          © 2026 Nge-Sport. Semua harga dan transaksi pada platform ini adalah
          simulasi.
        </p>
      </div>
    </footer>
  );
}
