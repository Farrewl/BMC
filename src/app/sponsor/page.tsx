import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { rupiah } from "@/lib/format";
import { calcSponsorDeal } from "@/lib/fees";
import { bookAdAction } from "@/lib/actions";

export default async function SponsorHome() {
  const proposals = await db.sponsorProposal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      tournament: { select: { title: true } },
      deals: { include: { sponsor: { select: { name: true } } } },
    },
    take: 6,
  });
  const deals = await db.sponsorDeal.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sponsor: { select: { name: true } },
      proposal: { select: { title: true } },
    },
    take: 5,
  });
  const adSlots = await db.adSlot.findMany({
    include: {
      tournament: { select: { title: true } },
      bookings: true,
    },
    take: 6,
  });
  const totalPaid = deals
    .filter((d) => d.status === "PAID")
    .reduce((s, d) => s + d.amount, 0);
  const { platformFee } = calcSponsorDeal(totalPaid || 1_000_000);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Sponsor" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FF6B1A">Sponsor · UMKM</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">DASHBOARD SPONSOR</h1>
        <p className="mt-2 max-w-2xl font-body text-sm text-mutedcream">
          Danai proposal, pantau fee 10% transparan, dan booking slot iklan stream. Contoh: Rp 1jt → fee Rp 100rb, panitia Rp 900rb.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">TOTAL DIDANAI</p>
            <p className="mt-1 font-display text-2xl font-black text-poporange">{rupiah(totalPaid)}</p>
          </BrutaCard>
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">FEE PLATFORM 10%</p>
            <p className="mt-1 font-display text-2xl font-black text-sun">{rupiah(calcSponsorDeal(totalPaid || 0).platformFee)}</p>
          </BrutaCard>
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">SLOT IKLAN</p>
            <p className="mt-1 font-display text-2xl font-black text-poplime">{adSlots.length} slot</p>
          </BrutaCard>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">PROPOSAL TERBUKA</p>
            <div className="mt-3 space-y-2">
              {proposals.slice(0, 3).map((p) => (
                <div key={p.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                  <p className="font-body text-sm font-bold">{p.title}</p>
                  <p className="font-body text-xs text-mutedcream">
                    {p.tournament.title} · target {rupiah(p.targetAmount)} · {p.deals.length} deal
                  </p>
                </div>
              ))}
            </div>
            <BrutaLink href="/sponsors" variant="sun" className="mt-4 w-full !py-2 !text-xs">
              Buka Sponsor Directory →
            </BrutaLink>
          </BrutaCard>

          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">DEAL TERAKHIR</p>
            <div className="mt-3 space-y-2">
              {deals.length === 0 && (
                <p className="font-body text-sm text-mutedcream">Belum ada deal.</p>
              )}
              {deals.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-xl border-2 border-black bg-elevated px-3 py-2">
                  <div>
                    <p className="font-body text-sm font-bold">{d.sponsor.name}</p>
                    <p className="font-body text-xs text-mutedcream">{d.proposal.title}</p>
                  </div>
                  <BrutaBadge color={d.status === "PAID" ? "#22C55E" : "#F59E0B"}>
                    {rupiah(d.amount)}
                  </BrutaBadge>
                </div>
              ))}
            </div>
            <p className="mt-3 font-body text-xs text-mutedcream">
              Fee contoh Rp 1jt → Rp {platformFee.toLocaleString("id-ID")}. Semua deal tercatat di kwitansi.
            </p>
          </BrutaCard>
        </div>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">BOOKING SLOT IKLAN STREAM UMKM</p>
          <p className="mt-1 font-body text-xs text-mutedcream">Banner langsung muncul di halaman turnamen. Contoh brand kos: Kopi Kos Ndalem.</p>
          <form action={bookAdAction} className="mt-3 grid gap-2 sm:grid-cols-4">
            <select name="slotId" className="rounded-lg border-2 border-black bg-white px-2 py-2 font-body text-xs font-bold text-black" defaultValue="">
              <option value="" disabled>Pilih slot…</option>
              {adSlots.filter((s) => s.bookings.length === 0).map((s) => (
                <option key={s.id} value={s.id}>{s.tournament.title} · {s.placement.replace("_", " ")} · {rupiah(s.price)}</option>
              ))}
            </select>
            <input name="brandName" required minLength={3} placeholder="Brand…" className="rounded-lg border-2 border-black bg-white px-2 py-2 font-body text-xs font-bold text-black" />
            <input name="bannerText" required minLength={4} placeholder="Teks banner…" className="rounded-lg border-2 border-black bg-white px-2 py-2 font-body text-xs font-bold text-black" />
            <button type="submit" className="cursor-pointer rounded-lg border-2 border-black bg-sun px-3 py-2 font-display text-[11px] font-black text-black">BOOKING</button>
          </form>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {adSlots.map((s) => (
              <div key={s.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                <p className="font-body text-sm font-bold">{s.placement.replace("_", " ")}</p>
                <p className="font-body text-xs text-mutedcream">
                  {s.tournament.title} · {rupiah(s.price)} · {s.bookings.length > 0 ? `${s.bookings.length} terbooking` : "kosong"}
                </p>
              </div>
            ))}
          </div>
        </BrutaCard>
      </main>
      <Footer />
    </div>
  );
}
