import { genres as defaultGenres, type Genre, type Results } from "./genres";

// ── Local in-memory fallback for dev (no KV credentials) ──────────────────
const localVotes  = new Map<string, number>();
let   localGenres: Genre[] | null = null;

function isKvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// ── Genre config ───────────────────────────────────────────────────────────

export async function getGenresConfig(): Promise<Genre[]> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    const stored = await kv.get<Genre[]>("genres:config");
    return stored ?? defaultGenres;
  }
  return localGenres ?? defaultGenres;
}

export async function setGenresConfig(genres: Genre[]): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.set("genres:config", genres);
  } else {
    localGenres = genres;
  }
}

// ── Votes ──────────────────────────────────────────────────────────────────

export async function decrementVote(genreId: string): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    const current = await kv.get<number>(`votes:${genreId}`) ?? 0;
    await kv.set(`votes:${genreId}`, Math.max(0, current - 1));
  } else {
    localVotes.set(genreId, Math.max(0, (localVotes.get(genreId) ?? 0) - 1));
  }
}

export async function incrementVote(genreId: string): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.incr(`votes:${genreId}`);
  } else {
    localVotes.set(genreId, (localVotes.get(genreId) ?? 0) + 1);
  }
}

export async function setVoteCount(genreId: string, count: number): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(`votes:${genreId}`, count);
  } else {
    localVotes.set(genreId, count);
  }
}

export async function resetAllVotes(genreIds: string[]): Promise<void> {
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await Promise.all(genreIds.map((id) => kv.set(`votes:${id}`, 0)));
  } else {
    genreIds.forEach((id) => localVotes.set(id, 0));
  }
}

async function getVoteCounts(genres: Genre[]): Promise<number[]> {
  const keys = genres.map((g) => `votes:${g.id}`);
  if (isKvConfigured()) {
    const { kv } = await import("@vercel/kv");
    const counts = await kv.mget<number[]>(...keys);
    return counts.map((c) => c ?? 0);
  }
  return keys.map((k) => localVotes.get(k.replace("votes:", "")) ?? 0);
}

export async function getAllVotes(): Promise<Results> {
  const genres = await getGenresConfig();
  const counts = await getVoteCounts(genres);
  const total  = counts.reduce((sum, c) => sum + c, 0);

  const ranked = genres
    .map((g, i) => ({
      id:          g.id,
      label:       g.label,
      emoji:       g.emoji,
      accentColor: g.accentColor,
      votes:       counts[i],
      percentage:  total > 0 ? Math.round((counts[i] / total) * 100) : 0,
    }))
    .sort((a, b) => b.votes - a.votes);

  return {
    genres: ranked,
    total,
    leaderId: ranked[0]?.votes > 0 ? ranked[0].id : null,
  };
}

export async function getRawVotes(): Promise<Record<string, number>> {
  const genres = await getGenresConfig();
  const counts = await getVoteCounts(genres);
  return Object.fromEntries(genres.map((g, i) => [g.id, counts[i]]));
}
