import Link from "next/link";
import { AppShell } from "@/components/app-shell";

const highlights = [
  "Onboard with Chess.com username, current rating, and target rating.",
  "Review recent games with structured key moments and recurring themes.",
  "Turn weaknesses into a practical weekly training plan.",
];

export default function Home() {
  return (
    <AppShell
      title="Train with structure, not guesswork."
      subtitle="BetterChess is a serious but lean personal chess trainer that turns your recent games into focused study work. This V1 is local-first, single-user, and built to grow into a public product later."
    >
      <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-indigo-500">What this MVP does</p>
          <div className="mt-4 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-4 text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/onboarding" className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              Start onboarding
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950">
              View dashboard
            </Link>
          </div>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">V1 boundaries</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>Real today: product structure, mock profile, mock analyzed games, training-plan shape, progress UI.</li>
            <li>Next later: live Chess.com ingestion, engine-backed analysis, persistence, auth, and multi-user support.</li>
            <li>Intentionally excluded: live move suggestions, automation during games, and bot behavior of any kind.</li>
          </ul>
        </article>
      </section>
    </AppShell>
  );
}
