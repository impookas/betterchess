import type { GameReview, GameResult, Position } from "@/types/chess";

export type ChessComIngestionRequest = {
  username: string;
  maxGames?: number;
};

type ChessComArchiveResponse = {
  archives?: string[];
};

type ChessComPlayer = {
  username?: string;
  rating?: number;
  result?: string;
};

type ChessComGame = {
  url?: string;
  pgn?: string;
  time_control?: string;
  end_time?: number;
  rated?: boolean;
  rules?: string;
  white?: ChessComPlayer;
  black?: ChessComPlayer;
};

type ChessComGamesResponse = {
  games?: ChessComGame[];
};

const pendingKeyMoments: Position[] = [
  {
    id: "pending-analysis-1",
    fen: "PGN import only",
    moveToFind: "Analysis pending",
    evaluationSwing: 0,
    note: "Real game imported successfully. Engine-backed key moments are not implemented yet in this V1.",
    themeIds: [],
  },
];

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function getResult(playerResult?: string): GameResult {
  if (playerResult === "win") {
    return "win";
  }

  if (playerResult && ["agreed", "repetition", "stalemate", "insufficient", "50move", "timevsinsufficient"].includes(playerResult)) {
    return "draw";
  }

  return "loss";
}

function extractOpeningName(pgn?: string) {
  const match = pgn?.match(/\[ECOUrl\s+"https:\/\/www\.chess\.com\/openings\/([^"\]]+)"\]/i);

  if (!match?.[1]) {
    return "Opening unavailable";
  }

  return decodeURIComponent(match[1]).replace(/-/g, " ");
}

function buildSummary(result: GameResult, opponent: string, opening: string) {
  const outcome = result === "win" ? "Won" : result === "loss" ? "Lost" : "Drew";
  return `${outcome} a real imported Chess.com game against ${opponent}. Opening: ${opening}. Full analysis is still pending in this V1.`;
}

function toGameReview(game: ChessComGame, username: string, index: number): GameReview | null {
  const normalizedUsername = normalizeUsername(username);
  const whiteUsername = normalizeUsername(game.white?.username ?? "");
  const blackUsername = normalizeUsername(game.black?.username ?? "");
  const isWhite = whiteUsername === normalizedUsername;
  const isBlack = blackUsername === normalizedUsername;

  if (!isWhite && !isBlack) {
    return null;
  }

  const player = isWhite ? game.white : game.black;
  const opponent = isWhite ? game.black : game.white;
  const result = getResult(player?.result);
  const opening = extractOpeningName(game.pgn);
  const playedAt = game.end_time ? new Date(game.end_time * 1000).toISOString() : new Date().toISOString();
  const playerRating = player?.rating ?? 0;
  const opponentRating = opponent?.rating ?? playerRating;

  return {
    id: `chesscom-${normalizedUsername}-${game.end_time ?? Date.now()}-${index}`,
    platform: "Chess.com",
    opponent: opponent?.username ?? "Unknown opponent",
    playedAt,
    color: isWhite ? "white" : "black",
    result,
    opening,
    accuracy: undefined,
    ratingChange: playerRating && opponentRating ? playerRating - opponentRating : 0,
    summary: buildSummary(result, opponent?.username ?? "Unknown opponent", opening),
    themes: [],
    keyMoments: pendingKeyMoments,
    coachTakeaway: "Imported game data is real. Coach summary and tactical breakdown are still mocked or pending deeper PGN analysis.",
    analysisStatus: "pending",
    sourceUrl: game.url,
    timeControl: game.time_control,
    pgn: game.pgn,
  };
}

export async function fetchRecentChessDotComGames(request: ChessComIngestionRequest) {
  const username = normalizeUsername(request.username);
  const maxGames = request.maxGames ?? 10;

  const archivesResponse = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`, {
    headers: {
      "User-Agent": "BetterChess/0.1 (https://github.com/impookas/betterchess)",
    },
    cache: "no-store",
  });

  if (!archivesResponse.ok) {
    throw new Error(archivesResponse.status === 404 ? `Chess.com user ${username} was not found.` : `Chess.com archive request failed with ${archivesResponse.status}.`);
  }

  const archivesData = (await archivesResponse.json()) as ChessComArchiveResponse;
  const archives = archivesData.archives ?? [];

  if (!archives.length) {
    return {
      status: "success" as const,
      message: `No archived games were found for ${username}.`,
      games: [],
    };
  }

  const recentArchives = archives.slice(-3).reverse();
  const gameResponses = await Promise.all(
    recentArchives.map(async (archiveUrl) => {
      const response = await fetch(archiveUrl, {
        headers: {
          "User-Agent": "BetterChess/0.1 (https://github.com/impookas/betterchess)",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Chess.com monthly archive request failed with ${response.status}.`);
      }

      return (await response.json()) as ChessComGamesResponse;
    }),
  );

  const games = gameResponses
    .flatMap((response) => response.games ?? [])
    .filter((game) => game.rated !== false && game.rules === "chess")
    .sort((a, b) => (b.end_time ?? 0) - (a.end_time ?? 0))
    .slice(0, maxGames)
    .map((game, index) => toGameReview(game, username, index))
    .filter((game): game is GameReview => Boolean(game));

  return {
    status: "success" as const,
    message: games.length
      ? `Imported ${games.length} recent Chess.com games for ${username}.`
      : `No recent standard rated games were found for ${username}.`,
    games,
  };
}
