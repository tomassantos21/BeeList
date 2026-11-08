"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/auth/actions";
import { LogIn, Sparkles, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/library";
  const urlError = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) => {
      return await login(formData);
    },
    null
  );

  const displayError = state?.error || urlError;

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 mb-4 ring-1 ring-violet-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
        <p className="text-neutral-400 text-sm mt-1">Sign in to manage your game library and wishlist</p>
      </div>

      {displayError && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{displayError}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700/80 text-white placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/60 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.99] font-medium text-white text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-violet-600/20"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-violet-400 hover:text-violet-300 font-medium underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-neutral-400 text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
