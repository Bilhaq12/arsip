import { getSupabase } from "@/lib/supabase"
import AnimeGrid from "@/components/anime-grid"

export default async function SearchPage({ searchParams }: any) {
  const query = searchParams.q || ""
  const currentPage = searchParams.page ? Number.parseInt(searchParams.page) : 1

  const anime = await searchAnime(query, currentPage)
  const totalCount = await getSearchCount(query)

  const pageSize = 20
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-6">
          Found {totalCount} results for "{query}"
        </p>

        <AnimeGrid anime={anime} currentPage={currentPage} totalPages={totalPages} searchParams={searchParams} />
      </div>
    </div>
  )
}

async function searchAnime(query: string, page: number) {
  const supabase = getSupabase()
  const pageSize = 20
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1

  const { data, error } = await supabase.from("anime").select("*").ilike("title", `%${query}%`).range(start, end)

  if (error) {
    console.error("Error searching anime:", error)
    return []
  }

  return data
}

async function getSearchCount(query: string) {
  const supabase = getSupabase()
  const { count, error } = await supabase.from("anime").select("id", { count: "exact" }).ilike("title", `%${query}%`)

  if (error) {
    console.error("Error getting search count:", error)
    return 0
  }

  return count || 0
}

