"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { KeyMomentReviewPanel } from "@/components/key-moment-review-panel";
import { WeaknessCards } from "@/components/weakness-cards";
import { analyzeGameLocally } from "@/lib/analysis";
import { getBrowserDashboardGames } from "@/lib/browser-storage";
import type { Theme } from "@/types/chess";

export default function GameReviewPage() {
  const params = useParams<{ id: string }>();
  const game = useMemo(() => getBrowserDashboardGames().find((item) => item.id === params.id) ?? null, [params.id]);
  const [detectedThemes, setDetectedThemes] = useState<Theme[]>([]);
  const [overview, setOverview] = useState("Loading review...");

  useEffect(() => {
    let cancelled = false;

    async function runAnalysis() {
      if (!game) {
        setDetectedThemes([]);
        setOverview("This game was not found in browser storage.");
        return;
      }

      const analysis = await analyzeGameLocally(game);

      if (!cancelled) {
        setDetectedThemes(analysis.detectedThemes);
        setOverview(analysis.overview);
      }
    }

    void runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [game]);

  if (!game) {
    return (
      <AppShell title="Game review unavailable" subtitle="This game could not be found in this browser. Re-import games from the dashboard if needed.">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-600 shadow-sm">
          The requested game is not available in this browser-local session.
        </article>
      </AppShell>
    );
  }

  return (
    <AppShell
      title={`Game review: ${game.opponent}`}
      subtitle={`${game.opening} • ${game.result} as ${game.color} • ${game.platform}. This page is structured for coach-style review, not live assistance.`}
    >
      <section className="space-y-8">
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Accuracy" value={game.accuracy ? `${game.accuracy}%` : "N/A"} />
          <Metric label="Rating delta proxy" value={`${game.ratingChange > 0 ? "+" : ""}${game.ratingChange}`} />
          <Metric label="Key themes" value={`${game.themes.length}`} />
          <Metric label="Review status" value={game.analysisStatus === "pending" ? "Analysis pending" : "Mock analyzed"} />
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-wide text-slate-500">Coach summary</p>
          <p className="mt-3 text-lg leading-8 text-slate-700">{overview}</p>
          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{game.coachTakeaway}</div>
          {game.sourceUrl ? (
            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <Link href={game.sourceUrl} target="_blank" className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
                Open original Chess.com game
              </Link>
              {game.pgn ? <span className="rounded-full bg-slate-100 px-4 py-2 text-slate-600">PGN stored in this browser for later analysis</span> : null}
            </div>
          ) : null}
        </article>

        <div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Key moments</h2>
          <KeyMomentReviewPanel positions={game.keyMoments} />
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Themes detected</h2>
          {detectedThemes.length ? (
            <WeaknessCards themes={detectedThemes} />
          ) : (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-6 text-slate-600 shadow-sm">
              This imported game does not have theme extraction yet. Real game metadata is available, but deeper review remains pending for a future PGN analysis pass.
            </article>
          )}
        </div>
      </section>
    </AppShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}
