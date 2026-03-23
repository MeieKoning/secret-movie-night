"use server";

import { cookies } from "next/headers";
import { type Genre, type Results } from "@/lib/genres";
import {
  incrementVote,
  decrementVote,
  getAllVotes,
  getGenresConfig,
  setGenresConfig,
  setVoteCount,
  resetAllVotes,
  getRawVotes,
} from "@/lib/kv";

const COOKIE_NAME    = "smn_voted";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "movienight";
}

// ── Public actions ─────────────────────────────────────────────────────────

export async function submitVote(
  genreId: string
): Promise<{ success: boolean; error?: string }> {
  const activeGenres = await getGenresConfig();
  if (!activeGenres.find((g) => g.id === genreId)) {
    return { success: false, error: "Unknown genre." };
  }

  const cookieStore = await cookies();
  if (cookieStore.get(COOKIE_NAME)) {
    return { success: false, error: "You have already cast your vote." };
  }

  await incrementVote(genreId);

  cookieStore.set(COOKIE_NAME, genreId, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return { success: true };
}

export async function changeVote(
  newGenreId: string
): Promise<{ success: boolean; error?: string }> {
  const activeGenres = await getGenresConfig();
  if (!activeGenres.find((g) => g.id === newGenreId)) {
    return { success: false, error: "Unknown genre." };
  }

  const cookieStore = await cookies();
  const oldGenreId = cookieStore.get(COOKIE_NAME)?.value;
  if (!oldGenreId) {
    return { success: false, error: "No existing vote found." };
  }
  if (oldGenreId === newGenreId) {
    return { success: false, error: "That's already your vote." };
  }

  await decrementVote(oldGenreId);
  await incrementVote(newGenreId);

  cookieStore.set(COOKIE_NAME, newGenreId, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return { success: true };
}

export async function getResults(): Promise<Results> {
  return getAllVotes();
}

export async function getActiveGenres(): Promise<Genre[]> {
  return getGenresConfig();
}

// ── Admin actions ──────────────────────────────────────────────────────────

export async function verifyAdmin(
  password: string
): Promise<{ success: boolean }> {
  return { success: password === getAdminPassword() };
}

export async function adminGetData(
  password: string
): Promise<{ success: boolean; genres?: Genre[]; votes?: Record<string, number>; error?: string }> {
  if (password !== getAdminPassword()) return { success: false, error: "Wrong password." };
  const genres = await getGenresConfig();
  const votes  = await getRawVotes();
  return { success: true, genres, votes };
}

export async function adminSaveGenres(
  password: string,
  genres: Genre[]
): Promise<{ success: boolean; error?: string }> {
  if (password !== getAdminPassword()) return { success: false, error: "Wrong password." };
  if (!genres.length) return { success: false, error: "Need at least one genre." };
  await setGenresConfig(genres);
  return { success: true };
}

export async function adminSetVote(
  password: string,
  genreId: string,
  count: number
): Promise<{ success: boolean; error?: string }> {
  if (password !== getAdminPassword()) return { success: false, error: "Wrong password." };
  await setVoteCount(genreId, Math.max(0, count));
  return { success: true };
}

export async function adminResetVotes(
  password: string
): Promise<{ success: boolean; error?: string }> {
  if (password !== getAdminPassword()) return { success: false, error: "Wrong password." };
  const genres = await getGenresConfig();
  await resetAllVotes(genres.map((g) => g.id));
  return { success: true };
}
