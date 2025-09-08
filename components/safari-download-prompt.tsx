"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafariDownloadPromptProps {
  language: "en" | "kh"
}

// Browser detection functions
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const isMobileSafari = (): boolean => {
  if (typeof window === 'undefined') return false;
  return isIOS() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

export function SafariDownloadPrompt({ language }: SafariDownloadPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileSafariBrowser, setIsMobileSafariBrowser] = useState(false)

  useEffect(() => {
    // Check if mobile Safari and not already installed as PWA
    const mobileSafari = isMobileSafari();
    const standalone = isStandalone();
    
    setIsMobileSafariBrowser(mobileSafari)
    
    // Only show for mobile Safari users who haven't installed the app yet
    if (mobileSafari && !standalone) {
      // Check if we've shown this before
      const hasSeenPrompt = localStorage.getItem('safari-download-prompt-seen')
      
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setIsVisible(true)
          localStorage.setItem('safari-download-prompt-seen', 'true')
        }, 5000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible || !isMobileSafariBrowser) return null

  return (
    <div className={`fixed bottom-4 right-4 z-40 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm ${language === "kh" ? "font-mono" : "font-sans"}`}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">
          {language === "en" ? "Install Fresthie's Coffee App" : "តំឡើងកម្មវិធី Fresthie's Coffee"}
        </h3>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        {language === "en" 
          ? "Install our app now for more convenient. Access your menu and orders quickly from your home screen." 
          : "តំឡើងកម្មវិធីឥឡូវនេះដើម្បីភាពងាយស្រួលជាងមុន។ ចូលប្រើម៉ឺនុយ និងការកម្មង់របស់អ្នកយ៉ាងរហ័សពីអេក្រង់ដំបូងរបស់អ្នក។"
        }
      </p>

      <div className="flex gap-2">
        <Button
          onClick={handleClose}
          className="flex-1 bg-amber-600 hover:bg-amber-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {language === "en" ? "Got It" : "យល់ហើយ"}
        </Button>
        <Button
          onClick={handleClose}
          variant="outline"
          className="border-gray-300"
        >
          {language === "en" ? "Not Now" : "មិនទាន់"}
        </Button>
      </div>
    </div>
  )
}