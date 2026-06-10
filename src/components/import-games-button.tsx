"use client";

import { useState } from "react";
import { fetchRecentChessDotComGames } from "@/lib/chess-com";
import { saveBrowserImportedGames } from "@/lib/browser-storage";
import type { GameReview } from "@/types/chess";

export function ImportGamesButton({
  username,
  onImported,
}: {
  username: string;
  onImported: (games: GameReview[], importedAt: string, username: string) => void;
}) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<{ status: "idle" | "success" | "error"; message: string }>({
    status: "idle",
    message: "",
  });

  async function handleImport() {
    if (!username.trim()) {
      setState({ status: "error", message: "Add a Chess.com username on onboarding first." });
      return;
    }

    setPending(true);
    setState({ status: "idle", message: "" });

    try {
      const result = await fetchRecentChessDotComGames({ username, maxGames: 10 });
      const importedAt = new Date().toISOString();
      saveBrowserImportedGames(username, result.games);
      onImported(result.games, importedAt, username);
      setState({ status: "success", message: result.message });
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "Import failed.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={handleImport}
        disabled={pending}
        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {pending ? "Importing..." : "Import latest Chess.com games"}
      </button>
      {state.status !== "idle" ? (
        <p className={`text-sm ${state.status === "error" ? "text-rose-600" : "text-emerald-600"}`}>{state.message}</p>
      ) : null}
    </div>
  );
}
