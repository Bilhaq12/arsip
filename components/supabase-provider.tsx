"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

type SupabaseContextType = {
  supabase: ReturnType<typeof createClient<Database>> | null
  isLoading: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  isLoading: true,
})

export const useSupabase = () => useContext(SupabaseContext)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient<Database>> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Supabase client on the client side
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient<Database>(supabaseUrl, supabaseAnonKey)
      setSupabase(client)
    } else {
      console.error("Supabase credentials are missing")
    }

    setIsLoading(false)
  }, [])

  return <SupabaseContext.Provider value={{ supabase, isLoading }}>{children}</SupabaseContext.Provider>
}

