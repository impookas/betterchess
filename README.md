# BetterChess, personal chess trainer MVP

BetterChess is a local-first MVP scaffold for a personal chess trainer web app.
It is intentionally **not** a live-play bot.

## What is real now

- Next.js App Router app with TypeScript and Tailwind
- Pages for `/`, `/onboarding`, `/dashboard`, `/games/[id]`, `/training`, `/progress`
- Typed mock profile, games, themes, training plan, and progress data
- Reusable UI components for weakness cards, training focus cards, game list, key moment review, and progress summary
- A simple repository layer and placeholder analysis and Chess.com ingestion modules
- Clean scaffold for a single-user local MVP that can grow into a broader product

## What is mocked right now

- Chess.com ingestion
- Engine-backed game analysis
- Database persistence
- Authentication and multi-user support
- Payments, subscriptions, and any production billing logic

## Local run steps

1. Open a terminal.
2. Change into the project folder:

```bash
cd /Users/frannypraker/.openclaw/workspace/chess-trainer-mvp
```

3. Install dependencies if needed:

```bash
npm install
```

4. Start the dev server:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000
```

## Useful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project shape

```text
src/
  app/
    onboarding/
    dashboard/
    games/[id]/
    training/
    progress/
  components/
  data/
  lib/
  types/
```

## Architecture note

### Reusable from the old chess bot idea

- PGN and game ingestion concepts
- Position and theme extraction pipeline shape
- Engine-analysis handoff points
- Review-oriented data modeling for games, positions, and weaknesses

### Intentionally excluded from this product

- Any live move suggestions during play
- Browser overlays for active games
- Automation that touches live gameplay
- Anything that behaves like a bot instead of a training product

This MVP is focused on post-game improvement, training structure, and progress tracking.

## Recommended next implementation step

Wire real Chess.com import for a known username, store imported games in a lightweight local database layer, and replace one mocked review flow with a real PGN-to-analysis pipeline.
