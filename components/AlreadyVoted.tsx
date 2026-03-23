"use client";

import { useState } from "react";
import Link from "next/link";
import { type Genre } from "@/lib/genres";
import GenreCard from "./GenreCard";
import { changeVote } from "@/app/actions";

type State = "idle" | "loading" | "success" | "error";

export default function AlreadyVoted({
  genres,
  currentVoteId,
}: {
  genres: Genre[];
  currentVoteId: string | null;
}) {
  const [changing, setChanging]   = useState(false);
  const [selected, setSelected]   = useState<string | null>(null);
  const [state, setState]         = useState<State>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  async function handleChange() {
    if (!selected) return;
    setState("loading");
    setErrorMsg("");
    const result = await changeVote(selected);
    if (result.success) {
      setState("success");
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setState("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  }

  if (changing) {
    const isActive = !!selected && state === "idle";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "3px", marginBottom: "0.5rem" }}>
            Change Your Vote
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Pick a new genre — your old vote will be removed.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.4rem",
        }}>
          {genres.map((genre) => (
            <GenreCard
              key={genre.id}
              genre={genre}
              selected={selected === genre.id}
              onSelect={setSelected}
              disabled={state === "loading" || state === "success" || genre.id === currentVoteId}
            />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={handleChange}
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
              {state === "success" ? "✓ Vote Updated!" : "🗳️ Save New Vote"}
            </span>
          </button>

          {errorMsg && <p style={{ color: "#FF6B6B", fontSize: "0.85rem" }}>{errorMsg}</p>}

          <button
            onClick={() => { setChanging(false); setSelected(null); setState("idle"); setErrorMsg(""); }}
            style={{
              background: "none", border: "none", color: "var(--muted)",
              fontSize: "0.8rem", cursor: "pointer", letterSpacing: "1px",
            }}
          >
            ← Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2.5rem", padding: "2rem 1rem" }}>

      {/* Ticket with glow */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          position: "absolute", width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,215,0,0.08)", animation: "pulse-ring 2.5s ease infinite",
        }} />
        <div style={{ fontSize: "9rem", lineHeight: 1, filter: "drop-shadow(0 0 32px rgba(255,215,0,0.45))", animation: "wb-float 3s ease-in-out infinite" }}>
          🎟️
        </div>
      </div>

      {/* Message */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <h2 style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "3rem", letterSpacing: "4px", color: "#fff" }}>
          Your Vote Is Cast.
        </h2>
        <p style={{ color: "var(--muted)", maxWidth: 340, margin: "0 auto", lineHeight: 1.7 }}>
          The crowd has spoken — but the verdict stays hidden. The genre will be revealed when the lights go down.
        </p>
      </div>

      <Link href="/results" style={{
        padding: "0.75rem 2rem",
        borderRadius: "50px",
        border: "1px solid rgba(255,255,255,0.15)",
        color: "var(--muted)",
        fontSize: "0.85rem",
        textDecoration: "none",
        letterSpacing: "1px",
      }}>
        Peek at the votes →
      </Link>

      <button
        onClick={() => setChanging(true)}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.78rem",
          cursor: "pointer",
          letterSpacing: "1px",
          textDecoration: "underline",
          textUnderlineOffset: "3px",
          marginTop: "-1rem",
        }}
      >
        Change my vote
      </button>
    </div>
  );
}
