# Skool Game Mobile

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Mobile controls

- Swipe left or right anywhere on the game screen to switch lanes.
- The swipe hint hides after the first valid swipe.
- Arrow buttons are still available.
- Tap the full-screen icon for a more app-like experience.
- Pause with the pause button.

## Current prototype notes

- The Canvas prototype is served from `public/game/index.html`.
- Custom background music is loaded from `public/audio/SKOOL GAME.wav` after the player starts a run.
- The music button toggles mute state and stores that preference locally.
- Leaderboard-ready TypeScript models live in `src/game/leaderboardTypes.ts`.
- Run submissions are validated server-side in `src/server/scoreValidation.ts`.
- Mock API routes are available at `POST /api/runs` and `GET /api/leaderboard`.
- Desktop start/menu layout is kept compact so the start button is visible at 1280x720.
- Settings cancel returns to gameplay when settings were opened during an active run.
- Collectibles use clearer in-game visuals for posts and flames.
- Member and spam-risk avatars now use varied shirt colors and short/long hair variants.
- Object spawning tries to keep distance between newly spawned lane objects.
- Engagement streak now increases Activity and positive MRR rewards at 3, 5, 10, and 20 collected engagement actions.
- Churn and bad spam reset the engagement streak.
- Feedback messages now use Skool-style community events instead of only numeric notices.
- Referral Wave can spawn 2-4 members as a group.
- Member Magnet temporarily collects members and referral groups from nearby lanes.
- High Ticket Sale can appear after monetization and awards +$500 MRR before streak multipliers.

## Structure

```text
skool-game/
├── public/
│   ├── audio/
│   ├── sprites/
│   ├── icons/
│   ├── backgrounds/
│   └── game/
├── src/
│   ├── game/
│   ├── components/
│   ├── app/
│   └── server/
├── README.md
├── package.json
└── .env.local
```

## Online Safety Architecture

- Never store private API keys or service-role keys in `public/` files or client-side code.
- Keep `.env.local` private and out of GitHub.
- Store production secrets only in Vercel Environment Variables.
- Do not let the browser write trusted leaderboard rows directly.
- Score submissions must go through server routes first.
- Server routes validate category, difficulty, duration, activity, members, MRR, and win state before accepting a run.
- Current leaderboard storage is an in-memory mock for architecture testing only.

## Supabase Preparation

Before adding Supabase:

1. Keep the local API contract stable: `POST /api/runs` and `GET /api/leaderboard`.
2. Create database tables for profiles, runs, and leaderboard views.
3. Enable Row Level Security before public launch.
4. Use the Supabase anon key only for safe client reads/auth flows.
5. Use the Supabase service-role key only inside server-side API routes.
6. Add rate limiting and stricter anti-cheat validation before accepting public leaderboard submissions.


## Continue with Codex

1. Open this repository in Codex.
2. Ask Codex to read `AGENTS.md`.
3. Paste the prompt from `docs/CODEX_MASTER_PROMPT.md`.
4. Use the prompts in `docs/CODEX_TASK_PROMPTS.md` one at a time.
5. Commit after every completed task.
