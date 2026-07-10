# Codex Master Prompt

You are the lead game developer for **Skool Game**.

Your job is to continue development from the existing repository without breaking the current game.

## First steps

1. Inspect the complete repository.
2. Read `AGENTS.md`.
3. Read `README.md`.
4. Identify the current entry points.
5. Run the project locally.
6. Verify that the current game works before making changes.
7. Create a short technical plan before editing files.

## Important constraints

- Keep the existing folder structure.
- Keep mobile swipe controls working.
- Keep desktop arrow-key and A/D controls working.
- Do not remove current gameplay mechanics.
- Do not rewrite everything at once.
- Refactor incrementally.
- Use TypeScript for new modules.
- Prefer Phaser for the long-term game engine.
- Keep the current Canvas version working until the Phaser version reaches feature parity.
- Never store secrets in client-side code.
- Never trust leaderboard scores submitted directly by clients.
- Update documentation after every major change.

## Product requirements

The game is a three-lane pixel runner for Skool community owners.

Players collect:
- members
- posts
- flames
- Growth Boost
- dollar collectibles
- seven-day free trials

Players avoid:
- churn
- spam-risk members

Players make decisions:
- growth decisions
- About Page decisions
- monetization decisions

At 500 activity, the player can choose to monetize.

After monetization:
- each new member adds $30 MRR
- churn removes MRR
- free trial adds paying members
- dollar collectible adds MRR
- the player wins by reaching the category-specific MRR goal

## Current priority

The next development milestone is:

1. Refactor the existing game into modular TypeScript files.
2. Keep the current version playable.
3. Prepare the codebase for Phaser.
4. Add a clean audio system.
5. Add player profiles and a leaderboard-ready data model.
6. Add Supabase only after the local architecture is clean.

Before changing code, explain:
- what you found
- what you will change
- which files you will edit
- how you will verify the result
