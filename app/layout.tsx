import type React from "react"
import "@/styles/globals.css"
import type { Metadata, Viewport } from "next"
import { Link } from "@heroui/link"
import clsx from "clsx"

import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/config/fonts"
import { Navbar } from "@/components/navbar"
import { Hati } from "@/components/icons"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className={clsx("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-4 px-6 flex-grow">
              {" "}
              {/* Mengurangi padding dari pt-16 menjadi pt-4 */}
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                isExternal
                className="flex items-center gap-1 text-current"
                href="https://www.youtube.com/@wasesaaireng"
                title="kiyocomics"
              >
                <span className="text-default-600">Made with</span>
                <Hati className="text-danger" />
                <p className="text-primary">Aireng</p>
              </Link>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

