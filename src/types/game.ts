export interface RawgPlatform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface RawgGenre {
  id: number;
  name: string;
  slug: string;
}

export interface RawgGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  rating_top: number;
  ratings_count: number;
  metacritic: number | null;
  platforms?: RawgPlatform[];
  genres?: RawgGenre[];
}

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGame[];
}
