"use client";

import { useState } from "react";
import { genres } from "@/lib/genres";
import GenreCard from "./GenreCard";
import { submitVote } from "@/app/actions";

type State = "idle" | "loading" | "success" | "error";

export default function VoteForm() {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit() {
    if (!selected) return;
    setState("loading");
    setErrorMsg("");

    const result = await submitVote(selected);

    if (result.success) {
      setState("success");
      // Reload after brief pause so the server re-renders the already-voted view
      setTimeout(() => window.location.reload(), 1200);
    } else {
      setState("error");
      setErrorMsg(result.error ?? "Something went wrong.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre, i) => (
          <div key={genre.id} className={`animate-fade-in-up stagger-${i + 1}`}>
            <GenreCard
              genre={genre}
              selected={selected === genre.id}
              onSelect={setSelected}
              disabled={state === "loading" || state === "success"}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!selected || state === "loading" || state === "success"}
          className={`
            relative px-10 py-3.5 rounded-full font-semibold text-sm tracking-widest uppercase
            transition-all duration-300
            ${selected && state === "idle"
              ? "bg-white text-black hover:bg-neutral-200 hover:scale-105 shadow-lg shadow-white/10"
              : "bg-white/10 text-white/30 cursor-not-allowed"
            }
          `}
        >
          {state === "loading" && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </span>
          )}
          <span className={state === "loading" ? "invisible" : ""}>
            {state === "success" ? "Vote Cast ✓" : "Cast My Vote"}
          </span>
        </button>

        {errorMsg && (
          <p className="text-red-400 text-sm text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
