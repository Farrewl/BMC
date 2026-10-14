import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaTitle } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoTickets, withDemo } from "@/lib/demo";
import { helpTicketAction } from "@/lib/actions";
import { requireSession } from "@/lib/session";

export default async function HelpPage() {
  const session = await requireSession("/help");
  const tickets = await withDemo(
    () =>
      db.helpTicket.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
        take: 5,
      }),
    demoTickets
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
        <BrutaTitle color="#22D3EE">Bantuan / Helpdesk</BrutaTitle>
        <p className="mt-4 font-body text-sm text-mutedcream">
          Kirim kendala kamu, balasan admin muncul di daftar pesan di bawah.
        </p>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">KIRIM PESAN</p>
          <form action={helpTicketAction} className="mt-3 space-y-2">
            <input name="subject" required minLength={4} placeholder="Subjek…" className="w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black" />
            <textarea name="message" required minLength={10} rows={3} placeholder="Ceritakan kendala…" className="w-full rounded-xl border-[3px] border-black bg-white px-3 py-2 font-body text-sm font-medium text-black" />
            <button type="submit" className="bruta-press w-full cursor-pointer rounded-xl border-[3px] border-black bg-sun px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta">
              Kirim Pesan →
            </button>
          </form>
        </BrutaCard>

        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">PESAN TERAKHIR</p>
          <div className="mt-3 space-y-2">
            {tickets.length === 0 ? (
              <p className="font-body text-sm text-mutedcream">
                Belum ada pesan.
              </p>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                  <p className="font-body text-sm font-bold">{t.subject}</p>
                  <p className="font-body text-xs text-mutedcream">{t.user.name} · {t.status} · {t.message}</p>
                  {t.reply ? (
                    <div className="mt-2 rounded-lg border-2 border-black bg-card px-3 py-2">
                      <p className="font-display text-[11px] font-bold uppercase tracking-wide text-win">
                        Balasan Admin
                      </p>
                      <p className="mt-1 font-body text-sm text-cream">{t.reply}</p>
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </BrutaCard>
      </main>
      <Footer />
    </div>
  );
}
