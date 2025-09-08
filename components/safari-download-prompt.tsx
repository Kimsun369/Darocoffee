"use client"

import { useEffect, useState } from "react"
import { X, Download, Smartphone, Share, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafariDownloadPromptProps {
  language: "en" | "kh"
}

// Browser detection functions
const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

const isMobileSafari = (): boolean => {
  return isIOS() && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

const isStandalone = (): boolean => {
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

  const handleInstallClick = () => {
    // For Safari, we can't programmatically trigger the install,
    // so we'll just keep the instructions visible
  }

  if (!isVisible || !isMobileSafariBrowser) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900">
          {language === "en" ? "Install Fresthie's Coffee" : "តំឡើង Fresthie's Coffee"}
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
          ? "Get easy access to our menu and ordering system" 
          : "ទទួលបានការចូលប្រើម៉ឺនុយ និងប្រព័ន្ធបញ្ជាទិញរបស់យើងយ៉ាងងាយស្រួល"}
      </p>

      {/* Instructions */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start space-x-2">
          <div className="bg-blue-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
            <Share className="h-3.5 w-3.5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">
              {language === "en" ? "Tap the Share button" : "ចុចប៊ូតុង Share"}
            </p>
            <p className="text-xs text-gray-600">
              {language === "en" 
                ? "At the bottom of Safari" 
                : "នៅខាងក្រោម Safari"}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="bg-green-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
            <Plus className="h-3.5 w-3.5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">
              {language === "en" ? "Select 'Add to Home Screen'" : "ជ្រើស 'Add to Home Screen'"}
            </p>
            <p className="text-xs text-gray-600">
              {language === "en" 
                ? "Scroll down in share menu" 
                : "រំកិលចុះក្នុងម៉ឺនុយ Share"}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <div className="bg-amber-100 rounded-full p-1.5 mt-0.5 flex-shrink-0">
            <Smartphone className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-900">
              {language === "en" ? "Tap 'Add'" : "ចុច 'Add'"}
            </p>
            <p className="text-xs text-gray-600">
              {language === "en" 
                ? "Confirm to add to home screen" 
                : "បញ្ជាក់ដើម្បីបន្ថែមទៅអេក្រង់ដំបូង"}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleClose}
          variant="outline"
          className="flex-1 border-gray-300 text-xs h-8"
        >
          {language === "en" ? "Maybe Later" : "ប្រហែលពេលក្រោយ"}
        </Button>
        <Button
          onClick={handleInstallClick}
          className="flex-1 bg-amber-600 hover:bg-amber-700 text-xs h-8"
        >
          <Download className="h-3 w-3 mr-1" />
          {language === "en" ? "Got It" : "យល់ហើយ"}
        </Button>
      </div>
    </div>
  )
}