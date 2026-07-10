import {
  GAME_CATEGORIES,
  GAME_DIFFICULTIES,
  GAME_VERSION,
  type GameRunSubmission,
} from "@/game/leaderboardTypes";

export type ScoreValidationResult =
  | { ok: true; normalized: GameRunSubmission; score: number }
  | { ok: false; errors: string[] };

const MAX_DISPLAY_NAME_LENGTH = 24;
const MIN_RUN_DURATION_MS = 5_000;
const MAX_RUN_DURATION_MS = 60 * 60 * 1000;
const MAX_ACTIVITY = 250_000;
const MAX_MEMBERS = 50_000;
const MAX_MRR = 5_000_000;
const MAX_LEVEL = 300;

export function validateGameRunSubmission(input: unknown): ScoreValidationResult {
  const errors: string[] = [];

  if (!isPlainObject(input)) {
    return { ok: false, errors: ["Submission must be an object."] };
  }

  const raw = input as Record<string, unknown>;
  const displayName = normalizeDisplayName(raw.displayName);
  const playerId = typeof raw.playerId === "string" ? raw.playerId.trim() : "";
  const category = raw.category;
  const difficulty = raw.difficulty;
  const activity = toInteger(raw.activity);
  const members = toInteger(raw.members);
  const mrr = toInteger(raw.mrr);
  const level = toInteger(raw.level);
  const durationMs = toInteger(raw.durationMs);
  const monetized = raw.monetized === true;
  const won = raw.won === true;
  const gameVersion = typeof raw.gameVersion === "string" ? raw.gameVersion.trim() : GAME_VERSION;

  if (!playerId || playerId.length > 80) errors.push("Invalid player id.");
  if (!displayName) errors.push("Display name is required.");
  if (!GAME_CATEGORIES.includes(category as never)) errors.push("Invalid category.");
  if (!GAME_DIFFICULTIES.includes(difficulty as never)) errors.push("Invalid difficulty.");
  if (!isInRange(activity, 0, MAX_ACTIVITY)) errors.push("Activity is out of range.");
  if (!isInRange(members, 1, MAX_MEMBERS)) errors.push("Members is out of range.");
  if (!isInRange(mrr, 0, MAX_MRR)) errors.push("MRR is out of range.");
  if (!isInRange(level, 1, MAX_LEVEL)) errors.push("Level is out of range.");
  if (!isInRange(durationMs, MIN_RUN_DURATION_MS, MAX_RUN_DURATION_MS)) {
    errors.push("Run duration is out of range.");
  }
  if (!monetized && mrr > 0) errors.push("Non-monetized runs cannot report MRR.");
  if (won && !monetized) errors.push("Winning requires monetization.");
  if (members > 1 && activity < (members - 1) * 3) {
    errors.push("Member count is not plausible for the reported activity.");
  }
  if (mrr > members * 1_000 + 25_000) {
    errors.push("MRR is not plausible for the reported member count.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const normalized: GameRunSubmission = {
    playerId,
    displayName,
    category: category as GameRunSubmission["category"],
    difficulty: difficulty as GameRunSubmission["difficulty"],
    activity,
    members,
    mrr,
    level,
    durationMs,
    monetized,
    won,
    gameVersion,
  };

  return { ok: true, normalized, score: calculateScore(normalized) };
}

export function calculateScore(run: GameRunSubmission): number {
  const winBonus = run.won ? 50_000 : 0;
  const monetizedBonus = run.monetized ? 5_000 : 0;
  const durationPenalty = Math.floor(run.durationMs / 1_000);

  return Math.max(
    0,
    run.activity + run.members * 25 + run.mrr * 2 + run.level * 250 + winBonus + monetizedBonus - durationPenalty,
  );
}

function normalizeDisplayName(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_DISPLAY_NAME_LENGTH);
}

function toInteger(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : Number.NaN;
}

function isInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
