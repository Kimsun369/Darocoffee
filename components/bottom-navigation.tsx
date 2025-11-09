"use client"

import { Home, Coffee, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface BottomNavigationProps {
  cartItemCount: number
  currentSection: string
  onNavigate: (section: string) => void
  onCartClick: () => void
  language: "en" | "kh"
  onLanguageChange: (language: "en" | "kh") => void
  onInstallPrompt: () => void
}

export function BottomNavigation({
  cartItemCount,
  currentSection,
  onNavigate,
  onCartClick,
  language,
  onLanguageChange,
  onInstallPrompt,
}: BottomNavigationProps) {
  const navigationItems = [
    {
      id: "top",
      icon: Home,
      label: language === "en" ? "Home" : "ទំព័រដើម",
    },
    {
      id: "menu",
      icon: Coffee,
      label: language === "en" ? "Menu" : "ម៉ឺនុយ",
    },
    {
      id: "more",
      icon: Menu,
      label: language === "en" ? "More" : "More",
      isDropdown: true,
    },
    {
      id: "cart",
      icon: ShoppingCart,
      label: language === "en" ? "Cart" : "កន្ត្រក",
      hasBadge: true,
    },
    {
      id: "account",
      icon: User,
      label: language === "en" ? "Account" : "គណនី",
    },
  ]

  const handleMoreAction = (action: string) => {
    switch (action) {
      case "contact":
        onNavigate("contact")
        break
      case "install":
        onInstallPrompt()
        break
      case "language":
        onLanguageChange(language === "en" ? "kh" : "en")
        break
      case "favorites":
        onNavigate("favorites")
        break
      default:
        break
    }
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t"
        style={{
          backgroundColor: "white",
          borderColor: "#fbbf24",
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.1)",
          animation: "slideUp 0.4s ease-out",
        }}
      >
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item, index) =>
            item.isDropdown ? (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex flex-col items-center justify-center h-full w-full rounded-none transition-all duration-300"
                    style={{
                      color: currentSection === item.id ? "#d97706" : "#6b7280",
                      backgroundColor: currentSection === item.id ? "#fef3c7" : "transparent",
                      animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs mt-1">{item.label}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  side="top"
                  className="mb-2 w-48"
                  style={{
                    backgroundColor: "white",
                    border: "2px solid #fbbf24",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleMoreAction("contact")}
                    style={{ color: "#1f2937" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef3c7"
                      e.currentTarget.style.color = "#d97706"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "#1f2937"
                    }}
                  >
                    <span>{language === "en" ? "Contact" : "ទំនាក់ទំនង"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleMoreAction("install")}
                    style={{ color: "#1f2937" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef3c7"
                      e.currentTarget.style.color = "#d97706"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "#1f2937"
                    }}
                  >
                    <span>{language === "en" ? "Install App" : "តំឡើង App"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleMoreAction("language")}
                    style={{ color: "#1f2937" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef3c7"
                      e.currentTarget.style.color = "#d97706"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "#1f2937"
                    }}
                  >
                    <span>{language === "en" ? "Switch to Khmer" : "ប្តូរទៅភាសាអង់គ្លេស"}</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleMoreAction("favorites")}
                    style={{ color: "#1f2937" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef3c7"
                      e.currentTarget.style.color = "#d97706"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                      e.currentTarget.style.color = "#1f2937"
                    }}
                  >
                    <span>{language === "en" ? "Favorites" : "ចូលចិត្ត"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                className="flex flex-col items-center justify-center h-full w-full rounded-none transition-all duration-300"
                style={{
                  color: currentSection === item.id ? "#d97706" : "#6b7280",
                  backgroundColor: currentSection === item.id ? "#fef3c7" : "transparent",
                  animation: `fadeIn 0.4s ease-out ${index * 0.1}s both`,
                }}
                onClick={() => (item.id === "cart" ? onCartClick() : onNavigate(item.id))}
                onMouseEnter={(e) => {
                  if (currentSection !== item.id) {
                    e.currentTarget.style.color = "#d97706"
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentSection !== item.id) {
                    e.currentTarget.style.color = "#6b7280"
                    e.currentTarget.style.transform = "translateY(0)"
                  }
                }}
              >
                {/* <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.hasBadge && cartItemCount > 0 && (
                    <div
                      className="absolute -top-2 -right-2 h-5 w-5 min-w-0 text-xs flex items-center justify-center rounded-full font-bold"
                      style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        animation: "pulse-badge 2s ease-in-out infinite",
                        boxShadow: "0 2px 8px rgba(239, 68, 68, 0.4)",
                      }}
                    >
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </div>
                  )}
                </div> */}
                <span className="text-xs mt-1">{item.label}</span>
              </Button>
            ),
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </>
  )
}
