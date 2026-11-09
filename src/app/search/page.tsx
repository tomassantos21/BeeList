import { Suspense } from "react";
import { searchGames } from "@/lib/igdb";
import { getUserGames } from "@/app/actions/games";
import { createClient } from "@/lib/supabase/server";
import { SearchInput } from "@/components/SearchInput";
import { GameCard } from "@/components/GameCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  const { games, error: rawgError } = await searchGames(query);

  let userAuthenticated = false;
  const userGamesMap: Record<number, string> = {};

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userAuthenticated = !!user;

    if (user) {
      const userGames = await getUserGames();
      userGames.forEach((ug) => {
        userGamesMap[ug.game_id] = ug.status;
      });
    }
  } catch {
    // Supabase fallback
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <Suspense fallback={<div className="h-10 max-w-xl mx-auto bg-neutral-900 rounded-lg animate-pulse" />}>
          <SearchInput initialQuery={query} />
        </Suspense>
      </div>

      {rawgError && (
        <div className="max-w-xl mx-auto mb-6 p-3 rounded-lg border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-400">
          <span className="text-amber-400 font-medium">Notice:</span> {rawgError} Configure <code className="text-neutral-300">TWITCH_CLIENT_ID</code> and <code className="text-neutral-300">TWITCH_CLIENT_SECRET</code> in <code className="text-neutral-300">.env.local</code>.
        </div>
      )}

      <div className="flex items-center justify-between mb-4 border-b border-neutral-900 pb-2">
        <h1 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {query ? `Results for "${query}"` : "Featured Titles"}
        </h1>
        <span className="text-xs font-mono text-neutral-500">{games.length} games</span>
      </div>

      {games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((game) => {
            const releaseYear = game.released ? new Date(game.released).getFullYear() : null;
            const currentStatus = userGamesMap[game.id] as any;

            return (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.name}
                coverUrl={game.background_image}
                releaseYear={releaseYear}
                rating={game.rating}
                currentStatus={currentStatus}
                userAuthenticated={userAuthenticated}
              />
            );
          })}
        </div>
      ) : (
        !rawgError && (
          <div className="text-center py-16 text-neutral-500 text-sm">
            No games found. Try a different query.
          </div>
        )
      )}
    </div>
  );
}
