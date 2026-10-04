// Data dummy untuk Vercel: dipakai kalau SQLite tidak ada (build/prerender).
// Di lokal, DB asli tetap dipakai. Bentuk field disamakan dengan seed.

// Bungkus query DB: kalau tabel tidak ada (P2021 di Vercel), pakai fallback.
export async function withDemo<T>(fn: () => Promise<T>, fallback: any): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback as T;
  }
}

export const demoTournaments = [
  {
    id: "demo-mlbb",
    title: "MLBB Campus Cup Undip",
    game: "Mobile Legends",
    description: "Turnamen antar fakultas, single elimination 16 slot.",
    startDate: new Date("2026-10-18"),
    maxTeams: 16,
    teamSize: 5,
    entryFee: 50000,
    prizePool: 5_000_000,
    status: "OPEN",
    streamUrl: null as string | null,
    _count: { registrations: 6, matches: 0 },
  },
  {
    id: "demo-valorant",
    title: "Valorant Semarang Clash",
    game: "Valorant",
    description: "Clash komunitas, 8 tim, bracket sudah jalan.",
    startDate: new Date("2026-10-11"),
    maxTeams: 8,
    teamSize: 5,
    entryFee: 75000,
    prizePool: 7_500_000,
    status: "ONGOING",
    streamUrl: null as string | null,
    _count: { registrations: 8, matches: 7 },
  },
  {
    id: "demo-pubgm",
    title: "PUBGM Warung Cup",
    game: "PUBG Mobile",
    description: "Fun match 11 tim — bagus untuk demo BYE.",
    startDate: new Date("2026-10-25"),
    maxTeams: 16,
    teamSize: 4,
    entryFee: 25000,
    prizePool: 3_000_000,
    status: "OPEN",
    streamUrl: null as string | null,
    _count: { registrations: 11, matches: 0 },
  },
  {
    id: "demo-fc",
    title: "EA FC Kos League",
    game: "EA FC",
    description: "Liga kos 1v1, sudah selesai.",
    startDate: new Date("2026-09-28"),
    maxTeams: 16,
    teamSize: 1,
    entryFee: 20000,
    prizePool: 2_000_000,
    status: "FINISHED",
    streamUrl: null as string | null,
    _count: { registrations: 16, matches: 15 },
  },
];

export const demoRegistrations = [
  { id: "r1", teamName: "RRQ Kos", paymentStatus: "PAID", seed: 1 },
  { id: "r2", teamName: "Evosi Kos", paymentStatus: "PAID", seed: 2 },
  { id: "r3", teamName: "Onic Kost", paymentStatus: "PAID", seed: 3 },
  { id: "r4", teamName: "Alter Ego Kos", paymentStatus: "PAID", seed: 4 },
  { id: "r5", teamName: "Bigetron Kos", paymentStatus: "PAID", seed: 5 },
  { id: "r6", teamName: "Aura Kos", paymentStatus: "PAID", seed: 6 },
];

export function demoTournamentDetail(id: string) {
  const base =
    demoTournaments.find((t) => t.id === id) ?? demoTournaments[0];
  return {
    ...base,
    registrations: demoRegistrations,
    matches: [],
    proposals: [
      {
        id: "demo-prop-1",
        title: "Kopi Kos Ndalem x MLBB Cup",
        targetAmount: 5_000_000,
        expectedReach: 2500,
        deals: [{ id: "d1", amount: 3_200_000, status: "PAID" }],
      },
    ],
    adSlots: [
      {
        id: "s1",
        placement: "SIDE_BANNER",
        price: 200_000,
        bookings: [
          {
            id: "b1",
            brandName: "Kopi Kos Ndalem",
            bannerText: "Ngopi dulu sebelum push rank! Diskon 15% bawa KTM.",
            bannerColor: "#FFD02B",
          },
        ],
      },
      { id: "s2", placement: "PRE_ROLL", price: 150_000, bookings: [] },
    ],
  };
}

export const demoProposals = [
  {
    id: "demo-prop-1",
    title: "Kopi Kos Ndalem x MLBB Cup",
    targetAmount: 5_000_000,
    expectedReach: 2500,
    status: "OPEN",
    benefits: JSON.stringify(["Logo jersey", "Shoutout MC", "Banner stream"]),
    tournament: { title: "MLBB Campus Cup Undip", game: "Mobile Legends" },
    deals: [{ id: "d1", amount: 3_200_000, status: "PAID" }],
  },
  {
    id: "demo-prop-2",
    title: "Jaya Komputer — Hadiah Peripheral",
    targetAmount: 3_000_000,
    expectedReach: 2000,
    status: "OPEN",
    benefits: JSON.stringify(["Logo jersey", "Shoutout MC", "Banner stream"]),
    tournament: { title: "MLBB Campus Cup Undip", game: "Mobile Legends" },
    deals: [],
  },
  {
    id: "demo-prop-3",
    title: "Barber Tembalang x Valorant",
    targetAmount: 2_000_000,
    expectedReach: 1200,
    status: "OPEN",
    benefits: JSON.stringify(["Logo jersey", "Shoutout MC", "Banner stream"]),
    tournament: { title: "Valorant Semarang Clash", game: "Valorant" },
    deals: [],
  },
];

export function demoProposalDetail(id: string) {
  const base = demoProposals.find((p) => p.id === id) ?? demoProposals[0];
  return {
    ...base,
    pitchText: `${base.title}: dukung ${base.tournament.title}, estimasi ${base.expectedReach} penonton. Logo jersey, shoutout MC, banner stream selama acara.`,
    tournament: {
      title: base.tournament.title,
      game: base.tournament.game,
      maxTeams: 16,
    },
    deals: [
      { id: "d1", amount: 1_000_000, status: "PAID", sponsor: { name: "Kopi Kos Ndalem" } },
    ],
  };
}

export const demoLfgPosts = [
  {
    id: "lfg1",
    game: "Mobile Legends",
    role: "Jungler",
    rank: "Mythic",
    playStyle: "Kompetitif",
    availability: "Malam hari",
    bio: "Player Mythic cari tim MLBB, main malam hari.",
    status: "OPEN",
    user: { name: "Bagas Pratama" },
    _count: { invites: 2 },
  },
  {
    id: "lfg2",
    game: "Valorant",
    role: "Duelist",
    rank: "Immortal",
    playStyle: "Kompetitif",
    availability: "Malam hari",
    bio: "Duelist Immortal cari tim Valorant buat push rank.",
    status: "OPEN",
    user: { name: "Rizky Pratama" },
    _count: { invites: 1 },
  },
  {
    id: "lfg3",
    game: "PUBG Mobile",
    role: "Sniper",
    rank: "Crown",
    playStyle: "Santai",
    availability: "Sore hari",
    bio: "Sniper Crown cari squad santai sore hari.",
    status: "OPEN",
    user: { name: "Dimas Pratama" },
    _count: { invites: 0 },
  },
];

export const demoTickets = [
  {
    id: "t1",
    subject: "Cara daftar solo?",
    message: "Saya solo player, apakah bisa langsung daftar tanpa tim?",
    status: "OPEN",
    user: { name: "Bagas Pratama" },
  },
];

export const demoDeals = [
  {
    id: "d1",
    amount: 3_200_000,
    platformFee: 320_000,
    netToOrganizer: 2_880_000,
    status: "PAID",
    sponsor: { name: "Kopi Kos Ndalem" },
    proposal: { title: "Kopi Kos Ndalem x MLBB Cup" },
  },
  {
    id: "d2",
    amount: 1_000_000,
    platformFee: 100_000,
    netToOrganizer: 900_000,
    status: "PAID",
    sponsor: { name: "Barber Tembalang" },
    proposal: { title: "Barber Tembalang x Valorant" },
  },
];

export const demoAdSlots = [
  {
    id: "s1",
    placement: "PRE_ROLL",
    price: 150_000,
    tournament: { title: "MLBB Campus Cup Undip" },
    bookings: [],
  },
  {
    id: "s2",
    placement: "SIDE_BANNER",
    price: 200_000,
    tournament: { title: "MLBB Campus Cup Undip" },
    bookings: [
      {
        id: "b1",
        brandName: "Kopi Kos Ndalem",
        bannerText: "Ngopi dulu sebelum push rank!",
        bannerColor: "#FFD02B",
      },
    ],
  },
  {
    id: "s3",
    placement: "BREAK_BANNER",
    price: 250_000,
    tournament: { title: "Valorant Semarang Clash" },
    bookings: [],
  },
];
