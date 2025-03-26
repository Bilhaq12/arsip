import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import type { Tables } from "@/types/supabase"
import { formatDate } from "@/lib/utils"

interface ChapterListProps {
  chapters: Tables<"chapter">[]
  mangaId: number
  currentChapterId?: number
}

export default function ChapterList({ chapters, mangaId, currentChapterId }: ChapterListProps) {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="font-semibold text-white">Chapters ({chapters.length})</h2>
      </div>

      <div className="h-[calc(100vh-350px)] overflow-y-auto">
        {chapters.map((chapter) => (
          <Link
            key={chapter.id}
            href={`/manga/${mangaId}/read/${chapter.chapter_number}`}
            className={`flex p-3 gap-3 hover:bg-gray-800/50 transition-colors ${
              chapter.id === currentChapterId ? "bg-gray-800/80" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm text-white">
                  Chapter {chapter.chapter_number}
                  {chapter.title && <span className="text-gray-400 ml-2">: {chapter.title}</span>}
                </p>
                {chapter.id === currentChapterId && (
                  <div className="bg-primary text-white text-xs px-2 py-0.5 rounded">Reading</div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-1">
                {chapter.release_date && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(chapter.release_date)}
                  </p>
                )}
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(chapter.release_date || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

