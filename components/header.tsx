"use client"

import { useState, useEffect } from "react"
import { Coffee, Globe, Laugh, Download, Home, Menu, Phone, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FOOTER_CONFIG } from "@/config/footer-config"
import { COLORS } from "@/config/color-config"

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

  // Navigation items configuration
  const navItems = [
    {
      id: "top",
      icon: Home,
      label: {
        en: "Home",
        kh: "ទំព័រដើម"
      }
    },
    {
      id: "menu",
      icon: Menu,
      label: {
        en: "Menu",
        kh: "ម្ហូប"
      }
    },
    {
      id: "contact",
      icon: Phone,
      label: {
        en: "Contact",
        kh: "ទំនាក់ទំនង"
      }
    },
    {
      id: "install",
      icon: Download,
      label: {
        en: "Install",
        kh: "តំឡើង"
      },
      onClick: handleInstallClick
    },
    {
      id: "cart",
      icon: ShoppingCart,
      label: {
        en: "Cart",
        kh: "កន្ត្រក"
      },
      onClick: onCartClick,
      badge: cartItemCount
    }
  ]

  // Apply the same background color as footer
  const headerBackgroundStyle = {
    backgroundColor: COLORS.primary[100],
  }

  const promotionalBarStyle = {
    backgroundColor: COLORS.primary[700],
  }

  // Dynamic color for active state
  const activeColor = COLORS.primary[600]

  return (
    <>
      {/* Promotional Bar - Same background family */}
      <div 
        className="text-white py-2.5 text-xs overflow-hidden" 
        style={promotionalBarStyle}
      >
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

      {/* Main Header - Same background as footer */}
      <header
        className="sticky top-0 z-40 w-full border-b"
        style={headerBackgroundStyle}
      >
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
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ backgroundColor: COLORS.primary[600] }}
                >
                  <Coffee className="h-5 w-5 text-white" />
                </div>
                <h1 className="font-serif text-xl font-bold text-grey">
                  {FOOTER_CONFIG.COMPANY.NAME}
                </h1>
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onLanguageChange(language === "en" ? "kh" : "en")}
                className="h-10 w-10 rounded-xl hover:bg-white/10 transition-colors text-grey"
              >
                <Globe className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleInstallClick}
                className="h-10 w-10 rounded-xl hover:bg-white/10 transition-colors text-black"
                title={language === "en" ? "Install App" : "តំឡើងកម្មវិធី"}
              >
                <Download className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Install Prompt - Updated to match theme */}
      {showInstallPrompt && (
        <div
          className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 rounded-2xl shadow-xl p-5 max-w-sm mx-4 border ${
            language === "kh" ? "font-mono" : "font-sans"
          }`}
          style={{
            backgroundColor: COLORS.primary[800],
            borderColor: COLORS.primary[600],
            color: COLORS.text.inverse,
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-grey">
              {language === "en" ? "Install Fresthie's Coffee App" : "តំឡើងកម្មវិធី Fresthie's Coffee"}
            </h3>
            <button
              onClick={handleDismissInstall}
              className="hover:text-gray-300 transition-colors text-grey"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm mb-4 leading-relaxed text-gray-200">
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
              className="flex-1 text-white rounded-xl h-11 transition-colors"
              style={{
                backgroundColor: COLORS.primary[600],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary[700]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary[600]
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              {language === "en" ? "Install" : "តំឡើង"}
            </Button>
            <Button
              onClick={handleDismissInstall}
              variant="outline"
              className="rounded-xl h-11 hover:bg-white/10 transition-colors bg-transparent text-white border-white/30"
            >
              {language === "en" ? "Not Now" : "មិនមែនឥឡូវ"}
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Fixed with proper active states */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t shadow-lg"
        style={headerBackgroundStyle}
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            const IconComponent = item.icon;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.id !== "install" && item.id !== "cart") {
                    onScrollToSection(item.id);
                  }
                }}
                className={`flex flex-col items-center justify-center h-full px-2 py-2 rounded-none transition-all relative group ${
                  isActive ? "text-white" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full"
                    style={{ backgroundColor: activeColor }}
                  />
                )}

                {/* Icon with active state */}
                <div className="relative">
                  <IconComponent 
                    className={`h-5 w-5 mb-1 transition-colors ${
                      isActive ? "fill-current" : ""
                    }`}
                    style={isActive ? { color: activeColor } : {}}
                  />
                  
                  {/* Badge for cart */}
                  {item.badge && item.badge > 0 && (
                    <span
                      className="absolute -top-2 -right-2 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm"
                      style={{ backgroundColor: COLORS.semantic.error }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label with active state */}
                <span 
                  className={`text-xs font-medium transition-colors ${
                    language === "kh" ? "font-mono" : "font-sans"
                  } ${isActive ? "font-semibold" : ""}`}
                  style={isActive ? { color: activeColor } : {}}
                >
                  {item.label[language]}
                </span>

                {/* Hover effect */}
                <div 
                  className={`absolute inset-0 rounded-lg transition-opacity ${
                    isActive ? "opacity-10" : "opacity-0 group-hover:opacity-5"
                  }`}
                  style={{ backgroundColor: activeColor }}
                />
              </Button>
            );
          })}
        </div>
      </nav>
    </>
  )
}