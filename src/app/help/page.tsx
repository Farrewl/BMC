import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { helpTicketAction } from "@/lib/actions";

export default async function HelpPage() {
  const tickets = await db.helpTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
    take: 5,
  });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <BrutaBadge color="#F8F4E8">Bantuan</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">BANTUAN / HELPDESK</h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          Alur demo 10 menit: landing → turnamen → kelola bracket → sponsor → LFG. Semua tombol di bawah hidup.
        </p>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">ALUR DEMO 10 MENIT</p>
          <ol className="mt-3 space-y-2 font-body text-sm">
            <li><b>A (3 mnt):</b> Landing → Lihat Turnamen → buka MLBB Campus Cup (6 tim, demo BYE).</li>
            <li><b>B (4 mnt):</b> Kelola Bracket → Generate → input 2 skor → pemenang maju otomatis → final.</li>
            <li><b>C (3 mnt):</b> Sponsor Directory (fee 10%) → LFG → RoleSwitcher Panitia/Sponsor/Player.</li>
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <BrutaLink href="/tournaments" variant="sun" className="!py-2 !text-xs">Mulai A →</BrutaLink>
            <BrutaLink href="/organizer" variant="lime" className="!py-2 !text-xs">Lompat B →</BrutaLink>
            <BrutaLink href="/sponsors" variant="cyan" className="!py-2 !text-xs">Lompat C →</BrutaLink>
          </div>
        </BrutaCard>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">KIRIM TIKET</p>
          <form action={helpTicketAction} className="mt-3 space-y-2">
            <input name="subject" required minLength={4} placeholder="Subjek…" className="w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black" />
            <textarea name="message" required minLength={10} rows={3} placeholder="Ceritakan kendala…" className="w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black" />
            <button type="submit" className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-sun px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta">
              Kirim Tiket →
            </button>
          </form>
        </BrutaCard>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">TIKET TERAKHIR</p>
          <div className="mt-3 space-y-2">
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                <p className="font-body text-sm font-bold">{t.subject}</p>
                <p className="font-body text-xs text-mutedcream">{t.user.name} · {t.status} · {t.message}</p>
              </div>
            ))}
          </div>
        </BrutaCard>
      </main>
      <Footer />
    </div>
  );
}
