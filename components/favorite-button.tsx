"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleAnimeFavorite, toggleMangaFavorite, isAnimeFavorited, isMangaFavorited } from "@/lib/favorites-actions"
import { useToast } from "@/hooks/use-toast"

interface FavoriteButtonProps {
  id: number
  type: "anime" | "manga"
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function FavoriteButton({ id, type, variant = "outline", size = "default" }: FavoriteButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        if (type === "anime") {
          const { favorited } = await isAnimeFavorited(id)
          setIsFavorited(favorited)
        } else {
          const { favorited } = await isMangaFavorited(id)
          setIsFavorited(favorited)
        }
      } catch (error) {
        console.error("Error checking favorite status:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    checkFavoriteStatus()
  }, [id, type])

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      let result
      if (type === "anime") {
        result = await toggleAnimeFavorite(id)
      } else {
        result = await toggleMangaFavorite(id)
      }

      if (result.error) {
        if (result.error.includes("logged in")) {
          toast({
            title: "Authentication required",
            description: "Please log in to add favorites",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      setIsFavorited(result.action === "added")

      toast({
        title: result.action === "added" ? "Added to favorites" : "Removed from favorites",
        description: `Successfully ${result.action} ${type} to your favorites`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitializing) {
    return (
      <Button variant={variant} size={size} disabled>
        <Heart className="h-4 w-4 mr-2" />
        Favorite
      </Button>
    )
  }

  return (
    <Button
      variant={isFavorited ? "default" : variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={isFavorited ? "bg-red-500 hover:bg-red-600" : ""}
    >
      <Heart className={`h-4 w-4 ${size !== "icon" ? "mr-2" : ""} ${isFavorited ? "fill-current" : ""}`} />
      {size !== "icon" && (isFavorited ? "Favorited" : "Favorite")}
    </Button>
  )
}

