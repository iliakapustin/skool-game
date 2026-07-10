# AGENTS.md

## Project

You are the lead developer for **Skool Game**, a browser-based pixel runner for Skool community owners.

The game must work well on:
- Mobile phones
- Tablets
- Desktop browsers

The current prototype is located in:

`public/game/index.html`

The surrounding application uses Next.js.

## Main product idea

The player runs forward on a three-lane road.

The player:
- collects members
- collects posts
- collects flames
- avoids churn
- avoids spam-risk members
- makes fast business decisions
- unlocks monetization at 500 activity
- earns MRR after monetization
- tries to reach the category-specific MRR goal

## Core mechanics

### Activity

- New member: +10 activity
- Post: +20 activity
- Flame: +3 activity
- Churn: -10 activity per lost member

### Monetization

- Unlock monetization choice at 500 activity
- Monetized members add $30 MRR
- Dollar collectible adds $100 MRR
- Seven-day free trial adds:
  - +10 members
  - +100 activity
  - +$300 MRR

### Categories

The game currently includes:
- Hobbies
- Music
- Money
- Spirituality
- Tech
- Health
- Careers
- Sports
- Love
- Self Improvement

Categories affect:
- speed
- hazard frequency
- churn
- spam risk
- activity targets
- MRR targets

### Decisions

Examples:
- +1 member versus -4 members
- x2 members versus -20 members
- Adjust About Page
- Make No Adjustments
- Monetize
- Do not monetize

## Mobile requirements

Every change must preserve:
- swipe left and right
- safe-area support
- dynamic viewport height
- no accidental page scrolling
- responsive HUD
- large touch controls
- fullscreen support

## Coding rules

1. Do not remove existing mechanics unless explicitly instructed.
2. Do not put new large features directly into one giant file.
3. Prefer TypeScript modules.
4. Keep UI, game logic, server code, and data access separate.
5. Validate all user input.
6. Never expose private keys in client-side code.
7. Never trust scores submitted by the browser.
8. Use server-side validation for leaderboard submissions.
9. Preserve local development instructions.
10. Update README.md whenever setup or architecture changes.

## Target architecture

- Next.js
- TypeScript
- Phaser for gameplay
- Supabase for authentication and database
- Stripe for subscriptions
- Vercel for deployment

## Required folder structure

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
├── docs/
├── README.md
├── package.json
└── .env.local
```

## Definition of done

A task is complete only when:
- the app builds
- the game still starts
- mobile swipe still works
- desktop keyboard controls still work
- no console errors appear
- README or docs are updated when needed
- changed code is explained briefly
