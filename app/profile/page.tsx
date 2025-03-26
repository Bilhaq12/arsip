import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const username = user.profile?.username || user.email.split("@")[0]
  const avatarUrl = user.profile?.avatar_url

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <Avatar className="h-32 w-32">
                <AvatarImage src={avatarUrl || ""} alt={username} />
                <AvatarFallback className="text-4xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{username}</h1>
                <p className="text-muted-foreground mt-1">{user.email}</p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Anime Watched</div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Manga Read</div>
                  </div>

                  <div className="bg-background p-4 rounded-lg">
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-sm text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h2 className="text-xl font-bold mb-4">Activity</h2>
              <div className="text-center py-12 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

