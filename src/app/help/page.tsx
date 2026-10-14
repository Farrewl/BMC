import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { demoTickets, withDemo } from "@/lib/demo";
import { helpTicketAction } from "@/lib/actions";
import { requireSession } from "@/lib/session";

export default async function HelpPage() {
  await requireSession("/help");
  const tickets = await withDemo(
    () =>
      db.helpTicket.findMany({
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
        <BrutaBadge color="#F8F4E8">Bantuan</BrutaBadge>
        <h1 className="mt-3 font-display text-3xl font-black">BANTUAN / HELPDESK</h1>

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
            {tickets.map((t) => (
              <div key={t.id} className="rounded-xl border-2 border-black bg-elevated px-3 py-2">
                <p className="font-body text-sm font-bold">{t.subject}</p>
                <p className="font-body text-xs text-mutedcream">{t.user.name} · {t.status} · {t.message}</p>
              </div>
            ))}
          </div>
        </BrutaCard>
      </main>
      <Footer />
    </div>
  );
}
