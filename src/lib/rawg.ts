import { RawgGame, RawgGamesResponse } from "@/types/game";

const RAWG_BASE_URL = "https://api.rawg.io/api";

export async function searchGames(query?: string, page = 1, pageSize = 20): Promise<{ games: RawgGame[]; count: number; error?: string }> {
  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return {
      games: [],
      count: 0,
      error: "RAWG_API_KEY is not configured in environment variables.",
    };
  }

  try {
    const url = new URL(`${RAWG_BASE_URL}/games`);
    url.searchParams.set("key", apiKey);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("page_size", pageSize.toString());

    if (query && query.trim().length > 0) {
      url.searchParams.set("search", query.trim());
      url.searchParams.set("search_precise", "true");
    } else {
      // Default to top rated / popular recent games
      url.searchParams.set("ordering", "-rating");
      url.searchParams.set("dates", "2020-01-01,2026-12-31");
    }

    const res = await fetch(url.toString(), {
      // Revalidate cache every 1 hour to prevent excessive API calls
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return {
        games: [],
        count: 0,
        error: `RAWG API Error (${res.status}): ${errorText.slice(0, 100)}`,
      };
    }

    const data: RawgGamesResponse = await res.json();
    return {
      games: data.results || [],
      count: data.count || 0,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch games from RAWG";
    return {
      games: [],
      count: 0,
      error: msg,
    };
  }
}
