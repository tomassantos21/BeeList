import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Gamepad2, Library, Bookmark, Search, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default async function HomePage() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Supabase credentials might not be configured yet
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Your Ultimate Gaming Backlog</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Track Every Game You{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400">
            Play, Own & Desire
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto font-normal">
          Build your personal video game collection, categorize progress from backlog to completion, and discover new titles from over 800,000 games.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-white text-base shadow-xl shadow-violet-600/25 transition active:scale-[0.99]"
          >
            <Search className="w-5 h-5" />
            <span>Search & Discover Games</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          {user ? (
            <Link
              href="/library"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-semibold text-neutral-200 text-base transition"
            >
              <Library className="w-5 h-5 text-neutral-400" />
              <span>Go to My Library</span>
            </Link>
          ) : (
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-semibold text-neutral-200 text-base transition"
            >
              <Gamepad2 className="w-5 h-5 text-neutral-400" />
              <span>Create Free Account</span>
            </Link>
          )}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
              <Library className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Backlog Organization</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Tag your titles by status: Currently Playing, Completed, or Owned backlog. Never lose track of your progress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Wishlist</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Curate games you plan to buy or play next. Seamlessly move titles from Wishlist to Library with one click.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">High Performance</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Built on Next.js App Router, Supabase PostgreSQL with Row Level Security, and RAWG database for instantaneous search.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
