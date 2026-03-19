"use server";

import { cookies } from "next/headers";
import { genres } from "@/lib/genres";
import { incrementVote, getAllVotes } from "@/lib/kv";
import type { Results } from "@/lib/genres";

const COOKIE_NAME = "smn_voted";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function submitVote(
  genreId: string
): Promise<{ success: boolean; error?: string }> {
  // Validate the genre exists
  if (!genres.find((g) => g.id === genreId)) {
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

export async function getResults(): Promise<Results> {
  return getAllVotes();
}
