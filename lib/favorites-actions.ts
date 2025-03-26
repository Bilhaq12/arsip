"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { getCurrentUser } from "./auth-actions"

// Create a Supabase client for server-side operations
const getSupabaseForUser = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookies().set(name, value, options)
      },
      remove(name: string, options: any) {
        cookies().set(name, "", { ...options, maxAge: 0 })
      },
    },
  })
}

export async function toggleAnimeFavorite(animeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to add favorites" }
  }

  const supabase = getSupabaseForUser()

  // Check if already favorited
  const { data: existingFavorite } = await supabase
    .from("user_anime_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("anime_id", animeId)
    .single()

  if (existingFavorite) {
    // Remove from favorites
    const { error } = await supabase.from("user_anime_favorites").delete().eq("id", existingFavorite.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true, action: "removed" }
  } else {
    // Add to favorites
    const { error } = await supabase.from("user_anime_favorites").insert({
      user_id: user.id,
      anime_id: animeId,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, action: "added" }
  }
}

export async function toggleMangaFavorite(mangaId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to add favorites" }
  }

  const supabase = getSupabaseForUser()

  // Check if already favorited
  const { data: existingFavorite } = await supabase
    .from("user_manga_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("manga_id", mangaId)
    .single()

  if (existingFavorite) {
    // Remove from favorites
    const { error } = await supabase.from("user_manga_favorites").delete().eq("id", existingFavorite.id)

    if (error) {
      return { error: error.message }
    }

    return { success: true, action: "removed" }
  } else {
    // Add to favorites
    const { error } = await supabase.from("user_manga_favorites").insert({
      user_id: user.id,
      manga_id: mangaId,
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true, action: "added" }
  }
}

export async function getUserAnimeFavorites() {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view favorites" }
  }

  const supabase = getSupabaseForUser()

  const { data, error } = await supabase
    .from("user_anime_favorites")
    .select(`
      id,
      anime_id,
      created_at,
      anime:anime_id (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function getUserMangaFavorites() {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view favorites" }
  }

  const supabase = getSupabaseForUser()

  const { data, error } = await supabase
    .from("user_manga_favorites")
    .select(`
      id,
      manga_id,
      created_at,
      manga:manga_id (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function isAnimeFavorited(animeId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { favorited: false }
  }

  const supabase = getSupabaseForUser()

  const { data, error } = await supabase
    .from("user_anime_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("anime_id", animeId)
    .single()

  if (error || !data) {
    return { favorited: false }
  }

  return { favorited: true }
}

export async function isMangaFavorited(mangaId: number) {
  const user = await getCurrentUser()

  if (!user) {
    return { favorited: false }
  }

  const supabase = getSupabaseForUser()

  const { data, error } = await supabase
    .from("user_manga_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("manga_id", mangaId)
    .single()

  if (error || !data) {
    return { favorited: false }
  }

  return { favorited: true }
}

