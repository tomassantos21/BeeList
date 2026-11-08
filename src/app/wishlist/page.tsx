import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { UserGame } from "@/types/database";
import { Bookmark, Plus, Search } from "lucide-react";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/wishlist");
  }

  const { data, error } = await supabase
    .from("user_games")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "wishlist")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error loading wishlist:", error);
  }

  const games = (data as UserGame[]) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">My Wishlist</h1>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Keep track of upcoming releases and games you want to play next.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-medium text-sm text-neutral-950 transition shadow-lg shadow-amber-500/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Find More Games</span>
        </Link>
      </div>

      {/* Wishlist Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.game_id}
              title={game.game_title}
              coverUrl={game.cover_url}
              currentStatus={game.status}
              userAuthenticated={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Your wishlist is empty</h3>
          <p className="text-neutral-400 text-sm mb-6">
            Search for games and add them to your wishlist to plan your next adventures.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-medium text-sm text-neutral-950 transition shadow-lg shadow-amber-500/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Games</span>
          </Link>
        </div>
      )}
    </div>
  );
}
