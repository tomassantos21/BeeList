"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { GameStatus, UserGame } from "@/types/database";

export async function addOrUpdateGame(
  gameId: number,
  gameTitle: string,
  coverUrl: string | null,
  status: GameStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to add games." };
  }

  const { error } = await supabase.from("user_games").upsert(
    {
      user_id: user.id,
      game_id: gameId,
      game_title: gameTitle,
      cover_url: coverUrl,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,game_id" }
  );

  if (error) {
    console.error("Failed to add or update game:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/library");
  revalidatePath("/wishlist");
  revalidatePath("/search");
  return { success: true };
}

export async function updateGameStatus(
  gameId: number,
  status: GameStatus
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("user_games")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .eq("game_id", gameId);

  if (error) {
    console.error("Failed to update game status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/library");
  revalidatePath("/wishlist");
  revalidatePath("/search");
  return { success: true };
}

export async function removeGame(
  gameId: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("user_games")
    .delete()
    .eq("user_id", user.id)
    .eq("game_id", gameId);

  if (error) {
    console.error("Failed to remove game:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/library");
  revalidatePath("/wishlist");
  revalidatePath("/search");
  return { success: true };
}

export async function getUserGames(): Promise<UserGame[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("user_games")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching user games:", error);
    return [];
  }

  return (data as UserGame[]) || [];
}
