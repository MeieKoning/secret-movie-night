"use client";

import { useState } from "react";
import { genres } from "@/lib/genres";
import GenreCard from "./GenreCard";
import { submitVote } from "@/app/actions";

type State = "idle" | "loading" | "success" | "error";

export default function VoteForm() {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState]       = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (!selected) return;
    setState("loading");
    setErrorMsg("");
    const result = await submitVote(selected);
    if (result.success) {
      setState("success");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setState("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  }

  const isActive = !!selected && state === "idle";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1.4rem",
      }}>
        {genres.map((genre, i) => (
          <div key={genre.id} className={`animate-fade-in-up stagger-${i + 1}`} style={{ height: "100%" }}>
            <GenreCard
              genre={genre}
              selected={selected === genre.id}
              onSelect={setSelected}
              disabled={state === "loading" || state === "success"}
            />
          </div>
        ))}
      </div>

      {/* Submit */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <button
          onClick={handleSubmit}
          disabled={!isActive}
          style={{
            position: "relative",
            padding: "1rem 2.8rem",
            borderRadius: "50px",
            border: "none",
            fontWeight: 700,
            fontSize: "0.9rem",
            fontFamily: "var(--font-inter), sans-serif",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: isActive ? "pointer" : "not-allowed",
            transition: "transform 0.25s, box-shadow 0.25s, opacity 0.2s",
            background: isActive
              ? "linear-gradient(135deg, var(--red), #FF5252)"
              : "rgba(255,255,255,0.08)",
            color: isActive ? "#fff" : "rgba(255,255,255,0.3)",
          }}
          onMouseEnter={(e) => { if (isActive) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 16px 40px rgba(229,9,20,0.5)"; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = ""; }}
        >
          {state === "loading" && (
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg className="animate-spin" style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
          )}
          <span style={{ visibility: state === "loading" ? "hidden" : "visible" }}>
            {state === "success" ? "✓ Vote Cast!" : "🗳️ Cast My Vote"}
          </span>
        </button>

        {errorMsg && <p style={{ color: "#FF6B6B", fontSize: "0.85rem" }}>{errorMsg}</p>}
      </div>
    </div>
  );
}
