# Codex Task Prompts

Use these prompts one at a time.

---

## Prompt 1 — Audit the current project

Inspect the entire repository and create a technical audit.

Do not change files yet.

Report:
- current architecture
- entry points
- duplicated logic
- largest technical risks
- mobile risks
- game-loop risks
- state-management risks
- security risks
- recommended refactoring order

Also identify which parts should remain temporarily in `public/game/index.html` and which parts should move first into `src/game`.

---

## Prompt 2 — Refactor configuration

Move all static game configuration out of the large HTML file into typed modules.

Create modules for:
- categories
- difficulty settings
- activity values
- MRR values
- level goals
- spawn probabilities
- decision templates

Do not change gameplay behavior.

Add TypeScript types and tests for the configuration logic.

---

## Prompt 3 — Refactor game state

Create a typed game-state module.

It should include:
- player state
- follower state
- activity
- members
- level
- monetization
- MRR
- Growth Boost
- decisions
- pause state
- category
- difficulty

Do not change visible gameplay.

Add helper functions for safe state updates.

---

## Prompt 4 — Refactor mobile controls

Move mobile and desktop controls into a dedicated input system.

Requirements:
- swipe left and right
- arrow keys
- A/D keys
- pause shortcut
- fullscreen control
- no accidental scroll
- safe touch handling
- no duplicate lane changes from one gesture

Add tests where practical.

---

## Prompt 5 — Add audio system

Create a modular audio system.

Requirements:
- background music loop
- music on/off
- sound effects on/off
- music volume
- SFX volume
- pause music when game is paused
- resume music after user interaction
- persist audio settings locally

Use placeholder file paths:
- `/audio/music/main-theme.mp3`
- `/audio/sfx/member.mp3`
- `/audio/sfx/post.mp3`
- `/audio/sfx/flame.mp3`
- `/audio/sfx/churn.mp3`
- `/audio/sfx/spam.mp3`
- `/audio/sfx/boost.mp3`
- `/audio/sfx/win.mp3`

Do not add copyrighted audio files.

---

## Prompt 6 — Add local leaderboard prototype

Create a local leaderboard prototype before adding a real backend.

Requirements:
- player name
- category
- difficulty
- best activity
- best MRR
- highest level
- fastest win time
- date achieved

Store the data locally.

Add a leaderboard page in Next.js.

This is only a prototype and must clearly be separated from the future server-authoritative leaderboard.

---

## Prompt 7 — Add Supabase architecture

Prepare Supabase integration.

Create:
- typed database client
- environment-variable validation
- profile model
- game-run model
- leaderboard model
- migration files
- Row Level Security policies

Do not expose service-role keys to the browser.

Do not yet enable payments.

---

## Prompt 8 — Add authenticated player profiles

Add:
- sign up
- sign in
- sign out
- display name
- avatar choice
- preferred category
- preferred difficulty
- profile page

Persist profile data in Supabase.

Keep guest mode available for practice runs.

---

## Prompt 9 — Add secure ranked run flow

Design and implement a safer ranked-run flow.

Requirements:
- server creates a run ID
- client records signed events
- server validates final result
- impossible score jumps are rejected
- impossible MRR jumps are rejected
- duplicate submissions are rejected
- practice runs stay local
- only validated runs enter global rankings

Explain all anti-cheat limitations.

---

## Prompt 10 — Add Stripe subscriptions

Add Stripe subscriptions for paid access.

Requirements:
- hosted Checkout
- monthly subscription
- webhook validation
- subscription status stored in database
- active subscribers can access ranked mode
- canceled users keep access until period end
- no secret keys in client code
- clear local setup instructions

Do not block guest practice mode.

---

## Prompt 11 — Prepare Vercel deployment

Prepare the project for Vercel.

Requirements:
- production environment-variable documentation
- build verification
- error handling
- secure headers
- custom-domain instructions
- Supabase callback URLs
- Stripe webhook URL
- deployment checklist

Do not claim deployment succeeded unless it was actually tested.

---

## Prompt 12 — Phaser migration plan

Create a detailed migration plan from the current Canvas prototype to Phaser.

Do not migrate everything at once.

Plan incremental milestones:
1. boot scene
2. preload scene
3. gameplay scene
4. player movement
5. spawning
6. collisions
7. HUD bridge
8. followers
9. decisions
10. monetization
11. audio
12. mobile controls

The current Canvas game must remain available until Phaser feature parity is reached.
