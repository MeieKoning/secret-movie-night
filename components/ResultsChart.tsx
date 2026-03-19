"use client";

import { useEffect, useState, useTransition } from "react";
import { getResults } from "@/app/actions";
import type { Results } from "@/lib/genres";

const barColor: Record<string, string> = {
  amber: "bg-amber-500",
  red: "bg-red-600",
  violet: "bg-violet-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  rose: "bg-rose-500",
};

const textColor: Record<string, string> = {
  amber: "text-amber-400",
  red: "text-red-400",
  violet: "text-violet-400",
  orange: "text-orange-400",
  yellow: "text-yellow-300",
  rose: "text-rose-400",
};

type Props = {
  initial: Results;
};

export default function ResultsChart({ initial }: Props) {
  const [results, setResults] = useState<Results>(initial);
  const [, startTransition] = useTransition();
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(async () => {
        const fresh = await getResults();
        setResults(fresh);
        setLastRefresh(new Date());
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {results.total === 0 ? (
        <p className="text-center text-neutral-500 py-12 font-mono text-sm">
          No votes cast yet. Be the first.
        </p>
      ) : (
        <div className="space-y-4">
          {results.genres.map((g) => {
            const isLeader = g.id === results.leaderId;
            const bar = barColor[g.accentColor] ?? barColor.amber;
            const text = textColor[g.accentColor] ?? textColor.amber;
            return (
              <div key={g.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{g.emoji}</span>
                    <span className={isLeader ? "text-white font-semibold" : "text-neutral-300"}>
                      {g.label}
                    </span>
                    {isLeader && (
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase border border-neutral-700 px-1.5 py-0.5 rounded">
                        Leading
                      </span>
                    )}
                  </div>
                  <span className={`font-mono text-xs ${isLeader ? text : "text-neutral-500"}`}>
                    {g.votes} {g.votes === 1 ? "vote" : "votes"} · {g.percentage}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${bar} ${isLeader ? "opacity-90" : "opacity-40"}`}
                    style={{ width: `${g.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between text-xs font-mono text-neutral-700 pt-4 border-t border-neutral-800/50">
        <span>{results.total} total {results.total === 1 ? "vote" : "votes"}</span>
        <span>Refreshes every 30s · {lastRefresh.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
