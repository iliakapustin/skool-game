export const GAME_VERSION = "0.12.0-canvas-audio";

export const GAME_CATEGORIES = [
  "hobbies",
  "music",
  "money",
  "spirituality",
  "tech",
  "health",
  "careers",
  "sports",
  "love",
  "selfImprovement",
] as const;

export const GAME_DIFFICULTIES = ["easy", "normal", "hard"] as const;

export type GameCategory = (typeof GAME_CATEGORIES)[number];
export type GameDifficulty = (typeof GAME_DIFFICULTIES)[number];

export type PlayerProfile = {
  id: string;
  displayName: string;
  createdAt: string;
};

export type GameRunSubmission = {
  playerId: string;
  displayName: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  activity: number;
  members: number;
  mrr: number;
  level: number;
  durationMs: number;
  monetized: boolean;
  won: boolean;
  gameVersion: string;
};

export type GameRunRecord = GameRunSubmission & {
  id: string;
  submittedAt: string;
  score: number;
};

export type LeaderboardEntry = {
  rank: number;
  playerId: string;
  displayName: string;
  category: GameCategory;
  difficulty: GameDifficulty;
  activity: number;
  members: number;
  mrr: number;
  level: number;
  durationMs: number;
  monetized: boolean;
  won: boolean;
  score: number;
  submittedAt: string;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  source: "mock" | "supabase";
};
