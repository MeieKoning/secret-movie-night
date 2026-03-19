"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Countdown from "./Countdown";

export default function Nav() {
  const clickCount = useRef(0);
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router     = useRouter();

  function handleLogoClick() {
    clickCount.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      router.push("/admin");
    }
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.25rem 2.5rem",
        borderBottom: "1px solid #1C1C2E",
        background: "rgba(7,7,15,0.9)",
        backdropFilter: "blur(14px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo — triple-click to open admin */}
      <div
        onClick={handleLogoClick}
        style={{
          fontFamily: "var(--font-bebas), sans-serif",
          fontSize: "1.7rem",
          letterSpacing: "4px",
          background: "linear-gradient(135deg, #FFD700, #FF6B35)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          userSelect: "none",
          cursor: "pointer",
        }}
      >
        🎬 Movie Night
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
        {/* Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            background: "rgba(229,9,20,0.15)",
            border: "1px solid rgba(229,9,20,0.4)",
            borderRadius: "100px",
            padding: "0.3rem 0.8rem",
            fontSize: "0.68rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#FF6B6B",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              background: "#FF6B6B",
              borderRadius: "50%",
              animation: "blink 1.2s ease infinite",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          Live Voting
        </div>

        {/* Countdown */}
        <div
          className="hidden sm:flex"
          style={{
            alignItems: "center",
            gap: "0.6rem",
            background: "#0E0E1C",
            border: "1px solid #1C1C2E",
            borderRadius: "10px",
            padding: "0.55rem 1.1rem",
          }}
        >
          <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "2px", color: "var(--muted)" }}>
            Next screening
          </span>
          <Countdown compact />
        </div>
      </div>
    </nav>
  );
}
