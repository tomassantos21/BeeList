import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { Gamepad2, Library, Bookmark, Search, LogOut, LogIn } from "lucide-react";

export async function Navbar() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // If Supabase env is not yet set up, gracefully render unauthenticated navbar
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Game<span className="text-violet-500">Vault</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
            >
              <Search className="w-4 h-4 text-neutral-400" />
              <span>Search</span>
            </Link>

            {user && (
              <>
                <Link
                  href="/library"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                >
                  <Library className="w-4 h-4 text-neutral-400" />
                  <span>Library</span>
                </Link>

                <Link
                  href="/wishlist"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                >
                  <Bookmark className="w-4 h-4 text-neutral-400" />
                  <span>Wishlist</span>
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-neutral-400 truncate max-w-[160px]">
                  {user.email}
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
