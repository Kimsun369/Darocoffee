import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display} from "next/font/google"
import { Work_Sans } from "next/font/google"
import { Kantumruy_Pro as Kantumruy } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
})

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
})

const kantumruy = Kantumruy({
  subsets: ["khmer"],
  display: "swap",
  variable: "--font-kantumruy",
})

export const metadata: Metadata = {
  title: "Signature Coffee - Premium Coffee Experience",
  description: "Experience the finest coffee blends and artisanal beverages at Signature Coffee Shop",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </head>
      <body className={`font-sans ${workSans.variable} ${playfairDisplay.variable} ${kantumruy.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
