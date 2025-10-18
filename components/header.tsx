"use client"

import { useState, useEffect } from "react"
import { Coffee, Globe, Laugh, Download, Home, Menu, Phone, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FOOTER_CONFIG } from "@/config/footer-config"

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
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

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
    if (!installPrompt) {
      setShowInstallPrompt(true)
      return
    }

    installPrompt.prompt()

    const { outcome } = await installPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    setInstallPrompt(null)
    setIsInstallable(false)
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
  }

  const promotionalItems = [
    {
      icon: <Coffee className="h-4 w-4" />,
      text: language === "en" ? "FRESH ROASTED DAILY" : "អាំងស្រស់ប្រចាំថ្ងៃ",
    },
    {
      icon: <Laugh className="h-4 w-4" />,
      text: language === "en" ? "100% SATISFACTION GUARANTEE" : "ការធានា 100% ពេញចិត្ត",
    },
    {
      icon: <Globe className="h-4 w-4" />,
      text: language === "en" ? "TRUSTWORTHY DELIVERY" : "ការដឹកជញ្ជូន ដែលអាចទុកចិត្តបាន",
    },
  ]

  return (
    <>
      <div className="bg-amber-600 text-white py-2.5 text-xs overflow-hidden">
        <div className="flex whitespace-nowrap">
          <div className="flex animate-marquee space-x-8">
            {promotionalItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mx-8">
                {item.icon}
                <span className={`font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>{item.text}</span>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee space-x-8" aria-hidden="true">
            {promotionalItems.map((item, index) => (
              <div key={`dup-${index}`} className="flex items-center space-x-2 mx-8">
                {item.icon}
                <span className={`font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault()
                  onScrollToSection("top")
                }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="h-10 w-10 rounded-xl bg-amber-600 flex items-center justify-center transition-transform group-hover:scale-105">
                  <Coffee className="h-5 w-5 text-white" />
                </div>
                <h1 className="font-serif text-xl font-bold text-gray-900">{FOOTER_CONFIG.COMPANY.NAME}</h1>
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLanguageChange(language === "en" ? "kh" : "en")}
                className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-5 w-5 text-gray-700" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleInstallClick}
                className="h-10 w-10 rounded-xl hover:bg-gray-100 transition-colors"
                title={language === "en" ? "Install App" : "តំឡើងកម្មវិធី"}
              >
                <Download className="h-5 w-5 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showInstallPrompt && (
        <div
          className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl shadow-xl p-5 max-w-sm mx-4 border border-gray-200 ${
            language === "kh" ? "font-mono" : "font-sans"
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {language === "en" ? "Install Fresthie's Coffee App" : "តំឡើងកម្មវិធី Fresthie's Coffee"}
            </h3>
            <button onClick={handleDismissInstall} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {language === "en"
              ? "Install our app now for more convenient. Access your menu and orders quickly from your home screen."
              : "តំឡើងកម្មវិធីឥឡូវនេះសម្រាប់ភាពងាយស្រួល។ ចូលប្រើម៉ឺនុយ និងការកម្មង់របស់អ្នកយ៉ាងរហ័សពីអេក្រង់ដើមរបស់អ្នក។"}
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                  alert(
                    language === "en"
                      ? "Tap the share button and then 'Add to Home Screen'"
                      : "ចុចប៊ូតុងចែករំលែក ហើយបន្ទាប់មក 'Add to Home Screen'",
                  )
                }
                handleDismissInstall()
              }}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-11 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Install" : "តំឡើង"}
            </Button>
            <Button
              onClick={handleDismissInstall}
              variant="outline"
              className="border-gray-300 rounded-xl h-11 hover:bg-gray-50 transition-colors bg-transparent"
            >
              {language === "en" ? "Not Now" : "មិនមែនឥឡូវ"}
            </Button>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("top")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all ${
              currentSection === "top" ? "text-amber-600" : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
            }`}
          >
            <Home className={`h-5 w-5 mb-1 ${currentSection === "top" ? "fill-amber-600" : ""}`} />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Home" : "ទំព័រដើម"}
            </span>
            {currentSection === "top" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-600 rounded-t-full" />
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("menu")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all ${
              currentSection === "menu" ? "text-amber-600" : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
            }`}
          >
            <Menu className={`h-5 w-5 mb-1 ${currentSection === "menu" ? "fill-amber-600" : ""}`} />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Menu" : "ម្ហូប"}
            </span>
            {currentSection === "menu" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-600 rounded-t-full" />
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault()
              onScrollToSection("contact")
            }}
            className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all ${
              currentSection === "contact" ? "text-amber-600" : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
            }`}
          >
            <Phone className={`h-5 w-5 mb-1 ${currentSection === "contact" ? "fill-amber-600" : ""}`} />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Contact" : "ទំនាក់ទំនង"}
            </span>
            {currentSection === "contact" && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-amber-600 rounded-t-full" />
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={handleInstallClick}
            className="flex flex-col items-center justify-center h-full px-2 py-2 rounded-none text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-all"
          >
            <Download className="h-5 w-5 mb-1" />
            <span className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
              {language === "en" ? "Install" : "តំឡើង"}
            </span>
          </Button>

          <Button
            variant="ghost"
            onClick={onCartClick}
            className="flex flex-col items-center justify-center h-full px-2 py-2 rounded-none text-gray-600 hover:text-amber-600 hover:bg-gray-50 transition-all relative"
          >
            <div className="relative">
              <ShoppingCart className="h-5 w-5 mb-1" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
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
