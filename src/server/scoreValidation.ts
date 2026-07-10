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
const MAX_GAME_VERSION_LENGTH = 40;
const MIN_RUN_DURATION_MS = 5_000;
const MAX_RUN_DURATION_MS = 60 * 60 * 1000;
const MAX_ACTIVITY = 250_000;
const MAX_MEMBERS = 50_000;
const MAX_MRR = 5_000_000;
const MAX_LEVEL = 300;
const MIN_WIN_DURATION_MS = 15_000;

const CATEGORY_FACTORS = {
  hobbies: { f: 0.78, m: 1 },
  music: { f: 0.88, m: 1.1 },
  money: { f: 1.35, m: 2.2 },
  spirituality: { f: 0.92, m: 1.2 },
  tech: { f: 1.28, m: 2 },
  health: { f: 1.08, m: 1.45 },
  careers: { f: 1.05, m: 1.4 },
  sports: { f: 0.95, m: 1.25 },
  love: { f: 0.9, m: 1.15 },
  selfImprovement: { f: 1.15, m: 1.65 },
} as const satisfies Record<GameRunSubmission["category"], { f: number; m: number }>;

const DIFFICULTY_FACTORS = {
  easy: { g: 0.85, base: 2_000 },
  normal: { g: 1, base: 3_000 },
  hard: { g: 1.2, base: 5_000 },
} as const satisfies Record<GameRunSubmission["difficulty"], { g: number; base: number }>;

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
  if (!gameVersion || gameVersion.length > MAX_GAME_VERSION_LENGTH) errors.push("Invalid game version.");
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
  if (won && durationMs < MIN_WIN_DURATION_MS) errors.push("Winning run is too short to be plausible.");
  if (members > 1 && activity < (members - 1) * 3) {
    errors.push("Member count is not plausible for the reported activity.");
  }
  if (mrr > members * 1_000 + 25_000) {
    errors.push("MRR is not plausible for the reported member count.");
  }

  if (
    GAME_CATEGORIES.includes(category as never) &&
    GAME_DIFFICULTIES.includes(difficulty as never) &&
    isFiniteInteger(activity) &&
    isFiniteInteger(members) &&
    isFiniteInteger(mrr) &&
    isFiniteInteger(level) &&
    isFiniteInteger(durationMs)
  ) {
    const typedCategory = category as GameRunSubmission["category"];
    const typedDifficulty = difficulty as GameRunSubmission["difficulty"];

    errors.push(
      ...validatePlausibility({
        category: typedCategory,
        difficulty: typedDifficulty,
        activity,
        members,
        mrr,
        level,
        durationMs,
        monetized,
        won,
      }),
    );
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

function validatePlausibility(run: Pick<
  GameRunSubmission,
  "category" | "difficulty" | "activity" | "members" | "mrr" | "level" | "durationMs" | "monetized" | "won"
>): string[] {
  const errors: string[] = [];
  const seconds = Math.max(1, run.durationMs / 1_000);
  const maxActivity = Math.floor(1_000 + seconds * 320);
  const maxMembers = Math.floor(30 + seconds * 18);
  const maxMrr = Math.floor(10_000 + seconds * 5_500 + run.members * 900);
  const maxLevel = estimateMaxLevel(run.activity, run.category, run.difficulty) + 1;
  const targetMrr = winGoal(run.category, run.difficulty);

  if (run.activity > maxActivity) errors.push("Activity is too high for the reported run duration.");
  if (run.members > maxMembers) errors.push("Member count is too high for the reported run duration.");
  if (run.mrr > maxMrr) errors.push("MRR is too high for the reported run duration.");
  if (run.level > maxLevel) errors.push("Level is too high for the reported activity.");
  if (run.won && run.mrr < targetMrr) errors.push("Winning run did not reach the category MRR goal.");
  if (!run.monetized && run.members > 250) errors.push("Non-monetized run has an implausible member count.");

  return errors;
}

function estimateMaxLevel(activity: number, category: GameRunSubmission["category"], difficulty: GameRunSubmission["difficulty"]): number {
  let level = 1;

  while (level < MAX_LEVEL && activity >= activityGoal(level, category, difficulty)) {
    level += 1;
  }

  return level;
}

function activityGoal(level: number, category: GameRunSubmission["category"], difficulty: GameRunSubmission["difficulty"]): number {
  const baseGoal = level === 1 ? 200 : level === 2 ? 500 : 500 + ((level - 2) * (level - 1)) / 2 * 400;
  return Math.round((baseGoal * CATEGORY_FACTORS[category].f * DIFFICULTY_FACTORS[difficulty].g) / 10) * 10;
}

function winGoal(category: GameRunSubmission["category"], difficulty: GameRunSubmission["difficulty"]): number {
  return Math.round((DIFFICULTY_FACTORS[difficulty].base * CATEGORY_FACTORS[category].m) / 100) * 100;
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

function isFiniteInteger(value: number): boolean {
  return Number.isInteger(value) && Number.isFinite(value);
}

function isInRange(value: number, min: number, max: number): boolean {
  return Number.isInteger(value) && value >= min && value <= max;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
