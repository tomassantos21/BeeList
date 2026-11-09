interface IgdbRawGame {
  id: number;
  name: string;
  cover?: {
    id: number;
    url: string;
  };
  first_release_date?: number; // Unix timestamp in seconds
  total_rating?: number; // 0 - 100
  summary?: string;
}

export interface GameItem {
  id: number;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number | null;
}

// In-memory token cache to avoid requesting tokens on every call
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getTwitchAppToken(clientId: string, clientSecret: string): Promise<string | null> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  try {
    const res = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      // Revalidate cache appropriately
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to authenticate with Twitch:", await res.text());
      return null;
    }

    const data = await res.json();
    cachedToken = {
      token: data.access_token,
      expiresAt: now + data.expires_in * 1000,
    };
    return data.access_token;
  } catch (err) {
    console.error("Twitch OAuth error:", err);
    return null;
  }
}

export async function searchGames(
  query?: string,
  limit = 20
): Promise<{ games: GameItem[]; count: number; error?: string }> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      games: [],
      count: 0,
      error: "TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET is missing in environment variables.",
    };
  }

  const token = await getTwitchAppToken(clientId, clientSecret);
  if (!token) {
    return {
      games: [],
      count: 0,
      error: "Could not authenticate with Twitch/IGDB API. Check your Client ID and Secret.",
    };
  }

  try {
    let bodyQuery = "";
    if (query && query.trim().length > 0) {
      // Escape quotes for Apicalypse syntax
      const cleanQuery = query.trim().replace(/["\\]/g, "");
      bodyQuery = `fields name, cover.url, first_release_date, total_rating; search "${cleanQuery}"; limit ${limit};`;
    } else {
      // Top rated popular games with valid covers
      bodyQuery = `fields name, cover.url, first_release_date, total_rating; where total_rating_count > 50 & cover != null; sort total_rating desc; limit ${limit};`;
    }

    const res = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: bodyQuery,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        games: [],
        count: 0,
        error: `IGDB API Error (${res.status}): ${errText.slice(0, 150)}`,
      };
    }

    const data: IgdbRawGame[] = await res.json();

    const games: GameItem[] = data.map((g) => {
      // Convert IGDB thumbnail URL (//images.igdb.com/igdb/image/upload/t_thumb/co123.jpg) to high-res t_cover_big
      let coverUrl: string | null = null;
      if (g.cover?.url) {
        let rawUrl = g.cover.url;
        if (rawUrl.startsWith("//")) {
          rawUrl = `https:${rawUrl}`;
        }
        coverUrl = rawUrl.replace("t_thumb", "t_cover_big");
      }

      return {
        id: g.id,
        name: g.name,
        released: g.first_release_date
          ? new Date(g.first_release_date * 1000).toISOString()
          : null,
        background_image: coverUrl,
        // Convert 0-100 to 0-5 scale to match UI star rating
        rating: g.total_rating ? +(g.total_rating / 20).toFixed(1) : null,
      };
    });

    return {
      games,
      count: games.length,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch games from IGDB";
    return {
      games: [],
      count: 0,
      error: msg,
    };
  }
}
