import { Suspense } from "react";
import { searchGames } from "@/lib/rawg";
import { getUserGames } from "@/app/actions/games";
import { createClient } from "@/lib/supabase/server";
import { SearchInput } from "@/components/SearchInput";
import { GameCard } from "@/components/GameCard";
import { AlertCircle, Flame, Gamepad } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  // Fetch search results from RAWG
  const { games, error: rawgError } = await searchGames(query);

  // Check auth and fetch user's saved games map
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
    // Supabase credentials might not be configured yet
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-3">
          Discover & Search Games
        </h1>
        <p className="text-neutral-400 text-sm max-w-xl mx-auto mb-6">
          Find games across all platforms to add to your personal gaming collection or backlog wishlist.
        </p>

        <Suspense fallback={<div className="h-14 max-w-2xl mx-auto bg-neutral-900 rounded-2xl animate-pulse" />}>
          <SearchInput initialQuery={query} />
        </Suspense>
      </div>

      {/* RAWG Configuration / Error Notice */}
      {rawgError && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
          <div>
            <span className="font-semibold block mb-0.5">RAWG API Notice</span>
            <p className="text-neutral-300 text-xs">
              {rawgError} Add your free RAWG API key to <code className="text-amber-200">.env.local</code> as <code className="text-amber-200">RAWG_API_KEY=your_key</code> to search through 800,000+ video games.
            </p>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {query ? (
            <>
              <Gamepad className="w-5 h-5 text-violet-400" />
              <h2 className="text-lg font-semibold text-white">
                Results for &ldquo;<span className="text-violet-400">{query}</span>&rdquo;
              </h2>
            </>
          ) : (
            <>
              <Flame className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Popular & Featured Titles</h2>
            </>
          )}
        </div>
        <span className="text-xs text-neutral-400">{games.length} games shown</span>
      </div>

      {/* Game Cards Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="text-center py-16 bg-neutral-900/30 border border-neutral-800/60 rounded-3xl p-8">
            <Gamepad className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No games found</h3>
            <p className="text-neutral-400 text-sm mt-1">
              Try searching with another title or keyword.
            </p>
          </div>
        )
      )}
    </div>
  );
}
