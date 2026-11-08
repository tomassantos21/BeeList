import Link from "next/link";
import { Gamepad2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-neutral-900/60 border border-neutral-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-neutral-800 text-neutral-400 border border-neutral-700/60 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-7 h-7" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">404 Error</span>
        <h2 className="text-2xl font-bold text-white mt-1 mb-2">Game Level Not Found</h2>
        <p className="text-neutral-400 text-sm mb-6">
          The page or game you are looking for has been moved or doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-sm text-white transition shadow-lg shadow-violet-600/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
