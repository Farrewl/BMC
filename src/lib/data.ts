import { GAME_COLORS } from "@/lib/constants";
import { rupiah } from "@/lib/format";

export const STATUS_COLOR: Record<string, string> = {
  OPEN: "#B9A6FF",
  ONGOING: "#8AD9EC",
  FINISHED: "#8B6CF6",
  DRAFT: "#9CA3AF",
};

export function statusBadge(status: string) {
  return STATUS_COLOR[status] ?? "#FFB7C5";
}

export function gameColor(game: string) {
  return GAME_COLORS[game] ?? "#8B6CF6";
}

export { rupiah };
