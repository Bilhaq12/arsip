"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfile } from "@/lib/profile-actions"
import { useToast } from "@/hooks/use-toast"

interface ProfileFormProps {
  user: {
    id: string
    email: string
    profile?: {
      username: string
      avatar_url?: string
    }
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState(user.profile?.username || "")
  const [avatarUrl, setAvatarUrl] = useState(user.profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await updateProfile({
        username,
        avatar_url: avatarUrl,
      })

      if (result.error) {
        setError(result.error)
      } else {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center gap-4 mb-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl || ""} alt={username} />
          <AvatarFallback className="text-2xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" value={user.email} className="pl-10" disabled />
          </div>
          <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            type="url"
            placeholder="https://example.com/avatar.jpg"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Enter a URL to an image for your profile picture</p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

