import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaLink, BrutaBadge, BrutaCard, Sticker } from "@/components/ui/bruta";
import { gameColor, statusBadge } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { tanggal } from "@/lib/format";
import { db } from "@/lib/db";
import { demoTournaments, withDemo } from "@/lib/demo";

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
          <BrutaBadge color="#FF4D8D">BMC Kelompok 14 · Ide 2</BrutaBadge>
          <h1 className="mt-4 font-display text-4xl font-black leading-[1.05] text-cream sm:text-5xl">
            KELOLA{" "}
            <span className="inline-block -rotate-1 border-[3px] border-black bg-sun px-2 text-black shadow-bruta-sm">
              TURNAMEN
            </span>{" "}
            TANPA DRAMA BRACKET.
          </h1>
          <p className="mt-4 max-w-md font-body text-base text-mutedcream">
            LombaEsport mengotomatisasi bracket, mempertemukan panitia dengan sponsor
            UMKM, dan membantu solo player cari tim. Mock-up fungsional — bukan
            produk pembayaran sungguhan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <BrutaLink href="/tournaments" variant="primary">Lihat Turnamen ↓</BrutaLink>
            <BrutaLink href="/organizer" variant="ghost">Masuk Panitia</BrutaLink>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <BrutaBadge color="#B5E048">Auto-Bracket jalan</BrutaBadge>
            <BrutaBadge color="#22D3EE">Fee sponsor 10%</BrutaBadge>
            <BrutaBadge color="#FFD02B">LFG + Stream UMKM</BrutaBadge>
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
            <p className="mt-3 inline-block rounded-lg border-2 border-black bg-poplime px-2 py-1 font-display text-[11px] font-black">
              ★ PEMENANG MAJU OTOMATIS
            </p>
          </BrutaCard>
          <BrutaCard className="absolute -bottom-8 -right-2 w-56 rotate-[3deg] bg-poporange p-3 text-black sm:right-4">
            <p className="font-comic text-2xl leading-none">POW! Rp 1jt</p>
            <p className="mt-1 font-body text-xs font-bold">
              Fee platform 10% → Rp 100rb. Panitia terima Rp 900rb.
            </p>
          </BrutaCard>
          <Sticker className="absolute -top-4 right-6">LIVE!</Sticker>
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
        <BrutaBadge color="#F8F4E8">Turnamen</BrutaBadge>
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
                <BrutaBadge color={statusBadge(t.status)}>{t.status}</BrutaBadge>
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

function BracketPreview() {
  return (
    <section className="border-y-4 border-black bg-paperdark">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-2xl font-black text-cream">
          BRACKET <span className="text-popcyan">SINGLE ELIMINATION</span>
        </h2>
        <p className="mt-2 max-w-2xl font-body text-sm text-mutedcream">
          Contoh n=6 → size 8, 2 BYE otomatis lolos. Kartu terang di atas
          background gelap supaya kebaca di proyektor.
        </p>
        <div className="mt-6 flex gap-6 overflow-x-auto pb-4">
          {[
            { round: "R1", cards: ["BYE vs Tim 6", "Tim 3 vs Tim 4", "Tim 2 vs Tim 7", "BYE vs Tim 5"] },
            { round: "SF", cards: ["Tim 1 vs Pemenang R1-2", "Tim 2 vs Pemenang R1-3"] },
            { round: "FINAL", cards: ["??? vs ???"] },
          ].map((col) => (
            <div key={col.round} className="min-w-[260px]">
              <p className="mb-3 inline-block rounded-lg border-[3px] border-black bg-cream px-3 py-1 font-display text-xs font-black text-black">
                {col.round}
              </p>
              <div className="space-y-4">
                {col.cards.map((c, i) =>
                  c.startsWith("BYE") ? (
                    <div
                      key={i}
                      className="bye-stripes rounded-2xl border-[3px] border-black p-4 shadow-bruta"
                    >
                      <span className="inline-block rotate-[-3deg] font-comic text-2xl text-sun">
                        BYE!
                      </span>
                      <p className="mt-1 font-body text-xs font-bold text-cream">{c}</p>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="rounded-2xl border-[3px] border-black bg-cream p-3 text-black shadow-bruta"
                    >
                      <p className="font-body text-sm font-bold">{c}</p>
                      <p className="mt-2 inline-block rounded-md border-2 border-black bg-poplime px-2 font-display text-[11px] font-black">
                        KLIK → INPUT SKOR
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-void font-body text-cream">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <TournamentGrid />
        <BracketPreview />
      </main>
      <Footer />
    </div>
  );
}
