import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { rupiah, tanggal } from "@/lib/format";
import { gameColor, statusBadge } from "@/lib/data";
import { calcTicket } from "@/lib/fees";
import { registerAction } from "@/lib/actions";

export default async function PlayerHome() {
  const tournaments = await db.tournament.findMany({
    where: { status: { in: ["OPEN", "ONGOING"] } },
    orderBy: { startDate: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
  const lfgCount = await db.lfgPost.count({ where: { status: "OPEN" } });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Player" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#22D3EE">Player · Gamer</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">DASHBOARD PLAYER</h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          Daftar turnamen yang masih buka, simulasi checkout tiket, atau cari tim di LFG.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">TURNAMEN BUKA</p>
            <p className="mt-1 font-display text-2xl font-black text-poplime">{tournaments.length} event</p>
          </BrutaCard>
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">LFG AKTIF</p>
            <p className="mt-1 font-display text-2xl font-black text-popcyan">{lfgCount} post</p>
          </BrutaCard>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {tournaments.map((t) => {
            const solo = calcTicket(t.entryFee, true);
            const team = calcTicket(t.entryFee, false);
            return (
              <article key={t.id} className="overflow-hidden rounded-2xl border-[3px] border-black bg-card shadow-bruta">
                <div className="border-b-[3px] border-black px-4 py-4" style={{ background: gameColor(t.game) }}>
                  <p className="font-display text-[11px] font-black uppercase text-black">{t.game} · {tanggal(t.startDate)}</p>
                  <p className="font-display text-lg font-black text-black">{t.title}</p>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <BrutaBadge color={statusBadge(t.status)}>{t.status}</BrutaBadge>
                    <span className="font-body text-xs text-mutedcream">{t._count.registrations}/{t.maxTeams} tim</span>
                  </div>
                  <div className="rounded-xl border-2 border-black bg-elevated px-3 py-2 font-body text-xs">
                    <p>Tiket tim: <b>{rupiah(team.total)}</b> (tanpa fee)</p>
                    <p className="mt-1">Tiket solo: <b>{rupiah(solo.total)}</b> = {rupiah(t.entryFee)} + fee {rupiah(solo.convenienceFee)}</p>
                  </div>
                  <form action={registerAction} className="flex gap-2">
                    <input type="hidden" name="tournamentId" value={t.id} />
                    <input name="teamName" required minLength={3} placeholder="Nama tim..." className="min-w-0 flex-1 rounded-lg border-2 border-black bg-white px-2 py-2 font-body text-xs font-bold text-black" />
                    <select name="mode" className="rounded-lg border-2 border-black bg-white px-1 py-2 font-body text-xs font-bold text-black" defaultValue="team">
                      <option value="team">Tim</option>
                      <option value="solo">Solo</option>
                    </select>
                    <button type="submit" className="cursor-pointer rounded-lg border-2 border-black bg-sun px-3 py-2 font-display text-[11px] font-black text-black">DAFTAR</button>
                  </form>
                  <div className="flex gap-2">
                    <BrutaLink href={`/tournaments/${t.id}`} variant="cyan" className="flex-1 !py-2 !text-xs">Detail →</BrutaLink>
                    <BrutaLink href="/lfg" variant="dark" className="flex-1 !py-2 !text-xs">Cari Tim</BrutaLink>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
