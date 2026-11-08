"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-neutral-400 text-sm mb-6">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-sm text-white transition shadow-lg shadow-violet-600/20"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
