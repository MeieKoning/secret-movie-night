"use client";

import { type Genre } from "@/lib/genres";

type Props = {
  genre: Genre;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

const accentMap: Record<string, string> = {
  amber: "border-amber-500 shadow-amber-500/30 text-amber-400",
  red: "border-red-600 shadow-red-600/30 text-red-400",
  violet: "border-violet-500 shadow-violet-500/30 text-violet-400",
  orange: "border-orange-500 shadow-orange-500/30 text-orange-400",
  yellow: "border-yellow-400 shadow-yellow-400/30 text-yellow-300",
  rose: "border-rose-500 shadow-rose-500/30 text-rose-400",
};

const accentBg: Record<string, string> = {
  amber: "bg-amber-950/40",
  red: "bg-red-950/40",
  violet: "bg-violet-950/40",
  orange: "bg-orange-950/40",
  yellow: "bg-yellow-950/40",
  rose: "bg-rose-950/40",
};

export default function GenreCard({ genre, selected, onSelect, disabled }: Props) {
  const accent = accentMap[genre.accentColor] ?? accentMap.amber;
  const bg = accentBg[genre.accentColor] ?? accentBg.amber;

  return (
    <button
      onClick={() => onSelect(genre.id)}
      disabled={disabled}
      className={`
        group relative w-full h-full text-left rounded-xl border p-5 transition-all duration-300
        cursor-pointer select-none
        ${selected
          ? `${accent} ${bg} shadow-lg border-opacity-100 scale-[1.02]`
          : "border-white/10 bg-white/3 hover:border-white/25 hover:bg-white/5 text-neutral-400"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      {selected && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-current animate-pulse" />
      )}
      <div className="text-3xl mb-3">{genre.emoji}</div>
      <h3 className={`font-semibold text-base mb-1 transition-colors duration-200 ${selected ? "text-white" : "text-neutral-200 group-hover:text-white"}`}>
        {genre.label}
      </h3>
      <p className="text-sm leading-relaxed opacity-70">{genre.description}</p>
    </button>
  );
}
