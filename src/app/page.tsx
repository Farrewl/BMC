import { Navbar, Footer } from "@/components/layout/Navbar";
import Link from "next/link";
import { BrutaLink, BrutaCard, Sticker, Tag } from "@/components/ui/bruta";
import { gameColor, statusBadge } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { tanggal } from "@/lib/format";
import { db } from "@/lib/db";
import { demoTournaments, withDemo } from "@/lib/demo";
import type { Match, Registration } from "@prisma/client";

function Marquee() {
  const items = [
    "OPEN REGISTRATION",
    "MLBB CAMPUS CUP",
    "VALORANT CLASH",
    "SPONSOR FEE 10%",
    "LFG: CARI TIM",
    "SLOT IKLAN UMKM",
  ];
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-4 border-black bg-sun py-2">
      <div className="animate-marquee flex w-max items-center gap-8 pr-8">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-8 font-display text-xs font-black uppercase tracking-widest text-black"
          >
            {t} <span aria-hidden>★</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="halftone-dark grid-line-dark relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-arena opacity-30 blur-[120px]"
      />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] text-cream sm:text-5xl">
            KELOLA{" "}
            <span className="inline-block -rotate-1 border-[3px] border-black bg-sun px-2 text-black shadow-bruta-sm">
              TURNAMEN
            </span>{" "}
            TANPA DRAMA BRACKET.
          </h1>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrutaLink href="/tournaments" variant="primary">Lihat Turnamen ↓</BrutaLink>
          </div>
        </div>
        <div className="relative">
          <BrutaCard className="rotate-[-2deg] bg-cream p-4 text-black">
            <p className="font-display text-xs font-black uppercase">Semifinal · BO3</p>
            <div className="mt-3 space-y-2">
              {[
                { a: "RRQ Kos", b: "Evosi Kos", sa: 2, sb: 0, win: true },
                { a: "Onic Kost", b: "Alter Ego Kos", sa: 1, sb: 2, win: false },
              ].map((m, i) => (
                <div key={i} className="rounded-xl border-[3px] border-black bg-white p-2 shadow-bruta-sm">
                  <div className="flex items-center justify-between font-body text-sm font-bold">
                    <span>{m.a}</span>
                    <span className="font-display">{m.sa}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t-2 border-dashed border-black/20 pt-1 font-body text-sm font-bold">
                    <span>{m.b}</span>
                    <span className="font-display">{m.sb}</span>
                  </div>
                </div>
              ))}
            </div>
          </BrutaCard>
          <Sticker className="absolute -top-4 right-6">LIVE!</Sticker>
        </div>
      </div>
    </section>
  );
}

async function LiveNow() {
  const live = await withDemo(
    () =>
      db.tournament.findMany({
        where: { status: "ONGOING" },
        orderBy: { startDate: "asc" },
        include: { _count: { select: { registrations: true } } },
      }),
    demoTournaments.filter((t) => t.status === "ONGOING")
  );
  if (live.length === 0) return null;
  return (
    <section className="border-y-4 border-black bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 rounded-full border-2 border-black bg-livered px-3 py-1 font-display text-[11px] font-bold uppercase tracking-widest text-white">
            <span className="h-2 w-2 animate-blink-live rounded-full bg-white" />
            Live
          </span>
          <h2 className="font-display text-2xl font-black text-cream">
            SEDANG <span className="text-popcyan">BERLANGSUNG</span>
          </h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((t) => (
            <article
              key={t.id}
              className="bruta-press overflow-hidden rounded-2xl border-[3px] border-black bg-elevated shadow-bruta"
            >
              <div
                className="border-b-[3px] border-black px-4 py-5"
                style={{ background: gameColor(t.game) }}
              >
                <p className="font-display text-[11px] font-black uppercase tracking-widest text-black">
                  {t.game}
                </p>
                <p className="mt-1 font-display text-lg font-black leading-tight text-black">
                  {t.title}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-display text-lg font-black text-sun">
                    {rupiah(t.prizePool)}
                  </p>
                  <p className="font-body text-xs text-mutedcream">
                    {t._count.registrations}/{t.maxTeams} tim · tayang sekarang
                  </p>
                </div>
                <BrutaLink
                  href={`/tournaments/${t.id}`}
                  variant="cyan"
                  className="!px-3 !py-2 !text-xs"
                >
                  Tonton
                </BrutaLink>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

async function TournamentGrid() {
  const tournaments = await withDemo(
    () =>
      db.tournament.findMany({
        orderBy: { startDate: "asc" },
        include: { _count: { select: { registrations: true } } },
      }),
    demoTournaments
  );
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl font-black text-cream">
          TURNAMEN <span className="text-sun">AKTIF</span>
        </h2>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tournaments.map((t) => (
          <article
            key={t.id}
            className="bruta-press overflow-hidden rounded-2xl border-[3px] border-black bg-card shadow-bruta"
          >
            <div
              className="border-b-[3px] border-black px-4 py-6"
              style={{ background: gameColor(t.game) }}
            >
              <p className="font-display text-[11px] font-black uppercase tracking-widest text-black">
                {t.game}
              </p>
              <p className="mt-1 font-display text-lg font-black leading-tight text-black">
                {t.title}
              </p>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <Tag color={statusBadge(t.status)}>{t.status}</Tag>
                <span className="font-body text-xs font-bold text-mutedcream">{t._count.registrations}/{t.maxTeams} tim</span>
              </div>
              <p className="font-display text-xl font-black text-sun">{rupiah(t.prizePool)}</p>
              <p className="font-body text-xs text-mutedcream">Mulai · {tanggal(t.startDate)}</p>
              <BrutaLink href={`/tournaments/${t.id}`} variant="sun" className="w-full !px-3 !py-2 !text-xs">
                Lihat Detail
              </BrutaLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BracketPreview({
  tournament,
}: {
  tournament: {
    id: string;
    title: string;
    matches: Match[];
    registrations: Pick<Registration, "id" | "teamName">[];
  };
}) {
  if (tournament.matches.length === 0) return null;
  const teams = new Map(tournament.registrations.map((r) => [r.id, r.teamName]));
  const nameOf = (id: string | null | undefined) =>
    (id && teams.get(id)) || "TBD";
  const rounds = [...new Set(tournament.matches.map((m) => m.round))].sort(
    (a, b) => a - b
  );
  return (
    <section className="border-y-4 border-black bg-paperdark">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-2xl font-black text-cream">
          BRACKET <span className="text-popcyan">SINGLE ELIMINATION</span>
        </h2>
        <p className="mt-1 font-body text-xs text-mutedcream">
          {tournament.title}
        </p>
        <div className="mt-6 flex gap-6 overflow-x-auto pb-4">
          {rounds.map((r) => (
            <div key={r} className="min-w-[260px]">
              <p className="mb-3 inline-block rounded-lg border-[3px] border-black bg-cream px-3 py-1 font-display text-xs font-black text-black">
                {r === rounds.length ? "FINAL" : r === 1 ? "R1" : `R${r}`}
              </p>
              <div className="space-y-4">
                {tournament.matches
                  .filter((m) => m.round === r)
                  .map((m) =>
                    m.isBye ? (
                      <div
                        key={m.id}
                        className="bye-stripes rounded-2xl border-[3px] border-black p-4 shadow-bruta"
                      >
                        <span className="inline-block rotate-[-3deg] font-comic text-2xl text-sun">
                          BYE!
                        </span>
                        <p className="mt-1 font-body text-xs font-bold text-cream">
                          {nameOf(m.winnerId)} lolos otomatis
                        </p>
                      </div>
                    ) : (
                      <div
                        key={m.id}
                        className={`rounded-2xl border-[3px] border-black p-3 shadow-bruta ${
                          m.status === "DONE" ? "bg-poplime" : "bg-cream"
                        } text-black`}
                      >
                        <div className="flex items-center justify-between font-body text-sm font-bold">
                          <span>{nameOf(m.teamAId)}</span>
                          <span className="font-display">
                            {m.scoreA ?? "–"}
                            {m.winnerId === m.teamAId && m.teamAId
                              ? " ★"
                              : ""}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center justify-between border-t-2 border-dashed border-black/20 pt-1 font-body text-sm font-bold">
                          <span>{nameOf(m.teamBId)}</span>
                          <span className="font-display">
                            {m.scoreB ?? "–"}
                            {m.winnerId === m.teamBId && m.teamBId
                              ? " ★"
                              : ""}
                          </span>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
        <Link
          href={`/tournaments/${tournament.id}`}
          className="bruta-press mt-6 inline-block rounded-xl border-[3px] border-black bg-sun px-5 py-2 font-display text-xs font-bold uppercase text-black shadow-bruta"
        >
          Lihat Bracket Lengkap →
        </Link>
      </div>
    </section>
  );
}

export default async function Home() {
  const bracketTournament = await withDemo(
    () =>
      db.tournament.findFirst({
        where: { matches: { some: {} } },
        orderBy: { startDate: "asc" },
        include: {
          matches: { orderBy: [{ round: "asc" }, { position: "asc" }] },
          registrations: { select: { id: true, teamName: true } },
        },
      }),
    null
  );
  return (
    <div className="flex min-h-full flex-1 flex-col bg-void font-body text-cream">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <LiveNow />
        <TournamentGrid />
        {bracketTournament && (
          <BracketPreview tournament={bracketTournament} />
        )}
      </main>
      <Footer />
    </div>
  );
}
