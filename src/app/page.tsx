import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaLink, BrutaCard, BrutaBadge, Sticker } from "@/components/ui/bruta";
import { gameColor, statusBadge } from "@/lib/data";
import { rupiah } from "@/lib/format";
import { tanggal } from "@/lib/format";
import { db } from "@/lib/db";

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
            <BrutaLink href="#demo" variant="primary">Coba Demo ↓</BrutaLink>
            <BrutaLink href="/tournaments" variant="ghost">Lihat Turnamen</BrutaLink>
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
  const tournaments = await db.tournament.findMany({
    orderBy: { startDate: "asc" },
    include: { _count: { select: { registrations: true } } },
  });
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

function MoneySection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-5 px-4 py-12 md:grid-cols-3">
      <BrutaCard className="bg-cream p-0 text-black">
        <div className="border-b-[3px] border-black bg-sun px-4 py-3">
          <p className="font-display text-sm font-black">KWITANSI · SAAS FEE</p>
        </div>
        <div className="zigzag-bottom bg-cream px-4 pb-8 pt-4 font-body text-sm font-medium">
          <div className="flex justify-between"><span>Base / event</span><span>Rp 150.000</span></div>
          <div className="mt-1 flex justify-between"><span>Diskon loyalitas ≥3 event</span><span>-10%</span></div>
          <div className="mt-2 flex justify-between border-t-2 border-dashed border-black/30 pt-2 font-display font-black">
            <span>TOTAL</span><span>Rp 135.000</span>
          </div>
        </div>
      </BrutaCard>
      <BrutaCard className="p-5">
        <p className="font-display text-sm font-black text-poporange">SPONSOR DIRECTORY</p>
        <div className="mt-3 h-5 overflow-hidden rounded-full border-[3px] border-black bg-cream">
          <div className="progress-stripes h-full w-2/3 border-r-[3px] border-black" />
        </div>
        <p className="mt-2 font-body text-sm text-cream">
          <b>Rp 3,2jt</b> / Rp 5jt · Kopi Kos Ndalem
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <BrutaBadge color="#FF6B1A">Logo jersey</BrutaBadge>
          <BrutaBadge color="#22D3EE">Shoutout</BrutaBadge>
          <BrutaBadge color="#B5E048">Banner stream</BrutaBadge>
        </div>
      </BrutaCard>
      <BrutaCard className="p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-[3px] border-black bg-popcyan font-display text-lg font-black text-black">
            VD
          </span>
          <div>
            <p className="font-display text-sm font-black text-cream">LFG · Valorant</p>
            <p className="font-body text-xs text-mutedcream">Duelist · Immortal · malam hari</p>
          </div>
        </div>
        <BrutaLink href="/lfg" variant="cyan" className="mt-4 w-full !py-2 !text-xs">
          Ajak Gabung →
        </BrutaLink>
      </BrutaCard>
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
        <MoneySection />
        <section className="border-t-4 border-black bg-card">
          <div id="demo" className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-lg font-black text-cream">
              SIAP DEMO 10 MENIT? IKUTI ALUR A → B → C.
            </p>
            <div className="flex gap-3">
              <BrutaLink href="/organizer" variant="lime">Masuk Panitia</BrutaLink>
              <BrutaLink href="/tournaments" variant="dark">Lihat Turnamen</BrutaLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
