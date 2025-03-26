import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth-actions"
import ProfileForm from "@/components/profile-form"
import PasswordForm from "@/components/password-form"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                <ProfileForm user={user} />
              </div>
            </TabsContent>

            <TabsContent value="password">
              <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
                <PasswordForm />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

