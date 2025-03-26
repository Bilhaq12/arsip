import { notFound } from "next/navigation"
import { getSupabase } from "@/lib/supabase"
import MangaReader from "@/components/manga-reader"

export default async function ReadChapterPage({ params }: { params: { id: string; chapter: string } }) {
  const mangaId = params.id
  const chapterNumber = Number.parseFloat(params.chapter)

  const manga = await getManga(mangaId)

  if (!manga) {
    notFound()
  }

  const chapter = await getChapterByNumber(mangaId, chapterNumber)

  if (!chapter) {
    notFound()
  }

  const chapterImages = await getChapterImages(chapter.id)

  // Get previous and next chapters
  const prevChapter = await getPrevChapter(mangaId, chapterNumber)
  const nextChapter = await getNextChapter(mangaId, chapterNumber)

  // Update view count
  if (manga) {
    const supabase = getSupabase()
    await supabase
      .from("manga")
      .update({ views: (manga.views || 0) + 1 })
      .eq("id", manga.id)
  }

  return (
    <div className="pt-16 pb-8 min-h-screen">
      <MangaReader
        chapterImages={chapterImages}
        manga={manga}
        chapter={chapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
      />
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

async function getChapterByNumber(mangaId: string, chapterNumber: number) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("chapter")
    .select("*")
    .eq("manga_id", mangaId)
    .eq("chapter_number", chapterNumber)
    .single()

  if (error) {
    console.error("Error fetching chapter:", error)
    return null
  }

  return data
}

async function getChapterImages(chapterId: number) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("chapter_image")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("page_number", { ascending: true })

  if (error) {
    console.error("Error fetching chapter images:", error)
    return []
  }

  return data
}

async function getPrevChapter(mangaId: string, currentChapterNumber: number) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("chapter")
    .select("*")
    .eq("manga_id", mangaId)
    .lt("chapter_number", currentChapterNumber)
    .order("chapter_number", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data
}

async function getNextChapter(mangaId: string, currentChapterNumber: number) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("chapter")
    .select("*")
    .eq("manga_id", mangaId)
    .gt("chapter_number", currentChapterNumber)
    .order("chapter_number", { ascending: true })
    .limit(1)
    .single()

  if (error) {
    return null
  }

  return data
}

