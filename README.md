# BetterChess, personal chess trainer MVP

BetterChess is a lean MVP scaffold for a personal chess trainer web app.
It is intentionally **not** a live-play bot.

## What is real now

- Next.js App Router app with TypeScript and Tailwind
- Pages for `/`, `/onboarding`, `/dashboard`, `/games/[id]`, `/training`, `/progress`
- Hosted-friendly onboarding form that visibly renders as a normal interactive client form
- Chess.com import flow that runs in the browser against public Chess.com endpoints
- Browser-local persistence for the profile and imported games via `localStorage`
- Dashboard game list that prefers imported real Chess.com games and falls back to mock data when no import exists
- Minimal import button with loading, success, and failure states
- Review pages that show real imported metadata and clearly mark deeper analysis as pending when the game came from Chess.com
- Reusable UI components for weakness cards, training focus cards, game list, key moment review, and progress summary

## What is still mocked or partial

- Engine-backed analysis
- Theme extraction from PGN
- Accurate rating delta tracking from Chess.com game history
- Authentication and multi-user support
- Payments, subscriptions, and any production billing logic

## Local vs hosted behavior

This V1 now uses **browser-local storage** for the user profile and imported games.
That means the same core behavior works both locally and on hosted deployments like Vercel, without relying on server file writes.

Saved keys live in the browser only:

```text
betterchess:user-profile
betterchess:imported-games
```

Notes:

- Data is scoped to the specific browser profile and device you used.
- Vercel deployments do not share this data across users or devices.
- Clearing browser storage resets the saved profile/import state and returns the app to mock fallback behavior.
- There is no auth or cloud sync in this MVP.

## Chess.com import behavior

- Enter a Chess.com username on `/onboarding` and save the profile.
- The app attempts an immediate import of recent games in the browser.
- The dashboard also includes an `Import latest Chess.com games` button for re-importing the latest games later.
- The import uses public Chess.com archive endpoints only.
- The app currently pulls recent standard rated games from the latest available monthly archives and stores up to 10 games in browser storage.
- Imported games include metadata like opponent, date, color, time control, PGN, and source URL.
- Imported games do **not** yet have full move-by-move analysis. Review pages label this clearly as pending.

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

## Limitations for this pass

- Persistence is browser-local, not a database.
- The saved profile is a single local browser profile.
- Imported games are overwritten on each fresh import instead of merged historically.
- Review pages for imported games are metadata-first, with analysis placeholders rather than true PGN insights.
- The app should still be treated as a V1 MVP, not a fully production-ready product.

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

Build a real PGN analysis pass for imported games, then replace the placeholder review status with actual extracted mistakes, themes, and coach summaries from the saved PGNs.
