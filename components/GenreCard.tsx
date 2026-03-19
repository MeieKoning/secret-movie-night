"use client";

import { type Genre } from "@/lib/genres";

type Props = {
  genre: Genre;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

// Map our accent names to hex colors matching the reference palette
const colorMap: Record<string, string> = {
  amber:  "#FFD700",
  red:    "#FF6B6B",
  violet: "#B39DDB",
  orange: "#FF6B35",
  yellow: "#FFD93D",
  rose:   "#FF79C6",
};

export default function GenreCard({ genre, selected, onSelect, disabled }: Props) {
  const color = colorMap[genre.accentColor] ?? "#FFD700";

  return (
    <button
      onClick={() => onSelect(genre.id)}
      disabled={disabled}
      style={{
        width: "100%",
        height: "100%",
        textAlign: "left",
        background: "#0E0E1C",
        border: `1px solid ${selected ? color : "#1C1C2E"}`,
        borderRadius: 18,
        padding: "1.5rem 1.3rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "transform 0.25s, border-color 0.25s, box-shadow 0.25s",
        position: "relative",
        overflow: "hidden",
        opacity: disabled && !selected ? 0.5 : 1,
        boxShadow: selected ? `0 0 0 1px ${color}44, 0 20px 50px rgba(0,0,0,0.5)` : undefined,
        transform: selected ? "scale(1.02)" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = selected ? color : `${color}88`;
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 20px 50px rgba(0,0,0,0.5)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = selected ? "scale(1.02)" : "";
        (e.currentTarget as HTMLButtonElement).style.borderColor = selected ? color : "#1C1C2E";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = selected ? `0 0 0 1px ${color}44, 0 20px 50px rgba(0,0,0,0.5)` : "";
      }}
    >
      {/* Radial glow on selected */}
      {selected && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at 50% -20%, ${color}20, transparent 65%)`,
          pointerEvents: "none",
        }} />
      )}

      {/* Selected dot */}
      {selected && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          width: 8, height: 8,
          borderRadius: "50%",
          background: color,
          animation: "blink 1.2s ease infinite",
          display: "inline-block",
        }} />
      )}

      <div style={{ fontSize: "2.4rem", marginBottom: "0.6rem" }}>{genre.emoji}</div>
      <div style={{
        fontFamily: "var(--font-bebas), sans-serif",
        fontSize: "1.5rem",
        letterSpacing: "2px",
        color: selected ? color : "#fff",
        marginBottom: "0.3rem",
        transition: "color 0.2s",
      }}>
        {genre.label}
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5 }}>
        {genre.description}
      </div>
    </button>
  );
}
