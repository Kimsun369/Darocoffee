"use client"

import { useState, useEffect } from "react"
import { Coffee, Globe, Download, Home, Menu, Phone, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  cartItemCount: number
  onCartClick: () => void
  language: "en" | "kh"
  onLanguageChange: (lang: "en" | "kh") => void
  onScrollToSection: (section: string) => void
  currentSection?: string
}

export function Header({
  cartItemCount,
  onCartClick,
  language,
  onLanguageChange,
  onScrollToSection,
  currentSection,
}: HeaderProps) {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    installPrompt.prompt()

    const { outcome } = await installPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    setInstallPrompt(null)
    setIsInstallable(false)
  }

  const promotionalItems = [
    {
      icon: <Coffee className="h-4 w-4" />,
      text: language === "en" ? "FRESH ROASTED DAILY" : "អាំងស្រស់ប្រចាំថ្ងៃ",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      text: language === "en" ? "100% SATISFACTION GUARANTEE" : "ការធានា 100% ពេញចិត្ត",
    },
  ]

  return (
    <>
      {/* Top promotional banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 text-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-6 overflow-x-auto">
            {promotionalItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                {item.icon}
                <span className={`font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple top header with logo */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault()
                  onScrollToSection("top")
                }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-amber-600 flex items-center justify-center">
                  <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <h1 className="font-serif text-lg sm:text-xl font-bold text-gray-900">Fresthie</h1>
              </a>
            </div>

            <div className="flex items-center space-x-2">
              {/* Language toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLanguageChange(language === "en" ? "kh" : "en")}
                className="h-9 w-9 rounded-lg hover:bg-gray-100"
              >
                <Globe className="h-4 w-4 text-gray-700" />
              </Button>

              {/* Install App button */}
              {isInstallable && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleInstallClick}
                  className="h-9 w-9 rounded-lg hover:bg-gray-100"
                  title={language === "en" ? "Install App" : "តំឡើងកម្មវិធី"}
                >
                  <Download className="h-4 w-4 text-gray-700" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {/* Home Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("top")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all duration-200 ${
              currentSection === "top"
                ? "bg-amber-50 text-amber-600 border-t-2 border-amber-600"
                : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
          >
            <Home className="h-5 w-5 mb-1" />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Home" : "ទំព័រដើម"}
            </span>
          </Button>

          {/* Menu Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("menu")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all duration-200 ${
              currentSection === "menu"
                ? "bg-amber-50 text-amber-600 border-t-2 border-amber-600"
                : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
          >
            <Menu className="h-5 w-5 mb-1" />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Menu" : "ម្ហូប"}
            </span>
          </Button>

          {/* Contact Button */}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("contact")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all duration-200 ${
              currentSection === "contact"
                ? "bg-amber-50 text-amber-600 border-t-2 border-amber-600"
                : "text-gray-600 hover:text-amber-600 hover:bg-amber-50"
            }`}
          >
            <Phone className="h-5 w-5 mb-1" />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Contact" : "ទំនាក់ទំនង"}
            </span>
          </Button>

          {/* Install App button */}
          <Button
            variant="ghost"
            onClick={handleInstallClick}
            className="flex flex-col items-center justify-center h-full px-2 py-2 rounded-none text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
            disabled={!isInstallable}
          >
            <Download className="h-5 w-5 mb-1" />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Install" : "តំឡើង"}
            </span>
          </Button>

          {/* Cart Button */}
          <Button
            variant="ghost"
            onClick={onCartClick}
            className="flex flex-col items-center justify-center h-full px-2 py-2 rounded-none text-gray-600 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 relative"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 mb-1" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </div>
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Cart" : "កន្ត្រក"}
            </span>
          </Button>
        </div>
      </nav>
    </>
  )
}
