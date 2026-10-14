import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge, BrutaLink } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoProposals, withDemo } from "@/lib/demo";
import { rupiah } from "@/lib/format";
import { requireSession } from "@/lib/session";

export default async function SponsorsPage() {
  await requireSession("/sponsors");
  const proposals = await withDemo(
    () =>
      db.sponsorProposal.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          tournament: { select: { title: true, game: true } },
          deals: true,
        },
      }),
    demoProposals
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FF9E8A">Sponsor Directory</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">SPONSOR DIRECTORY</h1>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {proposals.map((p) => {
            const paid = p.deals
              .filter((d) => d.status === "PAID")
              .reduce((s, d) => s + d.amount, 0);
            const pct = Math.min(100, Math.round((paid / p.targetAmount) * 100));
            const benefits: string[] = (() => {
              try {
                return JSON.parse(p.benefits);
              } catch {
                return [p.benefits];
              }
            })();
            return (
              <BrutaCard key={p.id} className="p-5">
                <div className="flex flex-wrap gap-2">
                  <BrutaBadge color="#FF9E8A">{p.tournament.game}</BrutaBadge>
                  <BrutaBadge color="#F6F2FB">{p.status}</BrutaBadge>
                </div>
                <p className="mt-3 font-display text-lg font-black">{p.title}</p>
                <p className="mt-1 font-body text-xs text-mutedcream">
                  {p.tournament.title} · {p.expectedReach} penonton
                </p>
                <div className="mt-3 h-5 overflow-hidden rounded-full border-[3px] border-black bg-cream">
                  <div
                    className="progress-stripes h-full border-r-[3px] border-black"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-2 font-body text-sm">
                  <b>{rupiah(paid)}</b> / {rupiah(p.targetAmount)} · {pct}%
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {benefits.slice(0, 3).map((b) => (
                    <BrutaBadge key={b} color="#B9A6FF">{b}</BrutaBadge>
                  ))}
                </div>
                <BrutaLink href="/sponsor" variant="sun" className="mt-4 w-full !py-2 !text-xs">
                  Danai via Dashboard Sponsor →
                </BrutaLink>
                <BrutaLink href={`/sponsors/${p.id}`} variant="dark" className="mt-2 w-full !py-2 !text-xs">
                  Detail + Danai →
                </BrutaLink>
              </BrutaCard>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
