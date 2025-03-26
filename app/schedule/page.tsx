import { getSupabase } from "@/lib/supabase"
import type { Tables } from "@/types/supabase"
import Image from "next/image"
import Link from "next/link"

async function getSchedule() {
  const supabase = getSupabase()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const scheduleByDay: Record<string, Array<Tables<"anime"> & { time: string | null }>> = {}

  // Initialize empty arrays for each day
  days.forEach((day) => {
    scheduleByDay[day] = []
  })

  // Get all scheduled anime
  const { data, error } = await supabase
    .from("anime_schedules")
    .select(`
      day,
      time,
      anime:anime_id (*)
    `)
    .order("time")

  if (error) {
    console.error("Error fetching schedule:", error)
    return scheduleByDay
  }

  // Group by day
  data.forEach((item) => {
    if (item.day && item.anime) {
      const day = item.day
      scheduleByDay[day].push({
        ...item.anime,
        time: item.time,
      })
    }
  })

  return scheduleByDay
}

export default async function SchedulePage() {
  const scheduleByDay = await getSchedule()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Get current day of week
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Anime Schedule</h1>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 mb-8">
          {days.map((day) => (
            <a
              key={day}
              href={`#${day.toLowerCase()}`}
              className={`px-4 py-2 text-center rounded-md transition-colors ${
                day === today ? "bg-primary text-primary-foreground" : "bg-secondary/20 hover:bg-secondary/40"
              }`}
            >
              {day}
            </a>
          ))}
        </div>

        <div className="space-y-10">
          {days.map((day) => (
            <div key={day} id={day.toLowerCase()}>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">{day}</h2>

              {scheduleByDay[day].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {scheduleByDay[day].map((anime) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="flex gap-4 p-3 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      <div className="relative w-16 h-20 rounded overflow-hidden flex-shrink-0">
                        {anime.image_url ? (
                          <Image
                            src={anime.image_url || "/placeholder.svg"}
                            alt={anime.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-2">{anime.title}</h3>

                        {anime.time && <p className="text-sm text-primary mt-1">{anime.time.substring(0, 5)}</p>}

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{anime.type || "TV"}</span>
                          {anime.status && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{anime.status}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-secondary/10 rounded-lg">
                  <p className="text-muted-foreground">No anime scheduled for this day</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

