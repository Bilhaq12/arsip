import { Suspense } from "react"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth-actions"
import { getUserAnimeFavorites, getUserMangaFavorites } from "@/lib/favorites-actions"
import AnimeGrid from "@/components/anime-grid"
import MangaGrid from "@/components/manga-grid"

export default async function FavoritesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const animeResult = await getUserAnimeFavorites()
  const mangaResult = await getUserMangaFavorites()

  const animeList = animeResult.success ? animeResult.data.map((item: any) => item.anime) : []
  const mangaList = mangaResult.success ? mangaResult.data.map((item: any) => item.manga) : []

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

        <Tabs defaultValue="anime" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="anime">Anime ({animeList.length})</TabsTrigger>
            <TabsTrigger value="manga">Manga ({mangaList.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="anime">
            <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
              {animeList.length > 0 ? (
                <AnimeGrid anime={animeList} currentPage={1} totalPages={1} searchParams={{}} />
              ) : (
                <div className="text-center py-12 bg-secondary/10 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No favorite anime yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding anime to your favorites by clicking the heart icon on anime pages
                  </p>
                </div>
              )}
            </Suspense>
          </TabsContent>

          <TabsContent value="manga">
            <Suspense fallback={<div className="h-64 bg-secondary/20 animate-pulse rounded-lg" />}>
              {mangaList.length > 0 ? (
                <MangaGrid manga={mangaList} currentPage={1} totalPages={1} searchParams={{}} />
              ) : (
                <div className="text-center py-12 bg-secondary/10 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No favorite manga yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding manga to your favorites by clicking the heart icon on manga pages
                  </p>
                </div>
              )}
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

