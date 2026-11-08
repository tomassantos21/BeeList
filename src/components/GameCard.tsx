"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { addOrUpdateGame, removeGame } from "@/app/actions/games";
import { GameStatus } from "@/types/database";
import {
  Bookmark,
  Gamepad2,
  Check,
  Trash2,
  Star,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface GameCardProps {
  id: number;
  title: string;
  coverUrl: string | null;
  releaseYear?: number | string | null;
  rating?: number | null;
  currentStatus?: GameStatus | null;
  userAuthenticated: boolean;
}

const statusOptions: { label: string; value: GameStatus; icon: typeof Gamepad2 }[] = [
  { label: "Wishlist", value: "wishlist", icon: Bookmark },
  { label: "Owned", value: "owned", icon: Gamepad2 },
  { label: "Playing", value: "playing", icon: Sparkles },
  { label: "Completed", value: "completed", icon: Check },
];

export function GameCard({
  id,
  title,
  coverUrl,
  releaseYear,
  rating,
  currentStatus: initialStatus,
  userAuthenticated,
}: GameCardProps) {
  const [status, setStatus] = useState<GameStatus | null | undefined>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStatusChange = (newStatus: GameStatus) => {
    if (!userAuthenticated) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setErrorMsg(null);
    const previousStatus = status;
    setStatus(newStatus);

    startTransition(async () => {
      const result = await addOrUpdateGame(id, title, coverUrl, newStatus);
      if (!result.success) {
        setStatus(previousStatus);
        setErrorMsg(result.error || "Failed to update status");
      }
    });
  };

  const handleRemove = () => {
    if (!userAuthenticated) return;
    setErrorMsg(null);
    const previousStatus = status;
    setStatus(null);

    startTransition(async () => {
      const result = await removeGame(id);
      if (!result.success) {
        setStatus(previousStatus);
        setErrorMsg(result.error || "Failed to remove game");
      }
    });
  };

  const statusBadgeColors: Record<GameStatus, string> = {
    wishlist: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    owned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    playing: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className="group relative bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col shadow-lg hover:shadow-2xl hover:shadow-violet-950/20">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full bg-neutral-950 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            unoptimized={coverUrl.startsWith("http") && !coverUrl.includes("rawg.io")}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 bg-neutral-900/50">
            <Gamepad2 className="w-12 h-12 stroke-[1.25]" />
            <span className="text-xs mt-2">No Image Available</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

        {/* Current Status Badge on Image */}
        {status && (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${statusBadgeColors[status]}`}
            >
              {status}
            </span>
          </div>
        )}

        {/* Rating Badge */}
        {rating && rating > 0 ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-neutral-950/80 border border-neutral-800 text-amber-400 text-xs font-medium backdrop-blur-md">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        ) : null}
      </div>

      {/* Game Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-violet-400 transition" title={title}>
            {title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
            {releaseYear && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {releaseYear}
              </span>
            )}
          </div>

          {errorMsg && (
            <p className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Actions Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          {/* Status Dropdown / Quick Selector */}
          <div className="relative flex-1">
            <select
              value={status || ""}
              disabled={isPending}
              onChange={(e) => {
                const val = e.target.value as GameStatus | "";
                if (val) handleStatusChange(val);
                else handleRemove();
              }}
              className="w-full text-xs bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 rounded-xl px-2.5 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none transition pr-7 disabled:opacity-50"
            >
              <option value="">+ Add to List...</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
              {isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
              ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              )}
            </div>
          </div>

          {/* Quick Remove Button if already in list */}
          {status && (
            <button
              onClick={handleRemove}
              disabled={isPending}
              title="Remove from list"
              className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/20 transition disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
