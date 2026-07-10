import { NextResponse } from "next/server";
import { saveMockRun } from "@/server/mockLeaderboardStore";
import { validateGameRunSubmission } from "@/server/scoreValidation";
import { isSupabaseConfigured, saveSupabaseRun } from "@/server/supabaseLeaderboardStore";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errors: ["Invalid JSON body."] }, { status: 400 });
  }

  const validation = validateGameRunSubmission(body);

  if (!validation.ok) {
    return NextResponse.json({ ok: false, errors: validation.errors }, { status: 400 });
  }

  if (isSupabaseConfigured()) {
    try {
      const run = await saveSupabaseRun(validation.normalized, validation.score);

      return NextResponse.json({
        ok: true,
        run,
        source: "supabase",
      });
    } catch (error) {
      console.error("Supabase run save failed", error);
      return NextResponse.json({ ok: false, errors: ["Score storage is temporarily unavailable."] }, { status: 503 });
    }
  }

  const run = saveMockRun(validation.normalized, validation.score);

  return NextResponse.json({
    ok: true,
    run,
    source: "mock",
    warning: "Mock storage only. Configure Supabase environment variables for persistent storage.",
  });
}
