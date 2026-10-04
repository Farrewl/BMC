import Link from "next/link";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoTournaments, withDemo } from "@/lib/demo";
import { rupiah, tanggal } from "@/lib/format";
import { statusBadge, gameColor } from "@/lib/data";

export default async function OrganizerHome() {
  const tournaments = await withDemo(
    () =>
      db.tournament.findMany({
        orderBy: { startDate: "asc" },
        include: {
          _count: { select: { registrations: true, matches: true } },
        },
      }),
    demoTournaments
  );
  const totalTeams = tournaments.reduce((s, t) => s + t._count.registrations, 0);
  const totalPrize = tournaments.reduce((s, t) => s + t.prizePool, 0);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Panitia" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#8B5CF6">Organizer · Panitia</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">
          DASHBOARD PANITIA
        </h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          Kelola turnamen, generate bracket, dan input skor.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <BrutaLink href="/organizer/tournaments/new" variant="sun" className="!py-2 !text-xs">
            + Buat Turnamen
          </BrutaLink>
          <BrutaLink href="/organizer/billing" variant="dark" className="!py-2 !text-xs">
            Billing →
          </BrutaLink>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { l: "TURNAMEN", v: String(tournaments.length), c: "#FFD02B" },
            { l: "TOTAL TIM", v: String(totalTeams), c: "#22D3EE" },
            { l: "TOTAL PRIZE", v: rupiah(totalPrize), c: "#B5E048" },
          ].map((s) => (
            <BrutaCard key={s.l} className="p-4" >
              <p className="font-display text-[11px] font-bold text-mutedcream">
                {s.l}
              </p>
              <p
                className="mt-1 font-display text-2xl font-black"
                style={{ color: s.c }}
              >
                {s.v}
              </p>
            </BrutaCard>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {tournaments.map((t) => (
            <article
              key={t.id}
              className="overflow-hidden rounded-2xl border-[3px] border-black bg-card shadow-bruta"
            >
              <div
                className="border-b-[3px] border-black px-4 py-4"
                style={{ background: gameColor(t.game) }}
              >
                <p className="font-display text-[11px] font-black uppercase text-black">
                  {t.game} · {tanggal(t.startDate)}
                </p>
                <p className="font-display text-lg font-black text-black">
                  {t.title}
                </p>
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <BrutaBadge color={statusBadge(t.status)}>
                    {t.status}
                  </BrutaBadge>
                  <span className="font-body text-xs text-mutedcream">
                    {t._count.registrations}/{t.maxTeams} tim
                    {t._count.matches > 0 && ` · ${t._count.matches} match`}
                  </span>
                </div>
                <span className="font-display text-sm font-black text-sun">
                  {rupiah(t.prizePool)}
                </span>
              </div>
              <div className="flex gap-2 px-4 pb-4">
                <BrutaLink
                  href={`/organizer/tournaments/${t.id}/manage`}
                  variant="lime"
                  className="flex-1 !py-2 !text-xs"
                >
                  Kelola ⚙
                </BrutaLink>
                <BrutaLink
                  href={`/tournaments/${t.id}`}
                  variant="dark"
                  className="flex-1 !py-2 !text-xs"
                >
                  Publik →
                </BrutaLink>
              </div>
            </article>
          ))}
        </div>

        <Link
          href="/"
          className="mt-6 inline-block font-display text-xs font-bold text-sun underline"
        >
          ← Kembali ke landing
        </Link>
      </main>
      <Footer />
    </div>
  );
}
