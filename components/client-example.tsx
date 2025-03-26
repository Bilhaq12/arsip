"use client"

import { useEffect, useState } from "react"
import { useSupabase } from "./supabase-provider"
import type { Tables } from "@/types/supabase"

export default function ClientExample() {
  const { supabase, isLoading } = useSupabase()
  const [anime, setAnime] = useState<Tables<"anime">[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase || isLoading) return

    const fetchAnime = async () => {
      try {
        const { data, error } = await supabase.from("anime").select("*").limit(5)

        if (error) throw error
        setAnime(data || [])
      } catch (err) {
        console.error("Error fetching anime:", err)
        setError("Failed to load anime")
      }
    }

    fetchAnime()
  }, [supabase, isLoading])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>{error}</p>
  if (!supabase) return <p>Supabase client not available</p>

  return (
    <div>
      <h2>Anime from Client Component</h2>
      <ul>
        {anime.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

