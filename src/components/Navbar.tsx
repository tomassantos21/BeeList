import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export async function Navbar() {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Unauthenticated fallback
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-white hover:opacity-90 transition">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-base tracking-tight">
              Bee<span className="text-neutral-400">List</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/search"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Search
            </Link>

            {user && (
              <>
                <Link
                  href="/library"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Library
                </Link>

                <Link
                  href="/wishlist"
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Wishlist
                </Link>
              </>
            )}
          </nav>

          {/* User state */}
          <div className="flex items-center gap-3 text-xs">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-neutral-500 font-mono">
                  {user.email}
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-neutral-400 hover:text-white px-2.5 py-1 rounded-md border border-neutral-800 hover:border-neutral-700 transition"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-neutral-400 hover:text-white px-2.5 py-1 transition"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1 rounded-md bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
