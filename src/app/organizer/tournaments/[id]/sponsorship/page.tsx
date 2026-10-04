import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoTournamentDetail, withDemo } from "@/lib/demo";
import { rupiah } from "@/lib/format";
import { createProposalAction } from "@/lib/actions";
import { buildProposal } from "@/lib/proposal";

const input =
  "w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black";

export default async function SponsorshipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await withDemo(
    () =>
      db.tournament.findUnique({
        where: { id },
        include: { proposals: { include: { deals: true } } },
      }),
    demoTournamentDetail(id)
  );
  if (!t) notFound();

  const preview = buildProposal({
    eventName: t.title,
    game: t.game,
    date: t.startDate.toISOString().slice(0, 10),
    participants: t.maxTeams,
    viewers: 2000,
    target: 3_000_000,
    benefits: ["Logo jersey", "Shoutout MC", "Banner stream"],
    contact: "panitia@kampus.id",
  });

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Panitia" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <BrutaBadge color="#FF6B1A">Panitia · Proposal Sponsor</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">{t.title.toUpperCase()}</h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          Isi target dana → preview template → simpan ke Sponsor Directory. Tanpa AI, template string + print.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">FORM PROPOSAL</p>
            <form action={createProposalAction} className="mt-3 space-y-3">
              <input type="hidden" name="tournamentId" value={t.id} />
              <div>
                <label className="font-display text-[11px] font-bold">JUDUL PROPOSAL</label>
                <input name="title" required minLength={4} defaultValue={`${t.title} x Kopi Kos`} className={input} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display text-[11px] font-bold">TARGET DANA (RP)</label>
                  <input name="targetAmount" type="number" min={100000} defaultValue={3000000} required className={input} />
                </div>
                <div>
                  <label className="font-display text-[11px] font-bold">EST. PENONTON</label>
                  <input name="expectedReach" type="number" min={50} defaultValue={2000} required className={input} />
                </div>
              </div>
              <div>
                <label className="font-display text-[11px] font-bold">KONTAK PANITIA</label>
                <input name="contact" required minLength={4} defaultValue="panitia@kampus.id" className={input} />
              </div>
              <button type="submit" className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-sun px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta">
                Simpan ke Directory →
              </button>
            </form>
            <p className="mt-3 font-body text-xs text-mutedcream">
              Sudah ada {t.proposals.length} proposal. Fee deal 10%: Rp 1jt → panitia {rupiah(900_000)}.
            </p>
          </BrutaCard>

          <BrutaCard className="p-5">
            <p className="font-display text-sm font-black">PREVIEW TEMPLATE</p>
            <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border-2 border-black bg-elevated p-3 font-body text-xs">
              {preview}
            </pre>
            <button
              onClick={() => window.print()}
              className="mt-3 w-full cursor-pointer rounded-xl border-[3px] border-black bg-cream px-4 py-2 font-display text-xs font-bold text-black"
            >
              Cetak / PDF 🖨
            </button>
          </BrutaCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
