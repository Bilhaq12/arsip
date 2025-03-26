import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-actions"
import ForgotPasswordForm from "@/components/forgot-password-form"

export default async function ForgotPasswordPage() {
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
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading...</div>}>
              <ForgotPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

