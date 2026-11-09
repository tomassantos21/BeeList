import { searchGames } from "@/lib/igdb";
import { getUserGames } from "@/app/actions/games";
import { createClient } from "@/lib/supabase/server";
import { SearchInput } from "@/components/SearchInput";
import { GameCard } from "@/components/GameCard";
import Link from "next/link";

export default async function HomePage() {
  let user = null;
  const userGamesMap: Record<number, string> = {};

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const userGames = await getUserGames();
      userGames.forEach((ug) => {
        userGamesMap[ug.game_id] = ug.status;
      });
    }
  } catch {
    // Unauthenticated fallback
  }

  const { games } = await searchGames();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Lean Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
          Track the games you play.
        </h1>
        <p className="text-neutral-400 text-sm mb-6">
          Simple backlog and wishlist tracking.
        </p>

        <SearchInput />

        <div className="flex items-center justify-center gap-3 mt-4 text-xs">
          {user ? (
            <>
              <Link href="/library" className="text-neutral-400 hover:text-white underline underline-offset-4">
                View Library
              </Link>
              <span className="text-neutral-700">•</span>
              <Link href="/wishlist" className="text-neutral-400 hover:text-white underline underline-offset-4">
                View Wishlist
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-neutral-400 hover:text-white underline underline-offset-4">
                Sign in
              </Link>
              <span className="text-neutral-700">•</span>
              <Link href="/signup" className="text-neutral-400 hover:text-white underline underline-offset-4">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Featured / Popular Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-neutral-900 pb-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Popular Games
          </h2>
          <Link href="/search" className="text-xs text-neutral-500 hover:text-neutral-300 transition">
            Search all →
          </Link>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.slice(0, 15).map((game) => {
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
                  userAuthenticated={!!user}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 text-center py-12">
            No games loaded. Ensure RAWG_API_KEY is configured.
          </p>
        )}
      </div>
    </div>
  );
}
