"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { generateBracket, advanceWinner } from "@/lib/bracket";

export async function generateBracketAction(tournamentId: string) {
  const regs = await db.registration.findMany({
    where: { tournamentId },
    orderBy: { seed: "asc" },
  });
  if (regs.length < 2) throw new Error("Minimal 2 tim terdaftar");
  const teamIds = regs.map((r) => r.id);

  const drafts = generateBracket(teamIds);

  await db.match.deleteMany({ where: { tournamentId } });

  // draft.id (m-r1p0-1) -> db id mapping
  const idMap = new Map<string, string>();
  const created: { draftId: string; dbId: string }[] = [];
  for (const d of drafts) {
    const row = await db.match.create({
      data: {
        tournamentId,
        round: d.round,
        position: d.position,
        teamAId: d.teamAId,
        teamBId: d.teamBId,
        winnerId: d.winnerId,
        status: d.status as "PENDING" | "READY" | "DONE",
        isBye: d.isBye,
      },
    });
    idMap.set(d.id, row.id);
    created.push({ draftId: d.id, dbId: row.id });
  }
  // link nextMatchId
  for (const d of drafts) {
    if (d.nextMatchId) {
      const dbId = idMap.get(d.id)!;
      const nextDbId = idMap.get(d.nextMatchId)!;
      await db.match.update({
        where: { id: dbId },
        data: { nextMatchId: nextDbId, nextSlot: d.nextSlot },
      });
    }
  }

  await db.tournament.update({
    where: { id: tournamentId },
    data: { status: "ONGOING" },
  });

  revalidatePath(`/organizer/tournaments/${tournamentId}/manage`);
  revalidatePath(`/tournaments/${tournamentId}`);
}

export async function submitScoreAction(formData: FormData) {
  const matchId = String(formData.get("matchId") ?? "");
  const tournamentId = String(formData.get("tournamentId") ?? "");
  const scoreA = parseInt(String(formData.get("scoreA") ?? ""), 10);
  const scoreB = parseInt(String(formData.get("scoreB") ?? ""), 10);
  if (!matchId || !tournamentId) throw new Error("Match tidak valid");
  if (Number.isNaN(scoreA) || Number.isNaN(scoreB))
    throw new Error("Skor harus angka");
  if (scoreA === scoreB) throw new Error("Skor seri tidak diperbolehkan");

  const all = await db.match.findMany({ where: { tournamentId } });
  const simple = all.map((m) => ({
    id: m.id,
    teamAId: m.teamAId,
    teamBId: m.teamBId,
    scoreA: m.scoreA,
    scoreB: m.scoreB,
    winnerId: m.winnerId,
    nextMatchId: m.nextMatchId,
    nextSlot: m.nextSlot,
    status: m.status,
  }));
  const next = advanceWinner(simple, matchId, scoreA, scoreB);

  for (const n of next) {
    const orig = all.find((a) => a.id === n.id)!;
    if (
      orig.scoreA !== n.scoreA ||
      orig.scoreB !== n.scoreB ||
      orig.winnerId !== n.winnerId ||
      orig.teamAId !== n.teamAId ||
      orig.teamBId !== n.teamBId ||
      orig.status !== (n.status as "PENDING" | "READY" | "DONE")
    ) {
      await db.match.update({
        where: { id: n.id },
        data: {
          scoreA: n.scoreA,
          scoreB: n.scoreB,
          winnerId: n.winnerId,
          teamAId: n.teamAId,
          teamBId: n.teamBId,
          status: n.status as "PENDING" | "READY" | "DONE",
        },
      });
    }
  }

  // kalau final DONE -> FINISHED
  const rounds = [...new Set(all.map((m) => m.round))].sort((a, b) => a - b);
  const maxRound = rounds[rounds.length - 1];
  const finals = next.filter((m) => {
    const orig = all.find((a) => a.id === m.id)!;
    return orig.round === maxRound;
  });
  if (finals.length > 0 && finals.every((f) => f.status === "DONE")) {
    await db.tournament.update({
      where: { id: tournamentId },
      data: { status: "FINISHED" },
    });
  }

  revalidatePath(`/organizer/tournaments/${tournamentId}/manage`);
  revalidatePath(`/tournaments/${tournamentId}`);
}

export async function resetBracketAction(tournamentId: string) {
  await db.match.deleteMany({ where: { tournamentId } });
  await db.tournament.update({
    where: { id: tournamentId },
    data: { status: "OPEN" },
  });
  revalidatePath(`/organizer/tournaments/${tournamentId}/manage`);
  redirect(`/organizer/tournaments/${tournamentId}/manage`);
}
