# Skool Game Mobile

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy latest version

Run this in Git Bash, not in the browser and not inside Vercel:

```bash
cd "/c/Users/Alexeev/Documents/SKOOL GAME/skool-game"
bash scripts/deploy.sh "Update Skool Game"
```

The script builds the project, stages the app files, commits them, and pushes to GitHub. Vercel then deploys automatically from the GitHub push.

Local file changes alone do not update `https://skool-game.vercel.app`. The live site changes only after GitHub receives a new commit and Vercel finishes the deployment.

## Mobile controls

- Swipe left or right anywhere on the game screen to switch lanes.
- The swipe hint hides after the first valid swipe.
- Arrow buttons are still available.
- Tap the full-screen icon for a more app-like experience.
- Pause with the pause button.

## Current prototype notes

- The Canvas prototype is served from `public/game/index.html`.
- Visible game UI uses English ASCII labels to avoid broken emoji/symbol rendering across browsers and deployments.
- The start screen offers Arcade Mode and Community Builder Mode.
- Community Builder Mode adds audience, problem, and first-offer choices before the run starts.
- Community Builder Mode teaches the loop: attract members, convert them, retain them, monetize, reinvest, and grow faster.
- Builder decisions affect cash, churn, reputation, founder energy, paid members, engagement, members, and MRR.
- Builder wins require a healthier business, not only enough MRR: retention, reputation, and founder energy must stay stable.
- Custom background music is loaded from `public/audio/SKOOL GAME.wav` after the player starts a run.
- The music button toggles background music plus generated WebAudio sound effects and stores that preference locally.
- Generated sound effects play for lane movement, collectibles, MRR rewards, hazards, boosts, and wins.
- Leaderboard-ready TypeScript models live in `src/game/leaderboardTypes.ts`.
- Run submissions are validated server-side in `src/server/scoreValidation.ts`.
- Mock API routes are available at `POST /api/runs` and `GET /api/leaderboard`.
- The Canvas game creates a local browser player id and submits a validated run to `POST /api/runs` after a win.
- `GET /api/leaderboard` returns submitted mock leaderboard entries while the current server instance is warm.
- The Canvas game has an in-game Leaderboard overlay that reads the top runs from `GET /api/leaderboard`.
- Player name is saved locally, and the leaderboard marks the current browser profile as `YOU`.
- The start screen shows the current local profile code and the browser's best saved run.
- The in-game leaderboard can filter by category and difficulty.
- Leaderboard results are deduped to the best run per browser player id before ranking.
- Leaderboard tabs provide Global, My Category, and My Difficulty views.
- Wins now open a run summary with MRR, score, rank status, engagement, members, Play Again, and View Leaderboard actions.
- Win and leaderboard screens update the local best-run summary after accepted score submissions.
- When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, the API stores runs and reads the leaderboard from Supabase.
- Without Supabase environment variables, the API falls back to in-memory mock storage for local development.
- Desktop start/menu layout is kept compact so the start button is visible at 1280x720.
- Settings cancel returns to gameplay when settings were opened during an active run.
- Collectibles use clearer in-game visuals for posts and flames.
- Member and spam-risk avatars now use varied shirt colors and short/long hair variants.
- Object spawning tries to keep distance between newly spawned lane objects.
- Engagement streak now increases Engagement and positive MRR rewards at 3, 5, 10, and 20 collected engagement actions.
- Churn and bad spam reset the engagement streak.
- Feedback messages now use Skool-style community events instead of only numeric notices.
- Referral Wave can spawn 2-4 members as a group.
- Member Magnet temporarily collects members and referral groups from nearby lanes.
- High Ticket Sale can appear after monetization and awards +$500 MRR before streak multipliers.

## Structure

```text
skool-game/
|-- public/
|   |-- audio/
|   |-- sprites/
|   |-- icons/
|   |-- backgrounds/
|   `-- game/
|-- src/
|   |-- game/
|   |-- components/
|   |-- app/
|   `-- server/
|-- scripts/
|   `-- deploy.sh
|-- README.md
|-- package.json
`-- .env.local
```

## Online Safety Architecture

- Never store private API keys or service-role keys in `public/` files or client-side code.
- Keep `.env.local` private and out of GitHub.
- Store production secrets only in Vercel Environment Variables.
- Do not let the browser write trusted leaderboard rows directly.
- Score submissions must go through server routes first.
- Server routes validate category, difficulty, duration, engagement, members, MRR, and win state before accepting a run.
- Server-side plausibility checks reject impossible win duration, level/engagement mismatch, MRR below the category win goal, and extreme engagement/member/MRR growth for the submitted duration.
- Server routes rate-limit score submissions by player id and request IP as a first anti-spam layer.
- Current leaderboard storage is an in-memory mock for architecture testing only.
- Local browser player ids are not secure identity; they are only a preparation step before real profiles/auth.
- Local best-run data is client-side convenience only and must not be treated as trusted leaderboard data.

## Supabase Preparation

Before adding Supabase:

1. Keep the local API contract stable: `POST /api/runs` and `GET /api/leaderboard`.
2. Run `docs/supabase-schema.sql` in the Supabase SQL Editor to create profiles, runs, leaderboard view, indexes, and RLS.
3. Enable Row Level Security before public launch.
4. Use the Supabase anon key only for safe client reads/auth flows.
5. Use the Supabase service-role key only inside server-side API routes.
6. Add rate limiting and stricter anti-cheat validation before accepting public leaderboard submissions.

Required environment variables for the Supabase API step:

```bash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not put `SUPABASE_SERVICE_ROLE_KEY` in `public/`, browser code, or GitHub.


## Continue with Codex

1. Open this repository in Codex.
2. Ask Codex to read `AGENTS.md`.
3. Paste the prompt from `docs/CODEX_MASTER_PROMPT.md`.
4. Use the prompts in `docs/CODEX_TASK_PROMPTS.md` one at a time.
5. Commit after every completed task.
