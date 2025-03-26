import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Star, Eye, Clock, Info, User, BookOpen } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate, getAnimeStatusColor } from "@/lib/utils"
import MangaCarousel from "@/components/manga-carousel"
import FavoriteButton from "@/components/favorite-button"

export default async function MangaPage({ params }: { params: { id: string } }) {
  const id = params.id

  const manga = await getManga(id)

  if (!manga) {
    notFound()
  }

  const chapters = await getChapters(id)
  const genres = await getGenres(id)
  const characters = await getCharacters(id)
  const authors = await getAuthors(id)
  const similarManga = await getSimilarManga(id)

  // Update view count
  if (manga) {
    const supabase = getSupabase()
    await supabase
      .from("manga")
      .update({ views: (manga.views || 0) + 1 })
      .eq("id", manga.id)
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        {manga.image_url ? (
          <Image src={manga.image_url || "/placeholder.svg"} alt={manga.title} fill priority className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-black to-gray-900" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Manga Poster */}
          <div className="hidden md:block">
            <div className="rounded-lg overflow-hidden border-4 border-background shadow-xl">
              {manga.image_url ? (
                <Image
                  src={manga.image_url || "/placeholder.svg"}
                  alt={manga.title}
                  width={250}
                  height={375}
                  className="object-cover w-full aspect-[2/3]"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              {chapters.length > 0 && (
                <Button className="w-full gap-2" asChild>
                  <Link href={`/manga/${manga.id}/read/${chapters[0].chapter_number}`}>
                    <BookOpen className="h-4 w-4" />
                    Read First Chapter
                  </Link>
                </Button>
              )}

              {chapters.length > 0 && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href={`/manga/${manga.id}/read/${chapters[chapters.length - 1].chapter_number}`}>
                    <BookOpen className="h-4 w-4" />
                    Read Latest Chapter
                  </Link>
                </Button>
              )}

              <FavoriteButton id={manga.id} type="manga" className="w-full" />

              {manga.status && (
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Status: </span>
                  <Badge className={`${getAnimeStatusColor(manga.status)} text-white ml-auto`}>{manga.status}</Badge>
                </div>
              )}

              {manga.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Released: </span>
                  <span className="text-sm ml-auto">{formatDate(manga.release_date)}</span>
                </div>
              )}

              {manga.rating && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Rating: </span>
                  <span className="text-sm ml-auto">{manga.rating.toFixed(1)}/10</span>
                </div>
              )}

              {manga.views && (
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Views: </span>
                  <span className="text-sm ml-auto">{manga.views.toLocaleString()}</span>
                </div>
              )}

              {manga.type && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Type: </span>
                  <span className="text-sm ml-auto">{manga.type}</span>
                </div>
              )}

              {authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Author: </span>
                  <div className="text-sm ml-auto">
                    {authors.map((author, index) => (
                      <span key={author.id}>
                        {author.name}
                        {index < authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Manga Details */}
          <div className="bg-background/80 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{manga.title}</h1>

            {/* Mobile Buttons */}
            <div className="md:hidden flex gap-4 mb-4">
              {chapters.length > 0 && (
                <Button className="flex-1 gap-2" asChild>
                  <Link href={`/manga/${manga.id}/read/${chapters[chapters.length - 1].chapter_number}`}>
                    <BookOpen className="h-4 w-4" />
                    Read Latest
                  </Link>
                </Button>
              )}

              {manga.status && (
                <Badge className={`${getAnimeStatusColor(manga.status)} text-white`}>{manga.status}</Badge>
              )}

              <FavoriteButton id={manga.id} type="manga" size="icon" />
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Description */}
            {manga.description && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Synopsis</h2>
                <p className="text-sm text-muted-foreground">{manga.description}</p>
              </div>
            )}

            {/* Characters */}
            {characters.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {characters.map((character: any) => (
                    <div key={character.id} className="text-center">
                      <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 mx-auto border-2 border-primary/20">
                        {character.image_url ? (
                          <Image
                            src={character.image_url || "/placeholder.svg"}
                            alt={character.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No Image</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium line-clamp-1">{character.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chapters */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Chapters</h2>

              {chapters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {chapters.slice(0, 12).map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/manga/${manga.id}/read/${chapter.chapter_number}`}
                      className="p-3 bg-secondary/20 rounded-md hover:bg-secondary/40 transition-colors"
                    >
                      <div className="font-medium">Chapter {chapter.chapter_number}</div>
                      {chapter.title && <div className="text-xs text-muted-foreground truncate">{chapter.title}</div>}
                      {chapter.release_date && (
                        <div className="text-xs text-muted-foreground mt-1">{formatDate(chapter.release_date)}</div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No chapters available yet.</p>
                </div>
              )}

              {chapters.length > 12 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href={`/manga/${manga.id}/chapters`}>View All Chapters</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Manga */}
        {similarManga.length > 0 && (
          <div className="mt-12 pb-8">
            <MangaCarousel title="You May Also Like" mangaList={similarManga} />
          </div>
        )}
      </div>
    </div>
  )
}

async function getManga(id: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("manga").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching manga:", error)
    return null
  }

  return data
}

async function getChapters(mangaId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("chapter")
    .select("*")
    .eq("manga_id", mangaId)
    .order("chapter_number", { ascending: true })

  if (error) {
    console.error("Error fetching chapters:", error)
    return []
  }

  return data
}

async function getGenres(mangaId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase.from("manga_genre").select("genre_id, genre(id, name)").eq("manga_id", mangaId)

  if (error) {
    console.error("Error fetching genres:", error)
    return []
  }

  return data.map((item) => item.genre)
}

async function getCharacters(mangaId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("manga_character")
    .select("character_id, character(id, name, image_url, description)")
    .eq("manga_id", mangaId)
    .limit(6)

  if (error) {
    console.error("Error fetching characters:", error)
    return []
  }

  return data.map((item) => item.character)
}

async function getAuthors(mangaId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("manga_author")
    .select("author_id, author(id, name, image_url)")
    .eq("manga_id", mangaId)

  if (error) {
    console.error("Error fetching authors:", error)
    return []
  }

  return data.map((item) => item.author)
}

async function getSimilarManga(mangaId: string) {
  const supabase = getSupabase()
  // In a real app, you'd use genre matching or other recommendation logic
  // For now, we'll just get random manga
  const { data, error } = await supabase.from("manga").select("*").neq("id", mangaId).limit(10)

  if (error) {
    console.error("Error fetching similar manga:", error)
    return []
  }

  return data
}

