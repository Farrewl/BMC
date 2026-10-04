import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge } from "@/components/ui/bruta";
import { createTournamentAction } from "@/lib/actions";
import { GAMES } from "@/lib/constants";
import { calcSaasFee } from "@/lib/fees";

const input =
  "w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black";

export default function NewTournamentPage() {
  const fee16 = calcSaasFee(16, 0);
  const feeLoyal = calcSaasFee(16, 3);

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Panitia" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <BrutaBadge color="#8B5CF6">Panitia · Buat Turnamen</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">BUAT TURNAMEN</h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          Publish langsung bayar SaaS fee (mock). Setelah jadi, daftarkan tim lalu generate bracket.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <BrutaCard className="p-5">
            <form action={createTournamentAction} className="space-y-3">
              <div>
                <label className="font-display text-[11px] font-bold">NAMA TURNAMEN</label>
                <input name="title" required minLength={4} placeholder="Piala Rektor Cup" className={input} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-display text-[11px] font-bold">GAME</label>
                  <select name="game" className={input} defaultValue={GAMES[0]}>
                    {GAMES.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-display text-[11px] font-bold">TANGGAL</label>
                  <input name="startDate" type="date" required defaultValue="2026-11-15" className={input} />
                </div>
              </div>
              <div>
                <label className="font-display text-[11px] font-bold">DESKRIPSI</label>
                <textarea name="description" required minLength={10} rows={3} placeholder="Turnamen antar fakultas, single elimination." className={input} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-display text-[11px] font-bold">MAX TIM</label>
                  <input name="maxTeams" type="number" min={2} max={32} defaultValue={16} required className={input} />
                </div>
                <div>
                  <label className="font-display text-[11px] font-bold">TIKET (RP)</label>
                  <input name="entryFee" type="number" min={0} defaultValue={50000} required className={input} />
                </div>
                <div>
                  <label className="font-display text-[11px] font-bold">PRIZE (RP)</label>
                  <input name="prizePool" type="number" min={0} defaultValue={5000000} required className={input} />
                </div>
              </div>
              <div>
                <label className="font-display text-[11px] font-bold">LINK STREAM (OPSIONAL)</label>
                <input name="streamUrl" placeholder="https://www.youtube.com/embed/..." className={input} />
              </div>
              <button type="submit" className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-poplime px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta">
                Publish + Bayar SaaS Fee →
              </button>
            </form>
          </BrutaCard>

          <BrutaCard className="h-fit bg-cream p-0 text-black">
            <div className="border-b-[3px] border-black bg-sun px-4 py-3">
              <p className="font-display text-sm font-black">KWITANSI · SAAS FEE</p>
            </div>
            <div className="zigzag-bottom bg-cream px-4 pb-8 pt-4 font-body text-sm font-medium">
              <div className="flex justify-between"><span>Base / event (16 tim)</span><span>Rp {fee16.gross.toLocaleString("id-ID")}</span></div>
              <div className="mt-1 flex justify-between"><span>Diskon loyalitas ≥3 event</span><span>-10%</span></div>
              <div className="mt-2 flex justify-between border-t-2 border-dashed border-black/30 pt-2 font-display font-black">
                <span>ORGANIZER LANGGANAN</span><span>Rp {feeLoyal.net.toLocaleString("id-ID")}</span>
              </div>
              <p className="mt-3 font-body text-xs">Mock bayar: langsung sukses, ref MOCK-XXXXXX. Mode demo, bukan uang sungguhan.</p>
            </div>
          </BrutaCard>
        </div>
      </main>
      <Footer />
    </div>
  );
}
