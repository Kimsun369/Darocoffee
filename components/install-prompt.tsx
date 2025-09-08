"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPrompt({ language }: { language: "en" | "kh" }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Update UI to notify the user they can install the PWA
      setIsVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    
    // Hide the install prompt UI
    setIsVisible(false)
    
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`)
  }

  const handleDismiss = () => {
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm ${language === "kh" ? "font-mono" : "font-sans"}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">
          {language === "en" ? "Install Fresthie's Coffee App" : "តំឡើងកម្មវិធី Fresthie's Coffee"}
        </h3>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {language === "en" 
          ? "Install our app for a better experience. Access your menu and orders quickly from your home screen." 
          : "តំឡើងកម្មវិធីរបស់យើងសម្រាប់បទពិសោធន៍ដ៏ល្អប្រសើរ។ ចូលប្រើម៉ឺនុយ និងការកម្មង់របស់អ្នកយ៉ាងរហ័សពីអេក្រង់ដំបូងរបស់អ្នក។"
        }
      </p>
      <div className="flex gap-2">
        <Button
          onClick={handleInstallClick}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {language === "en" ? "Install" : "តំឡើង"}
        </Button>
        <Button
          onClick={handleDismiss}
          variant="outline"
          className="border-gray-300"
        >
          {language === "en" ? "Not Now" : "មិនមែនឥឡូវ"}
        </Button>
      </div>
    </div>
  )
}