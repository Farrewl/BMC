export type BracketMatchDraft = {
  id: string;
  round: number;
  position: number;
  teamAId: string | null;
  teamBId: string | null;
  nextMatchId: string | null;
  nextSlot: "A" | "B" | null;
  isBye: boolean;
  status: "PENDING" | "READY" | "DONE";
  winnerId: string | null;
};

export function seedOrder(size: number): number[] {
  if (size === 2) return [1, 2];
  const prev = seedOrder(size / 2);
  const out: number[] = [];
  for (const s of prev) {
    out.push(s);
    out.push(size + 1 - s);
  }
  return out;
}

function nextPowerOfTwo(n: number): number {
  let size = 2;
  while (size < n) size *= 2;
  return size;
}

let idCounter = 0;
function nid(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function generateBracket(teamIds: string[]): BracketMatchDraft[] {
  if (teamIds.length < 2) throw new Error("Minimal 2 tim untuk bracket");
  const n = teamIds.length;
  const size = nextPowerOfTwo(n);
  const totalRounds = Math.log2(size);
  const order = seedOrder(size);

  // petakan seed -> teamId (seed 1 = teamIds[0])
  const seedToTeam: Record<number, string | null> = {};
  for (let s = 1; s <= size; s++) {
    seedToTeam[s] = s <= n ? teamIds[s - 1] : null;
  }

  // urutan slot round 1 mengikuti seedOrder
  const r1Slots: Array<string | null> = order.map((s) => seedToTeam[s]);

  const matches: BracketMatchDraft[] = [];
  const byRound: Record<number, BracketMatchDraft[]> = {};

  // buat dari final (round total) ke round 1 agar id tersedia? Kita buat round 1..N lalu isi next.
  for (let r = 1; r <= totalRounds; r++) {
    const count = size / Math.pow(2, r);
    byRound[r] = [];
    for (let p = 0; p < count; p++) {
      byRound[r].push({
        id: nid(`m-r${r}p${p}`),
        round: r,
        position: p,
        teamAId: null,
        teamBId: null,
        nextMatchId: null,
        nextSlot: null,
        isBye: false,
        status: "PENDING",
        winnerId: null,
      });
    }
  }

  // isi nextMatchId
  for (let r = 1; r < totalRounds; r++) {
    for (const m of byRound[r]) {
      const nextPos = Math.floor(m.position / 2);
      const slot = m.position % 2 === 0 ? "A" : "B";
      const next = byRound[r + 1][nextPos];
      m.nextMatchId = next.id;
      m.nextSlot = slot as "A" | "B";
    }
  }

  // isi round 1 dari slot
  byRound[1].forEach((m, idx) => {
    const a = r1Slots[idx * 2] ?? null;
    const b = r1Slots[idx * 2 + 1] ?? null;
    m.teamAId = a;
    m.teamBId = b;
    if (!a || !b) {
      m.isBye = true;
      m.status = "DONE";
      m.winnerId = a ?? b;
      // langsung majukan ke next
      const next = byRound[2]?.[Math.floor(m.position / 2)];
      if (next && m.winnerId) {
        if (m.nextSlot === "A") next.teamAId = next.teamAId ?? m.winnerId;
        else next.teamBId = next.teamBId ?? m.winnerId;
      }
    } else {
      m.status = "READY";
    }
  });

  // tandai next yang sudah penuh jadi READY
  for (let r = 2; r <= totalRounds; r++) {
    for (const m of byRound[r]) {
      if (m.teamAId && m.teamBId) m.status = "READY";
    }
  }

  for (let r = 1; r <= totalRounds; r++) matches.push(...byRound[r]);
  return matches;
}

export type SimpleMatch = {
  id: string;
  teamAId: string | null;
  teamBId: string | null;
  scoreA: number | null;
  scoreB: number | null;
  winnerId: string | null;
  nextMatchId: string | null;
  nextSlot: "A" | "B" | null | string | undefined;
  status: string;
};

export function advanceWinner(
  matches: SimpleMatch[],
  matchId: string,
  scoreA: number,
  scoreB: number
): SimpleMatch[] {
  if (scoreA === scoreB) throw new Error("Skor seri tidak diperbolehkan");
  const map = new Map(matches.map((m) => [m.id, { ...m }]));
  const m = map.get(matchId);
  if (!m) throw new Error("Match tidak ditemukan");
  if (!m.teamAId || !m.teamBId) throw new Error("Match belum lengkap (BYE?)");

  m.scoreA = scoreA;
  m.scoreB = scoreB;
  m.winnerId = scoreA > scoreB ? m.teamAId : m.teamBId;
  m.status = "DONE";

  if (m.nextMatchId) {
    const next = map.get(m.nextMatchId);
    if (next && m.winnerId) {
      if (m.nextSlot === "A") next.teamAId = m.winnerId;
      else next.teamBId = m.winnerId;
      if (next.teamAId && next.teamBId) next.status = "READY";
    }
  }
  return [...map.values()];
}
