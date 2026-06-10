import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/training", label: "Training Plan" },
  { href: "/progress", label: "Progress" },
  { href: "/onboarding", label: "Onboarding" },
];

export function AppShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.12),_transparent_35%),linear-gradient(180deg,#0b1020_0%,#111827_45%,#f8fafc_45%,#f8fafc_100%)] text-slate-950">
      <header className="border-b border-white/10 bg-slate-950/80 text-slate-100 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">
            BetterChess
          </Link>
          <nav className="flex flex-wrap gap-3 text-sm text-slate-300">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-1.5 transition hover:bg-white/10 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-950/85 p-8 text-white shadow-2xl shadow-slate-950/25">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-indigo-300">Personal chess trainer MVP</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">{subtitle}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
