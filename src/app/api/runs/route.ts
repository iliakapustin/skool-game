import { NextResponse } from "next/server";
import { saveMockRun } from "@/server/mockLeaderboardStore";
import { validateGameRunSubmission } from "@/server/scoreValidation";

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

  const run = saveMockRun(validation.normalized, validation.score);

  return NextResponse.json({
    ok: true,
    run,
    warning: "Mock storage only. Replace with Supabase after database security rules are configured.",
  });
}
