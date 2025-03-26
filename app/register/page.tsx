import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import RegisterForm from "@/components/register-form"

export default async function RegisterPage() {
  // Check if user is already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground mt-2">Sign up to track your favorite anime and manga</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

