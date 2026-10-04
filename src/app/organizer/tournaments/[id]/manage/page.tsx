import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/layout/DemoBanner";
import { Navbar, Footer } from "@/components/layout/Navbar";
import { BrutaCard, BrutaBadge } from "@/components/ui/bruta";
import { db } from "@/lib/db";
import { rupiah, tanggal } from "@/lib/format";
import { statusBadge, gameColor } from "@/lib/data";
import {
  generateBracketAction,
  submitScoreAction,
  resetBracketAction,
} from "./actions";

export default async function ManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await db.tournament.findUnique({
    where: { id },
    include: {
      registrations: { orderBy: { seed: "asc" } },
      matches: { orderBy: [{ round: "asc" }, { position: "asc" }] },
    },
  });
  if (!t) notFound();

  const regName = new Map(t.registrations.map((r) => [r.id, r.teamName]));
  const nameOf = (rid: string | null) =>
    !rid ? "???" : (regName.get(rid) ?? rid.slice(0, 6));

  const rounds = [...new Set(t.matches.map((m) => m.round))].sort(
    (a, b) => a - b
  );
  const hasBracket = t.matches.length > 0;
  const doneCount = t.matches.filter((m) => m.status === "DONE").length;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void text-cream">
      <DemoBanner />
      <Navbar active="Panitia" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="flex flex-wrap items-center gap-2">
          <BrutaBadge color="#8B5CF6">Kelola · Panitia</BrutaBadge>
          <BrutaBadge color={statusBadge(t.status)}>{t.status}</BrutaBadge>
          <BrutaBadge color={gameColor(t.game)}>{t.game}</BrutaBadge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-black">
          {t.title.toUpperCase()}
        </h1>
        <p className="mt-2 font-body text-sm text-mutedcream">
          {t.registrations.length}/{t.maxTeams} tim · Prize {rupiah(t.prizePool)}{" "}
          · Mulai {tanggal(t.startDate)}
          {hasBracket && ` · ${doneCount}/${t.matches.length} match selesai`}
        </p>

        {/* PESERTA */}
        <BrutaCard className="mt-6 p-5">
          <p className="font-display text-sm font-black">
            PESERTA ({t.registrations.length})
          </p>
          {t.registrations.length < 2 ? (
            <p className="mt-2 font-body text-sm text-mutedcream">
              Minimal 2 tim untuk generate bracket.
            </p>
          ) : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {t.registrations.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border-2 border-black bg-elevated px-3 py-2"
                >
                  <span className="font-body text-sm font-bold">
                    #{i + 1} {r.teamName}
                  </span>
                  <BrutaBadge
                    color={r.paymentStatus === "PAID" ? "#22C55E" : "#F59E0B"}
                  >
                    {r.paymentStatus}
                  </BrutaBadge>
                </div>
              ))}
            </div>
          )}
          {!hasBracket ? (
            <form action={generateBracketAction.bind(null, t.id)}>
              <button
                type="submit"
                className="bruta-press mt-4 w-full cursor-pointer rounded-xl border-[3px] border-black bg-poplime px-5 py-3 font-display text-sm font-bold uppercase text-black shadow-bruta"
              >
                ⚡ Generate Bracket ({t.registrations.length} tim)
              </button>
            </form>
          ) : (
            <form action={resetBracketAction.bind(null, t.id)}>
              <button
                type="submit"
                className="mt-4 cursor-pointer rounded-xl border-[3px] border-black bg-elevated px-4 py-2 font-display text-xs font-bold text-cream"
              >
                ↺ Reset bracket (hapus semua match)
              </button>
            </form>
          )}
          {!hasBracket && (
            <p className="mt-2 font-body text-xs text-mutedcream">
              n={t.registrations.length} → size pangkat-2 terdekat, seed atas
              dapat BYE otomatis. Contoh 6 tim → 8 slot, 2 BYE.
            </p>
          )}
        </BrutaCard>

        {/* BRACKET */}
        {hasBracket && (
          <div className="mt-6">
            <p className="font-display text-lg font-black">
              BRACKET
            </p>
            <div className="mt-4 flex gap-6 overflow-x-auto pb-4">
              {rounds.map((r) => (
                <div key={r} className="min-w-[260px]">
                  <p className="mb-3 inline-block rounded-lg border-[3px] border-black bg-cream px-3 py-1 font-display text-xs font-black text-black">
                    {r === rounds.length ? "FINAL" : r === 1 ? "R1" : `R${r}`}
                  </p>
                  <div className="space-y-4">
                    {t.matches
                      .filter((m) => m.round === r)
                      .map((m) =>
                        m.isBye ? (
                          <div
                            key={m.id}
                            className="bye-stripes rounded-2xl border-[3px] border-black p-4 shadow-bruta"
                          >
                            <span className="inline-block rotate-[-3deg] font-comic text-2xl text-sun">
                              BYE!
                            </span>
                            <p className="mt-1 font-body text-xs font-bold text-cream">
                              {nameOf(m.winnerId)} lolos otomatis
                            </p>
                          </div>
                        ) : (
                          <div
                            key={m.id}
                            className={`rounded-2xl border-[3px] border-black p-3 shadow-bruta ${
                              m.status === "DONE" ? "bg-poplime" : "bg-cream"
                            } text-black`}
                          >
                            <div className="flex items-center justify-between font-body text-sm font-bold">
                              <span>{nameOf(m.teamAId)}</span>
                              <span className="font-display">
                                {m.scoreA ?? "–"}
                                {m.winnerId === m.teamAId && m.teamAId
                                  ? " ★"
                                  : ""}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between border-t-2 border-dashed border-black/20 pt-1 font-body text-sm font-bold">
                              <span>{nameOf(m.teamBId)}</span>
                              <span className="font-display">
                                {m.scoreB ?? "–"}
                                {m.winnerId === m.teamBId && m.teamBId
                                  ? " ★"
                                  : ""}
                              </span>
                            </div>
                            {m.status !== "DONE" &&
                            m.teamAId &&
                            m.teamBId ? (
                              <form
                                action={submitScoreAction}
                                className="mt-2 flex gap-2"
                              >
                                <input
                                  type="hidden"
                                  name="matchId"
                                  value={m.id}
                                />
                                <input
                                  type="hidden"
                                  name="tournamentId"
                                  value={t.id}
                                />
                                <input
                                  name="scoreA"
                                  placeholder="A"
                                  inputMode="numeric"
                                  required
                                  className="w-14 rounded-lg border-2 border-black bg-white px-2 py-1 font-display text-sm font-bold"
                                />
                                <input
                                  name="scoreB"
                                  placeholder="B"
                                  inputMode="numeric"
                                  required
                                  className="w-14 rounded-lg border-2 border-black bg-white px-2 py-1 font-display text-sm font-bold"
                                />
                                <button
                                  type="submit"
                                  className="flex-1 cursor-pointer rounded-lg border-2 border-black bg-sun px-2 py-1 font-display text-[11px] font-black"
                                >
                                  OK
                                </button>
                              </form>
                            ) : (
                              <p className="mt-2 inline-block rounded-md border-2 border-black bg-white px-2 font-display text-[11px] font-black">
                                {m.status === "DONE"
                                  ? `MENANG: ${nameOf(m.winnerId)}`
                                  : "MENUNGGU LAWAN..."}
                              </p>
                            )}
                          </div>
                        )
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Link
            href={`/tournaments/${t.id}`}
            className="font-display text-xs font-bold text-sun underline"
          >
            → Lihat halaman publik
          </Link>
          <Link
            href="/organizer"
            className="font-display text-xs font-bold text-mutedcream underline"
          >
            ← Dashboard panitia
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
