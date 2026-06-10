import { mockGames, mockUser } from "@/data/mock-data";
import type { GameReview, UserProfile } from "@/types/chess";

const profileKey = "betterchess:user-profile";
const gamesKey = "betterchess:imported-games";

export type StoredGames = {
  username: string;
  importedAt: string;
  games: GameReview[];
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getBrowserUserProfile(): UserProfile {
  if (!canUseStorage()) {
    return mockUser;
  }

  try {
    const raw = window.localStorage.getItem(profileKey);
    return raw ? (JSON.parse(raw) as UserProfile) : mockUser;
  } catch {
    return mockUser;
  }
}

export function saveBrowserUserProfile(profile: UserProfile) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(profileKey, JSON.stringify(profile));
}

export function getBrowserImportedGames(): StoredGames | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(gamesKey);
    return raw ? (JSON.parse(raw) as StoredGames) : null;
  } catch {
    return null;
  }
}

export function saveBrowserImportedGames(username: string, games: GameReview[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(
    gamesKey,
    JSON.stringify({
      username,
      importedAt: new Date().toISOString(),
      games,
    } satisfies StoredGames),
  );
}

export function getBrowserDashboardGames() {
  return getBrowserImportedGames()?.games.length ? getBrowserImportedGames()!.games : mockGames;
}
