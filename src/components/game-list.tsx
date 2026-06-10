import Link from "next/link";
import type { GameReview } from "@/types/chess";

export function GameList({ games }: { games: GameReview[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.3fr,1fr,1fr,0.8fr,auto] gap-3 border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>Game</span>
        <span>Opening</span>
        <span>Takeaway</span>
        <span>Result</span>
        <span></span>
      </div>
      {games.map((game) => (
        <div key={game.id} className="grid grid-cols-1 gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0 md:grid-cols-[1.3fr,1fr,1fr,0.8fr,auto] md:items-center">
          <div>
            <p className="font-semibold text-slate-900">vs {game.opponent}</p>
            <p className="text-sm text-slate-500">{new Date(game.playedAt).toLocaleDateString()} • {game.color}{game.timeControl ? ` • ${game.timeControl}` : ""}</p>
          </div>
          <p className="text-sm text-slate-700">{game.opening}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">{game.summary}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{game.analysisStatus === "pending" ? "Real import, analysis pending" : "Mock review data"}</p>
          </div>
          <p className="text-sm font-semibold capitalize text-slate-900">{game.result}</p>
          <Link href={`/games/${game.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
