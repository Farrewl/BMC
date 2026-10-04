import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { switchRoleAction } from "@/lib/session";

const roles = [
  { role: "ORGANIZER", label: "Panitia", bg: "bg-arena text-white" },
  { role: "SPONSOR", label: "Sponsor", bg: "bg-poporange text-black" },
  { role: "PLAYER", label: "Player", bg: "bg-popcyan text-black" },
] as const;

export function RoleSwitcher({ active }: { active?: string }) {
  return (
    <div className="flex overflow-hidden rounded-xl border-[3px] border-black bg-elevated">
      {roles.map((r) => {
        const isActive = active === r.label;
        return (
          <form key={r.role} action={switchRoleAction}>
            <input type="hidden" name="role" value={r.role} />
            <button
              type="submit"
              className={cn(
                "border-r-[3px] border-black px-3 py-2 font-display text-[11px] font-bold uppercase tracking-wide last:border-r-0 sm:px-4",
                isActive ? r.bg : "text-cream hover:bg-paperdark"
              )}
            >
              {r.label}
            </button>
          </form>
        );
      })}
    </div>
  );
}

export function Navbar({ active }: { active?: string }) {
  return (
    <header className="no-print border-b-4 border-black bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="h-10 w-10 overflow-hidden rounded-lg border-[3px] border-black bg-sun shadow-bruta-sm">
            <Image
              src="/images.jpeg"
              alt="Logo LombaEsport"
              width={40}
              height={40}
              className="h-full w-full object-cover"
              priority
            />
          </span>
          <span className="font-display text-xl font-black tracking-tight text-cream">
            LombaEsport
          </span>
        </Link>
        <nav className="hidden items-center gap-5 font-body text-sm font-medium text-mutedcream md:flex">
          <Link href="/tournaments" className="hover:text-cream">
            Turnamen
          </Link>
          <Link href="/lfg" className="hover:text-cream">
            LFG
          </Link>
          <Link href="/sponsors" className="hover:text-cream">
            Sponsor
          </Link>
          <Link href="/help" className="hover:text-cream">
            Bantuan
          </Link>
        </nav>
        <RoleSwitcher active={active} />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t-4 border-black bg-card">
      <div className="halftone-dark mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-sm font-bold text-cream">
          LombaEsport — Mock-up edukasi, bukan produk pembayaran sungguhan.
        </p>
        <p className="font-body text-xs text-mutedcream">
          BMC Kelompok 14 · Single elimination · Fee sponsor 10%
        </p>
      </div>
    </footer>
  );
}
