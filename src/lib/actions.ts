"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { calcSponsorDeal, calcTicket, mockPay } from "@/lib/fees";
import { buildProposal } from "@/lib/proposal";

const newTournamentSchema = z.object({
  title: z.string().min(4).max(80),
  game: z.string().min(2).max(40),
  description: z.string().min(10).max(500),
  startDate: z.string().min(8),
  maxTeams: z.coerce.number().int().min(2).max(32),
  entryFee: z.coerce.number().int().min(0).max(10_000_000),
  prizePool: z.coerce.number().int().min(0).max(1_000_000_000),
  streamUrl: z.string().optional(),
});

export async function createTournamentAction(formData: FormData) {
  const parsed = newTournamentSchema.safeParse({
    title: formData.get("title"),
    game: formData.get("game"),
    description: formData.get("description"),
    startDate: formData.get("startDate"),
    maxTeams: formData.get("maxTeams"),
    entryFee: formData.get("entryFee"),
    prizePool: formData.get("prizePool"),
    streamUrl: formData.get("streamUrl"),
  });
  if (!parsed.success) throw new Error("Form belum valid — cek lagi isian.");
  const d = parsed.data;

  const org = await db.user.findFirst({ where: { role: "ORGANIZER" } });
  if (!org) throw new Error("Organizer seed belum ada — jalankan db:seed.");

  const t = await db.tournament.create({
    data: {
      organizerId: org.id,
      title: d.title,
      game: d.game,
      description: d.description,
      startDate: new Date(d.startDate),
      maxTeams: d.maxTeams,
      entryFee: d.entryFee,
      prizePool: d.prizePool,
      streamUrl: d.streamUrl || null,
      status: "DRAFT",
      saasFeePaid: true,
    },
  });

  // 3 slot iklan default per turnamen baru
  await db.adSlot.createMany({
    data: (["PRE_ROLL", "SIDE_BANNER", "BREAK_BANNER"] as const).map(
      (placement, i) => ({
        tournamentId: t.id,
        placement,
        price: 150_000 + i * 50_000,
      })
    ),
  });

  revalidatePath("/organizer");
  revalidatePath("/tournaments");
  redirect(`/organizer/tournaments/${t.id}/manage`);
}

const proposalSchema = z.object({
  tournamentId: z.string().min(1),
  title: z.string().min(4).max(80),
  targetAmount: z.coerce.number().int().min(100_000).max(100_000_000),
  expectedReach: z.coerce.number().int().min(50).max(100_000),
  contact: z.string().min(4).max(80),
});

export async function createProposalAction(formData: FormData) {
  const parsed = proposalSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    title: formData.get("title"),
    targetAmount: formData.get("targetAmount"),
    expectedReach: formData.get("expectedReach"),
    contact: formData.get("contact"),
  });
  if (!parsed.success) throw new Error("Form proposal belum valid.");
  const d = parsed.data;

  const t = await db.tournament.findUnique({ where: { id: d.tournamentId } });
  if (!t) throw new Error("Turnamen tidak ditemukan.");

  const pitchText = buildProposal({
    eventName: t.title,
    game: t.game,
    date: t.startDate.toISOString().slice(0, 10),
    participants: t.maxTeams,
    viewers: d.expectedReach,
    target: d.targetAmount,
    benefits: ["Logo jersey", "Shoutout MC", "Banner stream"],
    contact: d.contact,
  });

  await db.sponsorProposal.create({
    data: {
      tournamentId: t.id,
      title: d.title,
      pitchText,
      targetAmount: d.targetAmount,
      expectedReach: d.expectedReach,
      benefits: JSON.stringify(["Logo jersey", "Shoutout MC", "Banner stream"]),
      status: "OPEN",
    },
  });

  revalidatePath("/sponsors");
  revalidatePath(`/tournaments/${t.id}`);
  redirect("/sponsors");
}

const fundSchema = z.object({
  proposalId: z.string().min(1),
  amount: z.coerce.number().int().min(50_000).max(100_000_000),
});

export async function fundProposalAction(formData: FormData) {
  const parsed = fundSchema.safeParse({
    proposalId: formData.get("proposalId"),
    amount: formData.get("amount"),
  });
  if (!parsed.success) throw new Error("Nominal minimal Rp 50.000.");
  const { proposalId, amount } = parsed.data;

  const sponsor = await db.user.findFirst({ where: { role: "SPONSOR" } });
  if (!sponsor) throw new Error("Sponsor seed belum ada.");
  const { platformFee, netToOrganizer } = calcSponsorDeal(amount);
  const pay = await mockPay(amount);

  await db.sponsorDeal.create({
    data: {
      proposalId,
      sponsorId: sponsor.id,
      amount,
      platformFee,
      netToOrganizer,
      status: "PAID",
    },
  });
  void pay;

  revalidatePath("/sponsors");
  revalidatePath("/sponsor");
}

const registerSchema = z.object({
  tournamentId: z.string().min(1),
  teamName: z.string().min(3).max(40),
  mode: z.enum(["team", "solo"]),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    tournamentId: formData.get("tournamentId"),
    teamName: formData.get("teamName"),
    mode: formData.get("mode"),
  });
  if (!parsed.success) throw new Error("Nama tim minimal 3 huruf.");
  const { tournamentId, teamName, mode } = parsed.data;

  const t = await db.tournament.findUnique({
    where: { id: tournamentId },
    include: { _count: { select: { registrations: true } } },
  });
  if (!t) throw new Error("Turnamen tidak ditemukan.");
  if (t._count.registrations >= t.maxTeams) throw new Error("Slot penuh.");
  const player = await db.user.findFirst({ where: { role: "PLAYER" } });
  if (!player) throw new Error("Player seed belum ada.");

  const isSolo = mode === "solo";
  const ticket = calcTicket(t.entryFee, isSolo);
  const pay = await mockPay(ticket.total);

  await db.registration.create({
    data: {
      tournamentId,
      userId: player.id,
      teamName,
      members: JSON.stringify(isSolo ? [player.name] : [player.name, "Mate 2", "Mate 3"]),
      isSoloPlayer: isSolo,
      seed: t._count.registrations + 1,
      paymentStatus: "PAID",
      amountPaid: ticket.total,
      convenienceFee: ticket.convenienceFee,
    },
  });
  void pay;

  revalidatePath(`/tournaments/${tournamentId}`);
  revalidatePath("/player");
  redirect(`/tournaments/${tournamentId}`);
}

const lfgActionSchema = z.object({
  postId: z.string().min(1),
  message: z.string().min(4).max(200),
});

export async function lfgInviteAction(formData: FormData) {
  const parsed = lfgActionSchema.safeParse({
    postId: formData.get("postId"),
    message: formData.get("message"),
  });
  if (!parsed.success) throw new Error("Pesan minimal 4 huruf.");
  const player = await db.user.findFirst({ where: { role: "PLAYER" } });
  if (!player) throw new Error("Player seed belum ada.");

  await db.lfgInvite.create({
    data: { postId: parsed.data.postId, fromUserId: player.id, message: parsed.data.message, accepted: true },
  });
  await db.lfgPost.update({
    where: { id: parsed.data.postId },
    data: { status: "TEAM_FORMED" },
  });

  revalidatePath("/lfg");
}

const bookAdSchema = z.object({
  slotId: z.string().min(1),
  brandName: z.string().min(3).max(40),
  bannerText: z.string().min(4).max(80),
});

export async function bookAdAction(formData: FormData) {
  const parsed = bookAdSchema.safeParse({
    slotId: formData.get("slotId"),
    brandName: formData.get("brandName"),
    bannerText: formData.get("bannerText"),
  });
  if (!parsed.success) throw new Error("Brand + teks banner wajib diisi.");
  const sponsor = await db.user.findFirst({ where: { role: "SPONSOR" } });
  if (!sponsor) throw new Error("Sponsor seed belum ada.");

  await db.adBooking.create({
    data: {
      slotId: parsed.data.slotId,
      sponsorId: sponsor.id,
      brandName: parsed.data.brandName,
      bannerText: parsed.data.bannerText,
      bannerColor: "#FFD02B",
    },
  });

  revalidatePath("/sponsor");
  revalidatePath("/tournaments");
}

const helpSchema = z.object({
  subject: z.string().min(4).max(80),
  message: z.string().min(10).max(500),
});

export async function helpTicketAction(formData: FormData) {
  const parsed = helpSchema.safeParse({
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) throw new Error("Subjek + pesan belum lengkap.");
  const user = await db.user.findFirst();
  if (!user) throw new Error("User seed belum ada.");

  await db.helpTicket.create({
    data: { userId: user.id, subject: parsed.data.subject, message: parsed.data.message, status: "OPEN" },
  });

  revalidatePath("/help");
}
