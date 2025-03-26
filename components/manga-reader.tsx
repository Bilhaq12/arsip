"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Settings, List, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Tables } from "@/types/supabase"

interface ChapterImage {
  id: number
  chapter_id: number
  image_url: string
  page_number: number
}

interface MangaReaderProps {
  chapterImages: ChapterImage[]
  manga: Tables<"manga">
  chapter: Tables<"chapter">
  prevChapter: Tables<"chapter"> | null
  nextChapter: Tables<"chapter"> | null
}

export default function MangaReader({ chapterImages, manga, chapter, prevChapter, nextChapter }: MangaReaderProps) {
  const [readingMode, setReadingMode] = useState<"vertical" | "horizontal" | "single">("vertical")
  const [currentPage, setCurrentPage] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const totalPages = chapterImages.length

  // Sort images by page number
  const sortedImages = [...chapterImages].sort((a, b) => a.page_number - b.page_number)

  useEffect(() => {
    const handleScroll = () => {
      setShowControls(false)
      const timeout = setTimeout(() => {
        setShowControls(true)
      }, 2000)
      return () => clearTimeout(timeout)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) {
      if (prevChapter) {
        window.location.href = `/manga/${manga.id}/read/${prevChapter.chapter_number}`
      }
      return
    }

    if (newPage > totalPages) {
      if (nextChapter) {
        window.location.href = `/manga/${manga.id}/read/${nextChapter.chapter_number}`
      }
      return
    }

    setCurrentPage(newPage)

    if (readingMode === "single") {
      const imageElement = document.getElementById(`page-${newPage}`)
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div className="relative">
      {/* Top Controls */}
      <div
        className={`sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <a href={`/manga/${manga.id}`} className="flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Back to Manga</span>
                </a>
              </Button>

              <div className="text-sm font-medium truncate max-w-[200px] sm:max-w-none">
                {manga.title} - Ch. {chapter.chapter_number}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tabs value={readingMode} onValueChange={(value) => setReadingMode(value as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="vertical" className="px-2 h-7">
                    <List className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Vertical</span>
                  </TabsTrigger>
                  <TabsTrigger value="horizontal" className="px-2 h-7">
                    <ChevronRight className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">RTL</span>
                  </TabsTrigger>
                  <TabsTrigger value="single" className="px-2 h-7">
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1">Single</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {readingMode === "single" && (
                <div className="flex items-center gap-1 text-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 && !prevChapter}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="min-w-[60px] text-center">
                    {currentPage} / {totalPages}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages && !nextChapter}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="mt-4">
        {readingMode === "vertical" && (
          <div className="space-y-2 max-w-3xl mx-auto">
            {sortedImages.map((image, index) => (
              <div key={image.id} className="w-full">
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Page ${image.page_number}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        )}

        {readingMode === "horizontal" && (
          <div className="flex flex-row-reverse overflow-x-auto scrollbar-hide">
            {sortedImages.map((image, index) => (
              <div key={image.id} className="flex-shrink-0">
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Page ${image.page_number}`}
                  width={800}
                  height={1200}
                  className="h-[calc(100vh-120px)] w-auto"
                  priority={index < 3}
                />
              </div>
            ))}
          </div>
        )}

        {readingMode === "single" && (
          <div className="max-w-3xl mx-auto">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                id={`page-${image.page_number}`}
                className={`w-full ${currentPage === image.page_number ? "block" : "hidden"}`}
              >
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={`Page ${image.page_number}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto"
                  priority
                />
              </div>
            ))}

            <div className="fixed bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-gray-900/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 && !prevChapter}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <span className="min-w-[60px] text-center text-sm">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages && !nextChapter}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-8 mb-16 flex gap-4 container mx-auto px-4">
        {prevChapter ? (
          <Button variant="outline" className="flex-1" asChild>
            <a href={`/manga/${manga.id}/read/${prevChapter.chapter_number}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Chapter
            </a>
          </Button>
        ) : (
          <Button variant="outline" className="flex-1" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous Chapter
          </Button>
        )}

        <Button variant="outline" asChild>
          <a href={`/manga/${manga.id}`}>
            <List className="mr-2 h-4 w-4" />
            Chapter List
          </a>
        </Button>

        {nextChapter ? (
          <Button variant="primary" className="flex-1" asChild>
            <a href={`/manga/${manga.id}/read/${nextChapter.chapter_number}`}>
              Next Chapter
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button variant="primary" className="flex-1" disabled>
            Next Chapter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

