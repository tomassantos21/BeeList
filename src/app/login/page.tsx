"use client";

import { useActionState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

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
    <div className="w-full max-w-sm bg-neutral-900/40 border border-neutral-800 rounded-xl p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-white">Sign in</h1>
        <p className="text-neutral-400 text-xs mt-1">Access your BeeList game collection</p>
      </div>

      {displayError && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {displayError}
        </div>
      )}

      <form action={formAction} className="space-y-3.5">
        <input type="hidden" name="next" value={next} />

        <div>
          <label className="block text-xs text-neutral-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-400 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-neutral-600 transition"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-2 px-3 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
          <span>Sign In</span>
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-neutral-500">
        Need an account?{" "}
        <Link href="/signup" className="text-neutral-300 hover:text-white underline underline-offset-4">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-8">
      <Suspense fallback={<div className="text-neutral-500 text-xs">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
