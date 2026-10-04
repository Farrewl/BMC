import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { gameColor, statusBadge } from "@/lib/data";
import { rupiah, tanggal } from "@/lib/format";
import { db } from "@/lib/db";

export default async function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await db.tournament.findUnique({
    where: { id },
    include: {
      registrations: { orderBy: { seed: "asc" } },
      matches: { orderBy: [{ round: "asc" }, { position: "asc" }] },
      proposals: { include: { deals: true } },
      adSlots: { include: { bookings: true } },
    },
  });
  if (!t) notFound();

  const funded = t.proposals.reduce(
    (s, p) => s + p.deals.filter((d) => d.status === "PAID").reduce((a, d) => a + d.amount, 0),
    0
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <BrutaBadge color={statusBadge(t.status)}>{t.status}</BrutaBadge>
          <BrutaBadge color={gameColor(t.game)}>{t.game}</BrutaBadge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-black">{t.title.toUpperCase()}</h1>
        <p className="mt-2 max-w-2xl font-body text-sm text-mutedcream">{t.description}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { l: "SLOT", v: `${t.registrations.length}/${t.maxTeams} tim` },
            { l: "PRIZE", v: rupiah(t.prizePool) },
            { l: "TIKET", v: rupiah(t.entryFee) },
            { l: "MULAI", v: tanggal(t.startDate) },
          ].map((s) => (
            <BrutaCard key={s.l} className="p-4">
              <p className="font-display text-[11px] font-bold text-mutedcream">{s.l}</p>
              <p className="mt-1 font-display text-lg font-black text-sun">{s.v}</p>
            </BrutaCard>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">PESERTA ({t.registrations.length})</p>
            <div className="mt-3 space-y-2">
              {t.registrations.length === 0 && (
                <p className="font-body text-sm text-mutedcream">Belum ada tim terdaftar.</p>
              )}
              {t.registrations.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between rounded-xl border-2 border-black bg-elevated px-3 py-2">
                  <span className="font-body text-sm font-bold">#{i + 1} {r.teamName}</span>
                  <BrutaBadge color={r.paymentStatus === "PAID" ? "#22C55E" : "#F59E0B"}>{r.paymentStatus}</BrutaBadge>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <BrutaLink href={`/organizer/tournaments/${t.id}/manage`} variant="lime" className="flex-1 !py-2 !text-xs">Kelola Bracket ⚙</BrutaLink>
              <BrutaLink href={`/organizer/tournaments/${t.id}/sponsorship`} variant="sun" className="flex-1 !py-2 !text-xs">+ Proposal</BrutaLink>
              <BrutaLink href="/player" variant="cyan" className="flex-1 !py-2 !text-xs">Daftar →</BrutaLink>
            </div>
          </BrutaCard>

          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">SPONSORSHIP · {rupiah(funded)} TERKUMPUL</p>
            <div className="mt-3 space-y-2">
              {t.proposals.length === 0 && (
                <p className="font-body text-sm text-mutedcream">Belum ada proposal.</p>
              )}
              {t.proposals.slice(0, 3).map((p) => (
                <div key={p.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                  <p className="font-body text-sm font-bold">{p.title}</p>
                  <p className="font-body text-xs text-mutedcream">Target {rupiah(p.targetAmount)} · {p.expectedReach} penonton</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <BrutaLink href="/sponsors" variant="sun" className="flex-1 !py-2 !text-xs">Directory →</BrutaLink>
              <BrutaLink href={`/organizer/tournaments/${t.id}/sponsorship`} variant="lime" className="flex-1 !py-2 !text-xs">+ Proposal</BrutaLink>
            </div>
          </BrutaCard>
        </div>

        <BrutaCard className="mt-6 overflow-hidden p-0">
          <div className="border-b-[3px] border-black bg-livered px-4 py-3">
            <p className="font-display text-sm font-black text-white">● LIVE STREAM + IKLAN UMKM</p>
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            <div className="border-b-[3px] border-black md:col-span-2 md:border-b-0 md:border-r-[3px]">
              {t.streamUrl ? (
                <iframe
                  src={t.streamUrl}
                  title={`Stream ${t.title}`}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="halftone-dark flex aspect-video items-center justify-center">
                  <p className="font-display text-lg font-black text-mutedcream">STREAM BELUM DIMULAI</p>
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              {t.adSlots.length === 0 && (
                <p className="font-body text-sm text-mutedcream">Belum ada slot iklan.</p>
              )}
              {t.adSlots.map((s) => (
                <div key={s.id}>
                  {s.bookings.length > 0 ? (
                    s.bookings.map((b) => (
                      <div key={b.id} className="rounded-xl border-[3px] border-black p-3 shadow-bruta-sm" style={{ background: b.bannerColor }}>
                        <p className="font-display text-xs font-black text-black">{b.brandName}</p>
                        <p className="font-body text-xs font-bold text-black">{b.bannerText}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border-2 border-dashed border-mutedcream p-3">
                      <p className="font-body text-xs text-mutedcream">{s.placement.replace("_", " ")} · {rupiah(s.price)} · Slot tersedia</p>
                    </div>
                  )}
                </div>
              ))}
              <BrutaLink href="/sponsor" variant="sun" className="w-full !py-2 !text-xs">Booking Slot →</BrutaLink>
            </div>
          </div>
        </BrutaCard>

        <Link href="/tournaments" className="mt-6 inline-block font-display text-xs font-bold text-sun underline">← Kembali</Link>
      </main>
      <Footer />
    </div>
  );
}
