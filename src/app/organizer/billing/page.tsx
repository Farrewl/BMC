import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoTournaments, demoDeals, withDemo } from "@/lib/demo";
import { rupiah } from "@/lib/format";
import { calcSaasFee, calcSponsorDeal } from "@/lib/fees";

export default async function BillingPage() {
  const tournaments = await withDemo(
    () =>
      db.tournament.findMany({
        include: { _count: { select: { registrations: true } } },
      }),
    demoTournaments
  );
  const deals = await withDemo(
    () => db.sponsorDeal.findMany({ where: { status: "PAID" } }),
    demoDeals
  );
  const eventsHeld = tournaments.length;
  const saasRows = tournaments.map((t) => ({ t, fee: calcSaasFee(t.maxTeams, eventsHeld) }));
  const totalSaas = saasRows.reduce((s, r) => s + r.fee.net, 0);
  const totalDeal = deals.reduce((s, d) => s + d.amount, 0);
  const totalFee = deals.reduce((s, d) => s + d.platformFee, 0);
  const loyal = eventsHeld >= 3;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Panitia" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FFD02B">Panitia · Billing</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">BILLING</h1>
        <p className="mt-2 max-w-2xl font-body text-sm text-mutedcream">
          Tiga sumber pendapatan LombaEsport: SaaS fee per event, success fee 10% sponsor, convenience fee solo player.
          {loyal ? " Badge Organizer Langganan aktif: diskon 10% SaaS fee." : " Capai 3 event untuk badge langganan diskon 10%."}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">SAAS FEE</p>
            <p className="mt-1 font-display text-2xl font-black text-sun">{rupiah(totalSaas)}</p>
          </BrutaCard>
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">SUCCESS FEE 10%</p>
            <p className="mt-1 font-display text-2xl font-black text-poporange">{rupiah(totalFee)}</p>
          </BrutaCard>
          <BrutaCard className="p-4">
            <p className="font-display text-[11px] font-bold text-mutedcream">DANA SPONSOR</p>
            <p className="mt-1 font-display text-2xl font-black text-poplime">{rupiah(totalDeal)}</p>
          </BrutaCard>
        </div>

        <BrutaCard className="mt-6 p-5">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-black">RINCIAN SAAS PER EVENT</p>
            {loyal && <BrutaBadge color="#B5E048">Langganan -10%</BrutaBadge>}
          </div>
          <div className="mt-3 space-y-2">
            {saasRows.map(({ t, fee }) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border-2 border-black bg-elevated px-3 py-2">
                <div>
                  <p className="font-body text-sm font-bold">{t.title}</p>
                  <p className="font-body text-xs text-mutedcream">{t.maxTeams} tim · {t._count.registrations} terdaftar</p>
                </div>
                <p className="font-display text-sm font-black text-sun">{rupiah(fee.net)}</p>
              </div>
            ))}
          </div>
          <BrutaLink href="/organizer" variant="dark" className="mt-4 !py-2 !text-xs">← Dashboard Panitia</BrutaLink>
        </BrutaCard>
      </main>
      <Footer />
    </div>
  );
}
