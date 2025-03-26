import { Suspense } from "react"
import ResetPasswordForm from "@/components/reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Set New Password</h1>
            <p className="text-muted-foreground mt-2">Create a new password for your account</p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
            <Suspense fallback={<div className="h-32 flex items-center justify-center">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

