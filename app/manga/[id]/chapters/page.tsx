import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ArrowLeft } from "lucide-react"
import { getSupabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function ChaptersPage({ params }: { params: { id: string } }) {
  const id = params.id

  const manga = await getManga(id)

  if (!manga) {
    notFound()
  }

  const chapters = await getChapters(id)

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/manga/${id}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Manga
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{manga.title} - All Chapters</h1>
        </div>

        <div className="bg-secondary/10 rounded-lg p-6">
          {chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/manga/${manga.id}/read/${chapter.chapter_number}`}
                  className="p-4 bg-background/50 rounded-md hover:bg-background/80 transition-colors"
                >
                  <div className="font-medium">Chapter {chapter.chapter_number}</div>
                  {chapter.title && <div className="text-sm text-muted-foreground truncate">{chapter.title}</div>}
                  {chapter.release_date && (
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(chapter.release_date)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No chapters available yet.</p>
            </div>
          )}
        </div>
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
    .order("chapter_number", { ascending: false })

  if (error) {
    console.error("Error fetching chapters:", error)
    return []
  }

  return data
}

