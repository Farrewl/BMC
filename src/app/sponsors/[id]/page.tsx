import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoProposalDetail, withDemo } from "@/lib/demo";
import { rupiah } from "@/lib/format";
import { calcSponsorDeal } from "@/lib/fees";
import { fundProposalAction } from "@/lib/actions";

const input =
  "w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black";

export default async function ProposalDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await withDemo(
    () =>
      db.sponsorProposal.findUnique({
        where: { id },
        include: {
          tournament: true,
          deals: { include: { sponsor: { select: { name: true } } } },
        },
      }),
    demoProposalDetail(id)
  );
  if (!p) notFound();

  const paid = p.deals.filter((d) => d.status === "PAID").reduce((s, d) => s + d.amount, 0);
  const pct = Math.min(100, Math.round((paid / p.targetAmount) * 100));
  const demo = calcSponsorDeal(1_000_000);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-wrap gap-2">
          <BrutaBadge color="#FF6B1A">{p.tournament.game}</BrutaBadge>
          <BrutaBadge color="#F8F4E8">{p.status}</BrutaBadge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-black">{p.title.toUpperCase()}</h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          {p.tournament.title} · {p.expectedReach} penonton · {p.tournament.maxTeams} tim
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">PITCH</p>
            <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border-2 border-black bg-elevated p-3 font-body text-xs">
              {p.pitchText}
            </pre>
            <div className="mt-3 h-5 overflow-hidden rounded-full border-[3px] border-black bg-cream">
              <div className="progress-stripes h-full border-r-[3px] border-black" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 font-body text-sm"><b>{rupiah(paid)}</b> / {rupiah(p.targetAmount)} · {pct}%</p>
          </BrutaCard>

          <BrutaCard className="h-fit bg-cream p-0 text-black">
            <div className="border-b-[3px] border-black bg-sun px-4 py-3">
              <p className="font-display text-sm font-black">DANAI ACARA · FEE 10%</p>
            </div>
            <div className="px-4 pb-4 pt-4 font-body text-sm font-medium">
              <div className="flex justify-between"><span>Contoh nominal</span><span>{rupiah(1_000_000)}</span></div>
              <div className="mt-1 flex justify-between"><span>Fee platform 10%</span><span>{rupiah(demo.platformFee)}</span></div>
              <div className="mt-2 flex justify-between border-t-2 border-dashed border-black/30 pt-2 font-display font-black">
                <span>PANITIA TERIMA</span><span>{rupiah(demo.netToOrganizer)}</span>
              </div>
              <form action={fundProposalAction} className="mt-4 space-y-2">
                <input type="hidden" name="proposalId" value={p.id} />
                <input name="amount" type="number" min={50000} defaultValue={1000000} required className={input} />
                <button type="submit" className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-poporange px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta">
                  Danai (Mock Bayar) →
                </button>
              </form>
              <p className="mt-2 font-body text-xs">Mock bayar 1,2 dtk, langsung PAID, ref MOCK-XXXXXX.</p>
              <div className="mt-3 space-y-2">
                {p.deals.slice(0, 3).map((d) => (
                  <div key={d.id} className="flex justify-between rounded-lg border-2 border-black bg-white px-2 py-1 font-body text-xs font-bold">
                    <span>{d.sponsor.name}</span>
                    <span>{rupiah(d.amount)} · {d.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </BrutaCard>
        </div>

        <BrutaLink href="/sponsors" variant="dark" className="mt-6 !py-2 !text-xs">← Kembali ke Directory</BrutaLink>
      </main>
      <Footer />
    </div>
  );
}
