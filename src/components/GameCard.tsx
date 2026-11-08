"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { addOrUpdateGame, removeGame } from "@/app/actions/games";
import { GameStatus } from "@/types/database";
import { Loader2, Trash2 } from "lucide-react";

interface GameCardProps {
  id: number;
  title: string;
  coverUrl: string | null;
  releaseYear?: number | string | null;
  rating?: number | null;
  currentStatus?: GameStatus | null;
  userAuthenticated: boolean;
}

const statusLabels: Record<GameStatus, string> = {
  wishlist: "Wishlist",
  owned: "Owned",
  playing: "Playing",
  completed: "Completed",
};

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

  const handleStatusChange = (newStatus: GameStatus) => {
    if (!userAuthenticated) {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const previousStatus = status;
    setStatus(newStatus);

    startTransition(async () => {
      const result = await addOrUpdateGame(id, title, coverUrl, newStatus);
      if (!result.success) {
        setStatus(previousStatus);
      }
    });
  };

  const handleRemove = () => {
    if (!userAuthenticated) return;
    const previousStatus = status;
    setStatus(null);

    startTransition(async () => {
      const result = await removeGame(id);
      if (!result.success) {
        setStatus(previousStatus);
      }
    });
  };

  return (
    <div className="group flex flex-col bg-neutral-900/30 border border-neutral-800/80 rounded-xl overflow-hidden hover:border-neutral-700 transition">
      {/* Cover */}
      <div className="relative aspect-[16/10] w-full bg-neutral-900 overflow-hidden">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
            unoptimized={coverUrl.startsWith("http") && !coverUrl.includes("rawg.io")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-600">
            No cover
          </div>
        )}

        {/* Minimal rating tag */}
        {rating && rating > 0 ? (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-neutral-950/80 text-[11px] font-mono text-neutral-300 border border-neutral-800 backdrop-blur-sm">
            ★ {rating.toFixed(1)}
          </div>
        ) : null}
      </div>

      {/* Details */}
      <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          <h3 className="font-medium text-sm text-neutral-200 line-clamp-1 group-hover:text-white transition" title={title}>
            {title}
          </h3>
          <span className="text-xs text-neutral-500 font-mono">
            {releaseYear || "TBA"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-900">
          <div className="relative flex-1">
            <select
              value={status || ""}
              disabled={isPending}
              onChange={(e) => {
                const val = e.target.value as GameStatus | "";
                if (val) handleStatusChange(val);
                else handleRemove();
              }}
              className="w-full text-xs bg-neutral-900 hover:bg-neutral-800/80 text-neutral-300 border border-neutral-800 rounded-lg px-2 py-1.5 cursor-pointer focus:outline-none focus:border-neutral-600 appearance-none transition pr-6 disabled:opacity-50"
            >
              <option value="">+ Add to list</option>
              <option value="wishlist">Wishlist</option>
              <option value="playing">Playing</option>
              <option value="completed">Completed</option>
              <option value="owned">Owned</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
              {isPending ? (
                <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
              ) : (
                <span className="text-[10px]">▼</span>
              )}
            </div>
          </div>

          {status && (
            <button
              onClick={handleRemove}
              disabled={isPending}
              title="Remove"
              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
