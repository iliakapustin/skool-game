import type {
  GameDifficulty,
  GameRunRecord,
  GameRunSubmission,
  LeaderboardEntry,
} from "@/game/leaderboardTypes";

type LeaderboardFilters = {
  category?: string;
  difficulty?: GameDifficulty;
  limit?: number;
};

type SupabaseProfileRow = {
  id: string;
  browser_player_id: string;
  display_name: string;
};

type SupabaseRunRow = {
  id: string;
  profile_id: string;
  display_name: string;
  category: GameRunSubmission["category"];
  difficulty: GameRunSubmission["difficulty"];
  activity: number;
  members: number;
  mrr: number;
  level: number;
  duration_ms: number;
  monetized: boolean;
  won: boolean;
  score: number;
  game_version: string;
  submitted_at: string;
  profiles?: {
    browser_player_id?: string;
  };
};

type SupabaseLeaderboardRow = {
  rank: number;
  player_id: string;
  display_name: string;
  category: GameRunSubmission["category"];
  difficulty: GameRunSubmission["difficulty"];
  activity: number;
  members: number;
  mrr: number;
  level: number;
  duration_ms: number;
  monetized: boolean;
  won: boolean;
  score: number;
  submitted_at: string;
};

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export async function saveSupabaseRun(submission: GameRunSubmission, score: number): Promise<GameRunRecord> {
  const profile = await upsertProfile(submission.playerId, submission.displayName);
  const [run] = await supabaseRequest<SupabaseRunRow[]>("/runs?select=*", {
    method: "POST",
    headers: {
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      profile_id: profile.id,
      display_name: submission.displayName,
      category: submission.category,
      difficulty: submission.difficulty,
      activity: submission.activity,
      members: submission.members,
      mrr: submission.mrr,
      level: submission.level,
      duration_ms: submission.durationMs,
      monetized: submission.monetized,
      won: submission.won,
      score,
      game_version: submission.gameVersion,
    }),
  });

  return mapRunRow(run, submission.playerId);
}

export async function getSupabaseLeaderboard(filters: LeaderboardFilters = {}): Promise<LeaderboardEntry[]> {
  const params = new URLSearchParams({
    select: "*",
    order: "score.desc,submitted_at.asc",
    limit: String(clampLimit(filters.limit)),
  });

  if (filters.category) params.set("category", `eq.${filters.category}`);
  if (filters.difficulty) params.set("difficulty", `eq.${filters.difficulty}`);

  const rows = await supabaseRequest<SupabaseLeaderboardRow[]>(`/leaderboard?${params.toString()}`);

  return rows.map((row) => ({
    rank: row.rank,
    playerId: row.player_id,
    displayName: row.display_name,
    category: row.category,
    difficulty: row.difficulty,
    activity: row.activity,
    members: row.members,
    mrr: row.mrr,
    level: row.level,
    durationMs: row.duration_ms,
    monetized: row.monetized,
    won: row.won,
    score: row.score,
    submittedAt: row.submitted_at,
  }));
}

async function upsertProfile(browserPlayerId: string, displayName: string): Promise<SupabaseProfileRow> {
  const [profile] = await supabaseRequest<SupabaseProfileRow[]>("/profiles?on_conflict=browser_player_id", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      browser_player_id: browserPlayerId,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    }),
  });

  return profile;
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase is not configured.");
  }

  const headers = new Headers(init.headers);
  headers.set("apikey", SUPABASE_SERVICE_ROLE_KEY);
  headers.set("Authorization", `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${details}`);
  }

  return (await response.json()) as T;
}

function mapRunRow(row: SupabaseRunRow, fallbackPlayerId: string): GameRunRecord {
  return {
    id: row.id,
    playerId: row.profiles?.browser_player_id ?? fallbackPlayerId,
    displayName: row.display_name,
    category: row.category,
    difficulty: row.difficulty,
    activity: row.activity,
    members: row.members,
    mrr: row.mrr,
    level: row.level,
    durationMs: row.duration_ms,
    monetized: row.monetized,
    won: row.won,
    gameVersion: row.game_version,
    score: row.score,
    submittedAt: row.submitted_at,
  };
}

function clampLimit(limit: unknown): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) return 25;
  return Math.max(1, Math.min(100, Math.floor(limit)));
}
