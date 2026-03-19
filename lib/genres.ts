export type Genre = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  accentColor: string; // tailwind border/glow color
};

export const genres: Genre[] = [
  {
    id: "thriller",
    label: "Thriller & Mystery",
    emoji: "🔍",
    description: "Something lurks beneath the surface. Trust no one.",
    accentColor: "amber",
  },
  {
    id: "horror",
    label: "Horror",
    emoji: "👁️",
    description: "Lights off. Volume up. Regret it immediately.",
    accentColor: "red",
  },
  {
    id: "scifi",
    label: "Sci-Fi & Fantasy",
    emoji: "🌌",
    description: "Other worlds. Other rules. No way back.",
    accentColor: "violet",
  },
  {
    id: "action",
    label: "Action & Adventure",
    emoji: "⚡",
    description: "High stakes. No plan. No problem.",
    accentColor: "orange",
  },
  {
    id: "comedy",
    label: "Comedy",
    emoji: "🎭",
    description: "Laugh until it hurts. Then laugh again.",
    accentColor: "yellow",
  },
  {
    id: "romance",
    label: "Romance",
    emoji: "🥀",
    description: "Yearning. Longing. Inevitable.",
    accentColor: "rose",
  },
  {
    id: "animation",
    label: "Animation",
    emoji: "✨",
    description: "Anything is possible. Physics optional.",
    accentColor: "teal",
  },
  {
    id: "drama",
    label: "Drama",
    emoji: "🎭",
    description: "Real emotions. Raw stories. No escape.",
    accentColor: "blue",
  },
];

export type Results = {
  genres: Array<{
    id: string;
    label: string;
    emoji: string;
    votes: number;
    percentage: number;
    accentColor: string;
  }>;
  total: number;
  leaderId: string | null;
};
