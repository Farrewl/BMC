export const FEES = {
  SAAS_BASE: 150_000,
  SAAS_PER_TEAM_OVER_16: 5_000,
  SUCCESS_RATE: 0.1,
  CONVENIENCE_FLAT: 2_500,
  LOYALTY_THRESHOLD: 3,
  LOYALTY_DISCOUNT: 0.1,
} as const;

export const GAMES = [
  "Mobile Legends",
  "Valorant",
  "Free Fire",
  "PUBG Mobile",
  "EA FC",
] as const;

export const GAME_COLORS: Record<string, string> = {
  "Mobile Legends": "#8B6CF6",
  Valorant: "#FF6B81",
  "Free Fire": "#FF9E8A",
  "PUBG Mobile": "#8AD9EC",
  "EA FC": "#B9A6FF",
};
