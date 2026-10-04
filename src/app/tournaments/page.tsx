import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { gameColor, statusBadge, rupiah } from "@/lib/data";
import { db } from "@/lib/db";
import { demoTournaments, withDemo } from "@/lib/demo";
import { tanggal } from "@/lib/format";

export default async function TournamentsPage() {
  const tournaments = await withDemo(
    () =>
      db.tournament.findMany({
        orderBy: { startDate: "asc" },
        include: { _count: { select: { registrations: true } } },
      }),
    demoTournaments
  );
  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FFD02B">Daftar Turnamen</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">DAFTAR TURNAMEN</h1>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {tournaments.map((t) => (
            <article key={t.id} className="overflow-hidden rounded-2xl border-[3px] border-black bg-card shadow-bruta">
              <div className="border-b-[3px] border-black px-4 py-4" style={{ background: gameColor(t.game) }}>
                <p className="font-display text-[11px] font-black uppercase text-black">{t.game}</p>
                <p className="font-display text-lg font-black text-black">{t.title}</p>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <BrutaBadge color={statusBadge(t.status)}>{t.status}</BrutaBadge>
                  <span className="font-body text-xs text-mutedcream">{t._count.registrations}/{t.maxTeams} tim</span>
                </div>
                <span className="font-display text-sm font-black text-sun">{rupiah(t.prizePool)}</span>
              </div>
              <div className="px-4 pb-2 font-body text-xs text-mutedcream">Mulai · {tanggal(t.startDate)}</div>
              <div className="flex gap-2 px-4 pb-4">
                <BrutaLink href={`/tournaments/${t.id}`} variant="sun" className="flex-1 !py-2 !text-xs">Lihat Detail →</BrutaLink>
                <BrutaLink href={`/organizer/tournaments/${t.id}/manage`} variant="lime" className="flex-1 !py-2 !text-xs">Kelola ⚙</BrutaLink>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
