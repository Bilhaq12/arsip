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

export async function updateProfile(profileData: {
  username: string
  avatar_url?: string
}) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to update your profile" }
  }

  const supabase = getSupabaseForUser()

  // Check if username is already taken (if it's different from current username)
  if (profileData.username !== user.profile?.username) {
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", profileData.username)
      .neq("id", user.id)
      .single()

    if (existingUser) {
      return { error: "Username is already taken" }
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      return { error: "Error checking username availability" }
    }
  }

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      username: profileData.username,
      avatar_url: profileData.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

