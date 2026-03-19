import { kv } from "@vercel/kv";
import { genres, type Results } from "./genres";

export async function incrementVote(genreId: string): Promise<void> {
  await kv.incr(`votes:${genreId}`);
}

export async function getAllVotes(): Promise<Results> {
  const keys = genres.map((g) => `votes:${g.id}`);
  const counts = await kv.mget<number[]>(...keys);

  const total = counts.reduce((sum, c) => sum + (c ?? 0), 0);

  const ranked = genres
    .map((g, i) => ({
      id: g.id,
      label: g.label,
      emoji: g.emoji,
      accentColor: g.accentColor,
      votes: counts[i] ?? 0,
      percentage: total > 0 ? Math.round(((counts[i] ?? 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    genres: ranked,
    total,
    leaderId: ranked[0]?.votes > 0 ? ranked[0].id : null,
  };
}
