"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRecentChessDotComGames } from "@/lib/chess-com";
import { getBrowserUserProfile, saveBrowserImportedGames, saveBrowserUserProfile } from "@/lib/browser-storage";
import { mockUser } from "@/data/mock-data";
import type { UserProfile } from "@/types/chess";

type FormState = {
  displayName: string;
  chessDotComUsername: string;
  currentRating: string;
  targetRating: string;
  weeklyStudyHours: string;
  timezone: string;
  primaryGoals: string[];
};

export function OnboardingForm() {
  const router = useRouter();
  const storedUser = getBrowserUserProfile();
  const [form, setForm] = useState<FormState>({
    displayName: storedUser.displayName,
    chessDotComUsername: storedUser.chessDotComUsername,
    currentRating: `${storedUser.currentRating}`,
    targetRating: `${storedUser.targetRating}`,
    weeklyStudyHours: `${storedUser.weeklyStudyHours}`,
    timezone: storedUser.timezone,
    primaryGoals: storedUser.primaryGoals,
  });
  const [status, setStatus] = useState<{ tone: "idle" | "success" | "error"; message: string }>({ tone: "idle", message: "" });
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setStatus({ tone: "idle", message: "" });

    const profile: UserProfile = {
      ...mockUser,
      displayName: form.displayName.trim() || mockUser.displayName,
      chessDotComUsername: form.chessDotComUsername.trim(),
      timezone: form.timezone.trim() || mockUser.timezone,
      currentRating: Number(form.currentRating) || mockUser.currentRating,
      targetRating: Number(form.targetRating) || mockUser.targetRating,
      weeklyStudyHours: Number(form.weeklyStudyHours) || mockUser.weeklyStudyHours,
      primaryGoals: form.primaryGoals,
    };

    saveBrowserUserProfile(profile);

    if (profile.chessDotComUsername) {
      try {
        const result = await fetchRecentChessDotComGames({ username: profile.chessDotComUsername, maxGames: 10 });
        saveBrowserImportedGames(profile.chessDotComUsername, result.games);
        setStatus({ tone: "success", message: result.message });
      } catch (error) {
        setStatus({
          tone: "error",
          message: error instanceof Error ? `${error.message} Your profile was still saved in this browser.` : "Import failed, but your profile was still saved in this browser.",
        });
      }
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-slate-700">
        Hosted-friendly V1: this form saves your profile and imported games in this browser using localStorage, so it works on Vercel without server-side file writes.
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Display name" name="displayName" value={form.displayName} onChange={setForm} />
        <Field label="Chess.com username" name="chessDotComUsername" value={form.chessDotComUsername} onChange={setForm} required />
        <Field label="Current rating" name="currentRating" value={form.currentRating} onChange={setForm} type="number" />
        <Field label="Target rating" name="targetRating" value={form.targetRating} onChange={setForm} type="number" />
        <Field label="Weekly study hours" name="weeklyStudyHours" value={form.weeklyStudyHours} onChange={setForm} type="number" />
        <Field label="Timezone" name="timezone" value={form.timezone} onChange={setForm} />
      </div>
      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Primary goals</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {form.primaryGoals.map((goal) => (
            <span key={goal} className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
              {goal}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Saving onboarding also attempts a first Chess.com import for this username. Imported games stay in browser storage for this single-user V1.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400">
          {pending ? "Saving..." : "Save profile and import games"}
        </button>
        <p className="text-sm text-slate-500">Browser-local only, no auth, no cloud sync.</p>
      </div>
      {status.tone !== "idle" ? (
        <p className={`mt-4 text-sm ${status.tone === "error" ? "text-rose-600" : "text-emerald-600"}`}>{status.message}</p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  value,
  type = "text",
  required = false,
  onChange,
}: {
  label: string;
  name: keyof Omit<FormState, "primaryGoals">;
  value: string;
  type?: string;
  required?: boolean;
  onChange: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
      />
    </label>
  );
}
