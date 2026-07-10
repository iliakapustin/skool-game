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


## Continue with Codex

1. Open this repository in Codex.
2. Ask Codex to read `AGENTS.md`.
3. Paste the prompt from `docs/CODEX_MASTER_PROMPT.md`.
4. Use the prompts in `docs/CODEX_TASK_PROMPTS.md` one at a time.
5. Commit after every completed task.
