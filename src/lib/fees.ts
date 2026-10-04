import { FEES } from "./constants";

export function calcSaasFee(maxTeams: number, eventsHeldBefore: number) {
  const extra = maxTeams > 16 ? (maxTeams - 16) * FEES.SAAS_PER_TEAM_OVER_16 : 0;
  const gross = FEES.SAAS_BASE + extra;
  const discount =
    eventsHeldBefore >= FEES.LOYALTY_THRESHOLD
      ? Math.round(gross * FEES.LOYALTY_DISCOUNT)
      : 0;
  return { gross, discount, net: gross - discount };
}

export function calcSponsorDeal(amount: number) {
  const platformFee = Math.round(amount * FEES.SUCCESS_RATE);
  return { platformFee, netToOrganizer: amount - platformFee };
}

export function calcTicket(entryFee: number, isSolo: boolean) {
  const convenienceFee = isSolo ? FEES.CONVENIENCE_FLAT : 0;
  return { entryFee, convenienceFee, total: entryFee + convenienceFee };
}

export async function mockPay(
  amount: number
): Promise<{ ok: true; ref: string }> {
  await new Promise((r) => setTimeout(r, 1200));
  const ref = `MOCK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  void amount;
  return { ok: true, ref };
}
