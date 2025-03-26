"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { resetPassword } from "@/lib/auth-actions"

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await resetPassword(email)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4">
        <div className="bg-green-500/20 p-4 rounded-md flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-green-600">Check your email</h3>
            <p className="text-sm text-green-600/90 mt-1">
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/login" className="text-primary hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center text-sm">
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      </div>
    </form>
  )
}

