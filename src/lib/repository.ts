import { mockProgress, mockTrainingPlan, mockWeaknesses } from "@/data/mock-data";
import { getDashboardGames, getStoredImportedGames, getStoredUserProfile } from "@/lib/storage";

export const db = {
  users: {
    getCurrent: async () => getStoredUserProfile(),
  },
  games: {
    list: async () => getDashboardGames(),
    getById: async (id: string) => {
      const games = await getDashboardGames();
      return games.find((game) => game.id === id) ?? null;
    },
    getImportMeta: async () => getStoredImportedGames(),
  },
  trainingPlans: {
    getCurrent: async () => mockTrainingPlan,
  },
  progress: {
    getCurrent: async () => mockProgress,
  },
  themes: {
    listWeaknesses: async () => mockWeaknesses,
  },
};
