import { GAME_COLORS } from "@/lib/constants";
import { rupiah } from "@/lib/format";

export const STATUS_COLOR: Record<string, string> = {
  OPEN: "#B5E048",
  ONGOING: "#22D3EE",
  FINISHED: "#8B5CF6",
  DRAFT: "#9CA3AF",
};

export function statusBadge(status: string) {
  return STATUS_COLOR[status] ?? "#FFD02B";
}

export function gameColor(game: string) {
  return GAME_COLORS[game] ?? "#8B5CF6";
}

export { rupiah };
