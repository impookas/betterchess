export type RatingBand = "opening" | "middlegame" | "endgame" | "calculation" | "time-management";

export type Theme = {
  id: string;
  name: string;
  category: RatingBand;
  summary: string;
  impact: "high" | "medium" | "low";
  drillSuggestion: string;
};

export type Position = {
  id: string;
  fen: string;
  moveToFind: string;
  evaluationSwing: number;
  note: string;
  themeIds: string[];
};

export type GameResult = "win" | "loss" | "draw";

export type GameReview = {
  id: string;
  platform: "Chess.com" | "Manual";
  opponent: string;
  playedAt: string;
  color: "white" | "black";
  result: GameResult;
  opening: string;
  accuracy?: number;
  ratingChange: number;
  summary: string;
  themes: Theme[];
  keyMoments: Position[];
  coachTakeaway: string;
  analysisStatus?: "mock" | "pending" | "complete";
  sourceUrl?: string;
  pgn?: string;
  timeControl?: string;
};

export type UserProfile = {
  id: string;
  displayName: string;
  chessDotComUsername: string;
  currentRating: number;
  targetRating: number;
  timezone: string;
  weeklyStudyHours: number;
  primaryGoals: string[];
};

export type TrainingTask = {
  id: string;
  title: string;
  type: "tactics" | "review" | "endgame" | "opening" | "rapid";
  durationMinutes: number;
  reason: string;
  linkedThemeIds: string[];
};

export type TrainingPlan = {
  id: string;
  title: string;
  focus: string;
  nextReviewDate: string;
  tasks: TrainingTask[];
};

export type ProgressPoint = {
  label: string;
  rating: number;
  gamesReviewed: number;
};

export type ProgressSnapshot = {
  ratingDelta30d: number;
  gamesReviewed30d: number;
  studyStreakDays: number;
  strongestArea: string;
  watchlistArea: string;
  points: ProgressPoint[];
};
