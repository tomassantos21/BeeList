"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { UserPlus, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: { error?: string; success?: boolean; message?: string } | null, formData: FormData) => {
      return await signup(formData);
    },
    null
  );

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-600/20 text-violet-400 mb-4 ring-1 ring-violet-500/30">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
        <p className="text-neutral-400 text-sm mt-1">Start tracking your gaming backlog and wishlist</p>
      </div>

      {state?.error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4">
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
            Password (at least 6 characters)
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-neutral-400">
        Already have an account?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium underline-offset-4 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-neutral-400 text-sm">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
