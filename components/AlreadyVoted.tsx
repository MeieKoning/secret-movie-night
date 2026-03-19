import Link from "next/link";
import Countdown from "./Countdown";

export default function AlreadyVoted() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-10 text-center">

      {/* Big ticket */}
      <div className="relative flex items-center justify-center">
        {/* Glow rings */}
        <div className="absolute w-48 h-48 rounded-full bg-amber-500/10 animate-ping" style={{ animationDuration: "2.5s" }} />
        <div className="absolute w-36 h-36 rounded-full bg-amber-500/15" />
        <div className="text-[9rem] leading-none select-none" style={{ filter: "drop-shadow(0 0 32px rgba(245,158,11,0.5))" }}>
          🎟️
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3 animate-fade-in-up">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          You&apos;re in.
        </h2>
        <p className="text-neutral-400 max-w-xs mx-auto leading-relaxed">
          Your vote is sealed in the envelope. The genre will be revealed when the lights go down.
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="h-px flex-1 bg-neutral-800" />
        <span className="text-neutral-700 text-xs font-mono tracking-widest">UNTIL SHOWTIME</span>
        <div className="h-px flex-1 bg-neutral-800" />
      </div>

      {/* Countdown */}
      <Countdown />

      {/* Results link */}
      <Link
        href="/results"
        className="mt-2 px-6 py-2.5 rounded-full border border-white/15 text-sm text-neutral-400 hover:border-white/40 hover:text-white transition-all duration-200 tracking-wide"
      >
        Peek at the votes →
      </Link>
    </div>
  );
}
