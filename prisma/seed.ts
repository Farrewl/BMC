import { PrismaClient } from "@prisma/client";
import { calcSponsorDeal } from "../src/lib/fees";

const db = new PrismaClient();

async function main() {
  // bersihkan urut dari anak ke induk
  await db.lfgInvite.deleteMany();
  await db.lfgPost.deleteMany();
  await db.adBooking.deleteMany();
  await db.adSlot.deleteMany();
  await db.sponsorDeal.deleteMany();
  await db.sponsorProposal.deleteMany();
  await db.match.deleteMany();
  await db.registration.deleteMany();
  await db.helpTicket.deleteMany();
  await db.tournament.deleteMany();
  await db.user.deleteMany();

  const organizers = await Promise.all(
    [
      { name: "BEM FSM Undip", email: "bem@undip.ac.id", orgName: "BEM FSM Undip", city: "Semarang" },
      { name: "Himpunan Informatika", email: "himatif@undip.ac.id", orgName: "Himpunan Informatika", city: "Semarang" },
      { name: "Semarang Esports Community", email: "sec@komunitas.id", orgName: "SEC", city: "Semarang" },
    ].map((u) => db.user.create({ data: { ...u, role: "ORGANIZER" } }))
  );

  const sponsors = await Promise.all(
    [
      { name: "Kopi Kos Ndalem", email: "kopi@ndalem.id", orgName: "Kopi Kos Ndalem", city: "Tembalang" },
      { name: "Barber Tembalang", email: "barber@tbg.id", orgName: "Barber Tembalang", city: "Tembalang" },
      { name: "Toko Komputer Jaya", email: "jaya@komputer.id", orgName: "Jaya Komputer", city: "Semarang" },
      { name: "Laundry Kos Bersih", email: "laundry@bersih.id", orgName: "Laundry Bersih", city: "Tembalang" },
      { name: "Warung Makan Bu Sri", email: "busri@warung.id", orgName: "Warung Bu Sri", city: "Tembalang" },
    ].map((u) => db.user.create({ data: { ...u, role: "SPONSOR" } }))
  );

  const playerNames = [
    "Bagas", "Rizky", "Dimas", "Fajar", "Ilham", "Yoga",
    "Putri", "Sinta", "Nadia", "Agus", "Bima", "Raka",
  ];
  const players = await Promise.all(
    playerNames.map((n, i) =>
      db.user.create({
        data: { name: `${n} Pratama`, email: `player${i + 1}@lombaesport.id`, role: "PLAYER", city: "Semarang" },
      })
    )
  );

  const t1 = await db.tournament.create({
    data: {
      organizerId: organizers[0].id,
      title: "MLBB Campus Cup Undip",
      game: "Mobile Legends",
      description: "Turnamen antar fakultas, single elimination 16 slot.",
      startDate: new Date("2026-10-18"),
      maxTeams: 16,
      teamSize: 5,
      entryFee: 50000,
      prizePool: 5_000_000,
      status: "OPEN",
      streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  });

  const t2 = await db.tournament.create({
    data: {
      organizerId: organizers[1].id,
      title: "Valorant Semarang Clash",
      game: "Valorant",
      description: "Clash komunitas, 8 tim, bracket sudah jalan.",
      startDate: new Date("2026-10-11"),
      maxTeams: 8,
      teamSize: 5,
      entryFee: 75000,
      prizePool: 7_500_000,
      status: "ONGOING",
      streamUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  });

  const t3 = await db.tournament.create({
    data: {
      organizerId: organizers[2].id,
      title: "PUBGM Warung Cup",
      game: "PUBG Mobile",
      description: "Fun match 11 tim — bagus untuk demo BYE.",
      startDate: new Date("2026-10-25"),
      maxTeams: 16,
      teamSize: 4,
      entryFee: 25000,
      prizePool: 3_000_000,
      status: "OPEN",
    },
  });

  const t4 = await db.tournament.create({
    data: {
      organizerId: organizers[0].id,
      title: "EA FC Kos League",
      game: "EA FC",
      description: "Liga kos 1v1, sudah selesai.",
      startDate: new Date("2026-09-28"),
      maxTeams: 16,
      teamSize: 1,
      entryFee: 20000,
      prizePool: 2_000_000,
      status: "FINISHED",
    },
  });

  // registrasi: t1 6 tim (ganjil demo BYE), t3 11 tim
  const teamNames1 = ["RRQ Kos", "Evosi Kos", "Onic Kost", "Alter Ego Kos", "Bigetron Kos", "Aura Kos"];
  for (let i = 0; i < teamNames1.length; i++) {
    await db.registration.create({
      data: {
        tournamentId: t1.id,
        userId: players[i].id,
        teamName: teamNames1[i],
        members: JSON.stringify([players[i].name, "Mate 2", "Mate 3", "Mate 4", "Mate 5"]),
        seed: i + 1,
        paymentStatus: "PAID",
        amountPaid: 50000,
      },
    });
  }

  for (let i = 0; i < 11; i++) {
    await db.registration.create({
      data: {
        tournamentId: t3.id,
        userId: players[i % players.length].id,
        teamName: `Tim Warung ${i + 1}`,
        members: JSON.stringify(["Kapten", "A", "B", "C"]),
        seed: i + 1,
        paymentStatus: i < 8 ? "PAID" : "UNPAID",
        amountPaid: i < 8 ? 25000 : 0,
      },
    });
  }

  // 6 proposal sponsor
  const proposalData = [
    { t: t1, title: "Kopi Kos Ndalem x MLBB Cup", target: 5_000_000, reach: 2500 },
    { t: t1, title: "Jaya Komputer — Hadiah Peripheral", target: 3_000_000, reach: 2000 },
    { t: t2, title: "Barber Tembalang x Valorant", target: 2_000_000, reach: 1200 },
    { t: t3, title: "Warung Bu Sri — Konsumsi Panitia", target: 500_000, reach: 800 },
    { t: t3, title: "Laundry Bersih — Jersey Bundle", target: 1_500_000, reach: 1000 },
    { t: t4, title: "Kopi Ndalem — After Party FC", target: 1_000_000, reach: 600 },
  ];
  for (const p of proposalData) {
    const prop = await db.sponsorProposal.create({
      data: {
        tournamentId: p.t.id,
        title: p.title,
        pitchText: `${p.title}: dukung ${p.t.title}, estimasi ${p.reach} penonton.`,
        targetAmount: p.target,
        expectedReach: p.reach,
        benefits: JSON.stringify(["Logo jersey", "Shoutout MC", "Banner stream"]),
        status: "OPEN",
      },
    });
    // 1 deal sebagian terdanai untuk proposal pertama
    if (p.title.startsWith("Kopi Kos Ndalem x")) {
      const { platformFee, netToOrganizer } = calcSponsorDeal(3_200_000);
      await db.sponsorDeal.create({
        data: {
          proposalId: prop.id,
          sponsorId: sponsors[0].id,
          amount: 3_200_000,
          platformFee,
          netToOrganizer,
          status: "PAID",
        },
      });
    }
  }

  // 10 LFG
  const lfgSeed: Array<[string, string, string, string, string]> = [
    ["Mobile Legends", "Jungler", "Mythic", "Kompetitif", "Malam hari"],
    ["Mobile Legends", "Roamer", "Legend", "Santai", "Sabtu-Minggu"],
    ["Valorant", "Duelist", "Immortal", "Kompetitif", "Malam hari"],
    ["Valorant", "Controller", "Diamond", "Kompetitif", "Weekday malam"],
    ["Free Fire", "Rusher", "Heroic", "Santai", "Sore hari"],
    ["PUBG Mobile", "Sniper", "Crown", "Kompetitif", "Malam hari"],
    ["EA FC", "Striker", "Div 3", "Santai", "Fleksibel"],
    ["Mobile Legends", "Midlaner", "Mythic", "Kompetitif", "Sabtu malam"],
    ["Valorant", "Sentinel", "Platinum", "Santai", "Minggu siang"],
    ["PUBG Mobile", "Support", "Diamond", "Kompetitif", "Malam hari"],
  ];
  for (let i = 0; i < lfgSeed.length; i++) {
    const [game, role, rank, playStyle, availability] = lfgSeed[i];
    await db.lfgPost.create({
      data: {
        userId: players[i % players.length].id,
        game,
        role,
        rank,
        playStyle,
        availability,
        bio: `Player ${rank} cari tim ${game}, main ${availability.toLowerCase()}.`,
        status: "OPEN",
      },
    });
  }

  // AdSlots 3 per turnamen + booking contoh
  for (const t of [t1, t2, t3, t4]) {
    const slots = await Promise.all(
      (["PRE_ROLL", "SIDE_BANNER", "BREAK_BANNER"] as const).map((placement, i) =>
        db.adSlot.create({ data: { tournamentId: t.id, placement, price: 150_000 + i * 50_000 } })
      )
    );
    if (t.id === t1.id) {
      await db.adBooking.create({
        data: {
          slotId: slots[1].id,
          sponsorId: sponsors[0].id,
          brandName: "Kopi Kos Ndalem",
          bannerText: "Ngopi dulu sebelum push rank! Diskon 15% bawa KTM.",
          bannerColor: "#FFD02B",
        },
      });
    }
  }

  await db.helpTicket.create({
    data: {
      userId: players[0].id,
      subject: "Cara daftar solo?",
      message: "Saya solo player, apakah bisa langsung daftar tanpa tim?",
      status: "OPEN",
    },
  });

  console.log("Seed OK: 3 organizer, 5 sponsor, 12 player, 4 turnamen, 6 proposal, 10 LFG");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
