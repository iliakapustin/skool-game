import { NextResponse } from "next/server";
import { GAME_CATEGORIES, GAME_DIFFICULTIES, type LeaderboardResponse } from "@/game/leaderboardTypes";
import { getMockLeaderboard } from "@/server/mockLeaderboardStore";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const difficulty = url.searchParams.get("difficulty") ?? undefined;
  const limit = Number(url.searchParams.get("limit") ?? 25);

  if (category && !GAME_CATEGORIES.includes(category as never)) {
    return NextResponse.json({ ok: false, errors: ["Invalid category."] }, { status: 400 });
  }

  if (difficulty && !GAME_DIFFICULTIES.includes(difficulty as never)) {
    return NextResponse.json({ ok: false, errors: ["Invalid difficulty."] }, { status: 400 });
  }

  const response: LeaderboardResponse = {
    entries: getMockLeaderboard({
      category,
      difficulty: difficulty as never,
      limit,
    }),
    source: "mock",
  };

  return NextResponse.json(response);
}
