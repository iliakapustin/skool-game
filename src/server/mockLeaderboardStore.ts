import type {
  GameDifficulty,
  GameRunRecord,
  GameRunSubmission,
  LeaderboardEntry,
} from "@/game/leaderboardTypes";

const mockRuns: GameRunRecord[] = [];

type LeaderboardFilters = {
  category?: string;
  difficulty?: GameDifficulty;
  limit?: number;
};

export function saveMockRun(submission: GameRunSubmission, score: number): GameRunRecord {
  const record: GameRunRecord = {
    ...submission,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    score,
  };

  mockRuns.push(record);
  mockRuns.sort(sortRuns);

  if (mockRuns.length > 500) {
    mockRuns.length = 500;
  }

  return record;
}

export function getMockLeaderboard(filters: LeaderboardFilters = {}): LeaderboardEntry[] {
  const limit = clampLimit(filters.limit);
  const filteredRuns = mockRuns.filter((run) => {
    if (filters.category && run.category !== filters.category) return false;
    if (filters.difficulty && run.difficulty !== filters.difficulty) return false;
    return true;
  });

  return filteredRuns.slice(0, limit).map((run, index) => ({
    rank: index + 1,
    playerId: run.playerId,
    displayName: run.displayName,
    category: run.category,
    difficulty: run.difficulty,
    activity: run.activity,
    members: run.members,
    mrr: run.mrr,
    level: run.level,
    durationMs: run.durationMs,
    monetized: run.monetized,
    won: run.won,
    score: run.score,
    submittedAt: run.submittedAt,
  }));
}

function sortRuns(a: GameRunRecord, b: GameRunRecord): number {
  if (b.score !== a.score) return b.score - a.score;
  if (b.mrr !== a.mrr) return b.mrr - a.mrr;
  if (b.activity !== a.activity) return b.activity - a.activity;
  return a.durationMs - b.durationMs;
}

function clampLimit(limit: unknown): number {
  if (typeof limit !== "number" || !Number.isFinite(limit)) return 25;
  return Math.max(1, Math.min(100, Math.floor(limit)));
}
