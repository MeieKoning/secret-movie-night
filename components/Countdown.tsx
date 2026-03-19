"use client";

import { useEffect, useState } from "react";

function getNextFriday8pm(): Date {
  const now = new Date();
  const next = new Date(now);

  // Days until Friday (5). If today is Friday, check if 8pm hasn't passed yet.
  const day = now.getDay(); // 0=Sun, 5=Fri
  let daysUntilFriday = (5 - day + 7) % 7;

  // If it's already Friday but past 8pm, push to next week
  if (daysUntilFriday === 0 && now.getHours() >= 20) {
    daysUntilFriday = 7;
  }

  next.setDate(now.getDate() + daysUntilFriday);
  next.setHours(20, 0, 0, 0);
  return next;
}

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
        <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [target] = useState(getNextFriday8pm);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(target));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!mounted) return null;

  const isToday = target.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-500">
        {isToday ? "Tonight" : "Next Friday"} · 8:00 PM
      </p>
      <div className="flex items-start gap-3">
        <Unit value={timeLeft.days} label="days" />
        <span className="text-white/20 text-2xl font-mono mt-4">:</span>
        <Unit value={timeLeft.hours} label="hrs" />
        <span className="text-white/20 text-2xl font-mono mt-4">:</span>
        <Unit value={timeLeft.minutes} label="min" />
        <span className="text-white/20 text-2xl font-mono mt-4">:</span>
        <Unit value={timeLeft.seconds} label="sec" />
      </div>
    </div>
  );
}
