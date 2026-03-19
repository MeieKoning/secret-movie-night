"use client";

import { useEffect, useState, useTransition } from "react";
import { getResults } from "@/app/actions";
import type { Results } from "@/lib/genres";

const colorMap: Record<string, string> = {
  amber:  "#FFD700",
  red:    "#FF6B6B",
  violet: "#B39DDB",
  orange: "#FF6B35",
  yellow: "#FFD93D",
  rose:   "#FF79C6",
};

export default function ResultsChart({ initial }: { initial: Results }) {
  const [results, setResults]   = useState<Results>(initial);
  const [, startTransition]     = useTransition();
  const [lastRefresh, setLast]  = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(async () => {
        const fresh = await getResults();
        setResults(fresh);
        setLast(new Date());
      });
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  if (results.total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎬</div>
        <div style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.8rem", letterSpacing: "3px", color: "var(--gold)", marginBottom: "0.4rem" }}>
          No votes yet — be first!
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Every great movie night starts with a single vote.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {results.genres.map((g) => {
        const isLeader = g.id === results.leaderId;
        const color    = colorMap[g.accentColor] ?? "#FFD700";
        return (
          <div key={g.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span>{g.emoji}</span>
                <span style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  fontSize: "1.3rem",
                  letterSpacing: "1.5px",
                  color: isLeader ? color : "#fff",
                }}>
                  {g.label}
                </span>
                {isLeader && (
                  <span style={{
                    background: "var(--gold)", color: "#000",
                    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "1.5px",
                    textTransform: "uppercase", padding: "0.2rem 0.55rem",
                    borderRadius: "100px",
                  }}>
                    👑 Leading
                  </span>
                )}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                {g.votes} {g.votes === 1 ? "vote" : "votes"} · {g.percentage}%
              </span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                background: color,
                width: `${g.percentage}%`,
                opacity: isLeader ? 1 : 0.4,
                transition: "width 0.7s cubic-bezier(0.34,1.56,0.64,1)",
              }} />
            </div>
          </div>
        );
      })}

      <div style={{
        display: "flex", justifyContent: "space-between",
        fontSize: "0.72rem", color: "rgba(255,255,255,0.25)",
        paddingTop: "1rem", borderTop: "1px solid #1C1C2E",
        fontVariantNumeric: "tabular-nums",
      }}>
        <span>{results.total} total {results.total === 1 ? "vote" : "votes"}</span>
        <span>Refreshes every 30s · {lastRefresh.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
