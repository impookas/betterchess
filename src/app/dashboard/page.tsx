"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GameList } from "@/components/game-list";
import { ImportGamesButton } from "@/components/import-games-button";
import { ProgressSummary } from "@/components/progress-summary";
import { WeaknessCards } from "@/components/weakness-cards";
import { mockProgress, mockWeaknesses } from "@/data/mock-data";
import { getBrowserDashboardGames, getBrowserImportedGames, getBrowserUserProfile } from "@/lib/browser-storage";
import type { GameReview, UserProfile } from "@/types/chess";

type ImportMeta = {
  username: string;
  importedAt: string;
  games: GameReview[];
} | null;

export default function DashboardPage() {
  const [user] = useState<UserProfile>(getBrowserUserProfile());
  const [games, setGames] = useState<GameReview[]>(getBrowserDashboardGames());
  const [importMeta, setImportMeta] = useState<ImportMeta>(getBrowserImportedGames());

  return (
    <AppShell
      title={`Dashboard for ${user.displayName}`}
      subtitle={`Current rating ${user.currentRating}, target ${user.targetRating}. Focus on turning recent game review into a manageable weekly training rhythm.`}
    >
      <section className="space-y-8">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Recurring weaknesses</h2>
          </div>
          <WeaknessCards themes={mockWeaknesses} />
        </div>

        <div>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Recent reviewed games</h2>
              <p className="mt-1 text-sm text-slate-500">
                {importMeta?.games.length
                  ? `Showing ${importMeta.games.length} imported Chess.com games for ${importMeta.username}. Last import ${new Date(importMeta.importedAt).toLocaleString()}.`
                  : "No imported games yet, so the dashboard is using mock fallback games."}
              </p>
            </div>
            <ImportGamesButton
              username={user.chessDotComUsername}
              onImported={(importedGames, importedAt, importedUsername) => {
                setGames(importedGames.length ? importedGames : getBrowserDashboardGames());
                setImportMeta({ username: importedUsername, importedAt, games: importedGames });
              }}
            />
          </div>
          <GameList games={games} />
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Progress snapshot</h2>
          </div>
          <ProgressSummary progress={mockProgress} />
        </div>
      </section>
    </AppShell>
  );
}
