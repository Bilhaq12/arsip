import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import LoginForm from "@/components/login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { registered?: string }
}) {
  // Check if user is already logged in
  const user = await getCurrentUser()
  if (user) {
    redirect("/")
  }

  const registered = searchParams.registered === "true"

  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
            {registered && (
              <div className="mt-4 p-3 bg-green-500/20 text-green-600 rounded-md">
                Registration successful! Please log in with your new account.
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

