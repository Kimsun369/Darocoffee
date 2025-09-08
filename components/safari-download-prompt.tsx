"use client"

import { useEffect, useState } from "react"
import { X, Download, Smartphone, Share, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SafariDownloadPromptProps {
  language: "en" | "kh"
}

export function SafariDownloadPrompt({ language }: SafariDownloadPromptProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isSafari, setIsSafari] = useState(false)

  useEffect(() => {
    // Check if Safari
    const userAgent = navigator.userAgent;
    const safari = /^((?!chrome|android).)*safari/i.test(userAgent) || 
                   /iPad|iPhone|iPod/.test(userAgent);
    setIsSafari(safari)
    
    // Only show for Safari users
    if (safari) {
      // Check if we've shown this before (using localStorage)
      const hasSeenPrompt = localStorage.getItem('safari-download-prompt-seen')
      
      // Show after a delay if they haven't seen it yet
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setIsVisible(true)
          localStorage.setItem('safari-download-prompt-seen', 'true')
        }, 5000) // Show after 5 seconds
        
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

  if (!isVisible || !isSafari) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Header */}
        <div className="text-center mb-2">
          <div className="bg-amber-100 rounded-full p-3 inline-flex items-center justify-center mb-3">
            <Download className="h-8 w-8 text-amber-600" />
          </div>
          <h3 className="font-bold text-xl text-gray-900">
            {language === "en" ? "Install Fresthie's Coffee" : "តំឡើង Fresthie's Coffee"}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            {language === "en" 
              ? "Get easy access to our menu and ordering system" 
              : "ទទួលបានការចូលប្រើម៉ឺនុយ និងប្រព័ន្ធបញ្ជាទិញរបស់យើងយ៉ាងងាយស្រួល"}
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 my-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 rounded-full p-2 mt-1 flex-shrink-0">
              <Share className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {language === "en" ? "Tap the Share button" : "ចុចប៊ូតុង Share"}
              </p>
              <p className="text-sm text-gray-600">
                {language === "en" 
                  ? "Find it at the bottom of your Safari browser" 
                  : "រកវានៅខាងក្រោមកម្មវិធីរុករក Safari របស់អ្នក"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 rounded-full p-2 mt-1 flex-shrink-0">
              <Plus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {language === "en" ? "Select 'Add to Home Screen'" : "ជ្រើស 'Add to Home Screen'"}
              </p>
              <p className="text-sm text-gray-600">
                {language === "en" 
                  ? "Scroll down in the share menu to find this option" 
                  : "រំកិលចុះក្នុងម៉ឺនុយ Share ដើម្បីរកជម្រើសនេះ"}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="bg-amber-100 rounded-full p-2 mt-1 flex-shrink-0">
              <Smartphone className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {language === "en" ? "Tap 'Add'" : "ចុច 'Add'"}
              </p>
              <p className="text-sm text-gray-600">
                {language === "en" 
                  ? "Confirm to add the app to your home screen" 
                  : "បញ្ជាក់ដើម្បីបន្ថែមកម្មវិធីទៅអេក្រង់ដំបូងរបស់អ្នក"}
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="flex-1 border-gray-300"
          >
            {language === "en" ? "Maybe Later" : "ប្រហែលពេលក្រោយ"}
          </Button>
          <Button
            onClick={handleInstallClick}
            className="flex-1 bg-amber-600 hover:bg-amber-700"
          >
            <Download className="h-4 w-4 mr-2" />
            {language === "en" ? "Got It" : "យល់ហើយ"}
          </Button>
        </div>
      </div>
    </div>
  )
}