import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { UserGame } from "@/types/database";

interface LibraryPageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
  const params = await searchParams;
  const currentFilter = params.filter || "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/library");
  }

  const { data, error } = await supabase
    .from("user_games")
    .select("*")
    .eq("user_id", user.id)
    .in("status", ["owned", "playing", "completed"])
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error loading library:", error);
  }

  const allGames = (data as UserGame[]) || [];

  const displayedGames =
    currentFilter === "all"
      ? allGames
      : allGames.filter((g) => g.status === currentFilter);

  const stats = {
    all: allGames.length,
    playing: allGames.filter((g) => g.status === "playing").length,
    completed: allGames.filter((g) => g.status === "completed").length,
    owned: allGames.filter((g) => g.status === "owned").length,
  };

  const tabs: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.all },
    { id: "playing", label: "Playing", count: stats.playing },
    { id: "completed", label: "Completed", count: stats.completed },
    { id: "owned", label: "Owned", count: stats.owned },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-900">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Library</h1>
          <p className="text-neutral-500 text-xs mt-0.5">{stats.all} games saved</p>
        </div>

        <Link
          href="/search"
          className="text-xs px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition"
        >
          + Add games
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/library${tab.id === "all" ? "" : `?filter=${tab.id}`}`}
              className={`px-3 py-1 rounded-md text-xs transition ${
                isActive
                  ? "bg-neutral-800 text-white font-medium"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>{tab.label}</span>{" "}
              <span className="text-[11px] font-mono text-neutral-500">
                ({tab.count})
              </span>
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      {displayedGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedGames.map((game) => (
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
          No games in this section.{" "}
          <Link href="/search" className="text-neutral-300 underline underline-offset-4">
            Search games to add
          </Link>
        </div>
      )}
    </div>
  );
}
