import { Suspense } from "react"
import { getSupabase } from "@/lib/supabase"
import MangaCarousel from "@/components/manga-carousel"

export default async function MangaPage() {
  const popularManga = await getPopularManga()
  const recentlyUpdated = await getRecentlyUpdated()
  const completedManga = await getCompletedManga()
  const ongoingManga = await getOngoingManga()

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Manga</h1>

        <div className="space-y-12">
          <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
            <MangaCarousel title="POPULAR MANGA" mangaList={popularManga} viewAllHref="/manga/browse?sort=popular" />
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
            <MangaCarousel
              title="RECENTLY UPDATED"
              mangaList={recentlyUpdated}
              viewAllHref="/manga/browse?sort=newest"
            />
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
            <MangaCarousel title="ONGOING MANGA" mangaList={ongoingManga} viewAllHref="/manga/browse?status=Ongoing" />
          </Suspense>

          <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
            <MangaCarousel
              title="COMPLETED MANGA"
              mangaList={completedManga}
              viewAllHref="/manga/browse?status=Completed"
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function getPopularManga() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("manga").select("*").order("views", { ascending: false }).limit(10)

  if (error) {
    console.error("Error fetching popular manga:", error)
    return []
  }

  return data
}

async function getRecentlyUpdated() {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("manga").select("*").order("last_update", { ascending: false }).limit(10)

  if (error) {
    console.error("Error fetching recently updated manga:", error)
    return []
  }

  return data
}

async function getCompletedManga() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("manga")
    .select("*")
    .eq("status", "Completed")
    .order("rating", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching completed manga:", error)
    return []
  }

  return data
}

async function getOngoingManga() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("manga")
    .select("*")
    .eq("status", "Ongoing")
    .order("last_update", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching ongoing manga:", error)
    return []
  }

  return data
}

