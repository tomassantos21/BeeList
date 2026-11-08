import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { UserGame } from "@/types/database";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Wishlist</h1>
          <p className="text-neutral-500 text-xs mt-0.5">{games.length} games queued</p>
        </div>

        <Link
          href="/search"
          className="text-xs px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition"
        >
          + Find games
        </Link>
      </div>

      {/* Grid */}
      {games.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
        <div className="text-center py-20 text-neutral-500 text-sm">
          Your wishlist is empty.{" "}
          <Link href="/search" className="text-neutral-300 underline underline-offset-4">
            Search games to queue up
          </Link>
        </div>
      )}
    </div>
  );
}
