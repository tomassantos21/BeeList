"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

export function SearchInput({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSearch = (searchTerm: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm.trim()) {
        params.set("q", searchTerm.trim());
      } else {
        params.delete("q");
      }
      router.replace(`/search?${params.toString()}`);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 pointer-events-none text-neutral-400">
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Search games (e.g. Witcher 3, Elden Ring, Hollow Knight)..."
          className="w-full pl-12 pr-24 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-base focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-xl transition"
        />
        <div className="absolute right-3 flex items-center gap-1.5">
          {value && (
            <button
              type="button"
              onClick={() => {
                setValue("");
                handleSearch("");
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 font-medium text-xs text-white transition shadow"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
