import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GameCard } from "@/components/GameCard";
import { GameStatus, UserGame } from "@/types/database";
import { Library, Plus, Sparkles, Check, Gamepad2, Search } from "lucide-react";

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

  // Filter games based on selected tab
  const displayedGames =
    currentFilter === "all"
      ? allGames
      : allGames.filter((g) => g.status === currentFilter);

  // Stats count
  const stats = {
    total: allGames.length,
    playing: allGames.filter((g) => g.status === "playing").length,
    completed: allGames.filter((g) => g.status === "completed").length,
    owned: allGames.filter((g) => g.status === "owned").length,
  };

  const tabs: { id: string; label: string; count: number; icon: typeof Library }[] = [
    { id: "all", label: "All Games", count: stats.total, icon: Library },
    { id: "playing", label: "Playing", count: stats.playing, icon: Sparkles },
    { id: "completed", label: "Completed", count: stats.completed, icon: Check },
    { id: "owned", label: "Owned", count: stats.owned, icon: Gamepad2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Library className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">My Game Library</h1>
          </div>
          <p className="text-neutral-400 text-sm mt-1">
            Organize, track, and showcase your video game collection.
          </p>
        </div>

        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-sm text-white transition shadow-lg shadow-violet-600/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add More Games</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-neutral-800">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          const TabIcon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={`/library${tab.id === "all" ? "" : `?filter=${tab.id}`}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                  : "bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                  isActive ? "bg-white/20 text-white" : "bg-neutral-800 text-neutral-300"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Games Grid or Empty State */}
      {displayedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div className="text-center py-20 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-8 max-w-lg mx-auto">
          <Gamepad2 className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">
            {currentFilter === "all"
              ? "Your library is empty"
              : `No games currently marked as "${currentFilter}"`}
          </h3>
          <p className="text-neutral-400 text-sm mb-6">
            Explore games in the catalog to add them to your library.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-sm text-white transition shadow-lg shadow-violet-600/20"
          >
            <Search className="w-4 h-4" />
            <span>Search Games</span>
          </Link>
        </div>
      )}
    </div>
  );
}
