import Link from "next/link";
import { Footer, Navbar } from "@/components/layout/Navbar";
import { BrutaBadge, BrutaLink } from "@/components/ui/bruta";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <Navbar />
      <main className="grid-line-dark flex flex-1 items-center justify-center px-4 py-20">
        <div className="text-center">
          <BrutaBadge color="#FFB7C5">Error 404</BrutaBadge>
          <h1 className="mt-4 font-display text-5xl font-black sm:text-7xl">
            GAME <span className="text-sun">OVER</span>
          </h1>
          <p className="mt-4 font-body text-sm text-mutedcream">
            Halaman ini tidak ada atau sudah dipindahkan.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <BrutaLink href="/" variant="primary">
              Ke Beranda
            </BrutaLink>
            <BrutaLink href="/tournaments" variant="ghost">
              Lihat Turnamen
            </BrutaLink>
          </div>
          <p className="mt-6 font-body text-xs text-mutedcream">
            Butuh bantuan?{" "}
            <Link href="/help" className="font-bold text-sun underline">
              Hubungi helpdesk
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
