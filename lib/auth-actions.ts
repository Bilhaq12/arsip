"use server"

import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a Supabase client for server-side operations
const getSupabaseServer = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

export async function loginWithEmail(email: string, password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function registerWithEmail(email: string, password: string, username: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create a profile for the user in the profiles table
  const adminSupabase = getSupabaseServer()

  // Get the user that was just created
  const { data: userData } = await adminSupabase.auth.admin.listUsers()
  const newUser = userData.users.find((user) => user.email === email)

  if (newUser) {
    // Create a profile entry
    await adminSupabase.from("profiles").insert({
      id: newUser.id,
      username,
      email,
      created_at: new Date().toISOString(),
    })
  }

  return { success: true }
}

export async function logout() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  await supabase.auth.signOut()
  return { success: true }
}

export async function getCurrentUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return {
    ...session.user,
    profile,
  }
}

export async function resetPassword(email: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(password: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

