"use client";

import { useEffect, useState } from "react";

function getNextFriday8pm(): Date {
  const now  = new Date();
  const next = new Date(now);
  const day  = now.getDay();
  let daysUntilFriday = (5 - day + 7) % 7;
  if (daysUntilFriday === 0 && now.getHours() >= 20) daysUntilFriday = 7;
  next.setDate(now.getDate() + daysUntilFriday);
  next.setHours(20, 0, 0, 0);
  return next;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

// ── Compact (nav bar) ────────────────────────────────
function CompactCountdown() {
  const [target]   = useState(getNextFriday8pm);
  const [tl, setTl] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTl(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) return <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "2px", color: "var(--gold)" }}>--:--:--</span>;

  const { days, hours, minutes, seconds } = tl;
  const text = days > 0
    ? `${days}d ${pad(hours)}h ${pad(minutes)}m`
    : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "1.3rem", letterSpacing: "2px", color: "var(--gold)" }}>
      {text}
    </span>
  );
}

// ── Full (already-voted page) ────────────────────────
function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
      <div style={{
        width: 72, height: 72,
        borderRadius: 12,
        background: "#0E0E1C",
        border: "1px solid #1C1C2E",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-bebas), sans-serif", fontSize: "2rem", letterSpacing: "2px", color: "#FFD700" }}>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "3px", color: "var(--muted)" }}>{label}</span>
    </div>
  );
}

function FullCountdown() {
  const [target]   = useState(getNextFriday8pm);
  const [tl, setTl] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTl(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const isToday = target.toDateString() === new Date().toDateString();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)" }}>
        {isToday ? "Tonight" : "Next Friday"} · 8:00 PM
      </p>
      {mounted ? (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
          <Unit value={tl.days}    label="days" />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.8rem", fontFamily: "var(--font-bebas)", marginTop: "0.75rem" }}>:</span>
          <Unit value={tl.hours}   label="hrs" />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.8rem", fontFamily: "var(--font-bebas)", marginTop: "0.75rem" }}>:</span>
          <Unit value={tl.minutes} label="min" />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1.8rem", fontFamily: "var(--font-bebas)", marginTop: "0.75rem" }}>:</span>
          <Unit value={tl.seconds} label="sec" />
        </div>
      ) : (
        <div style={{ height: 72 }} />
      )}
    </div>
  );
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  return compact ? <CompactCountdown /> : <FullCountdown />;
}
