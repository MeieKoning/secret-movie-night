import { genres, type Results } from "./genres";

// In-memory fallback for local development (resets on server restart)
const localStore = new Map<string, number>();

function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function incr(key: string): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.incr(key);
  } else {
    localStore.set(key, (localStore.get(key) ?? 0) + 1);
  }
}

async function mget(keys: string[]): Promise<number[]> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    const counts = await kv.mget<number[]>(...keys);
    return counts.map((c) => c ?? 0);
  } else {
    return keys.map((k) => localStore.get(k) ?? 0);
  }
}

export async function incrementVote(genreId: string): Promise<void> {
  await incr(`votes:${genreId}`);
}

export async function getAllVotes(): Promise<Results> {
  const keys = genres.map((g) => `votes:${g.id}`);
  const counts = await mget(keys);

  const total = counts.reduce((sum, c) => sum + c, 0);

  const ranked = genres
    .map((g, i) => ({
      id: g.id,
      label: g.label,
      emoji: g.emoji,
      accentColor: g.accentColor,
      votes: counts[i],
      percentage: total > 0 ? Math.round((counts[i] / total) * 100) : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    genres: ranked,
    total,
    leaderId: ranked[0]?.votes > 0 ? ranked[0].id : null,
  };
}
