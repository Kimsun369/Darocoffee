"use client"

import { Home, Coffee, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onInstallPrompt
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
    switch(action) {
      case "contact":
        onNavigate("contact");
        break;
      case "install":
        onInstallPrompt();
        break;
      case "language":
        onLanguageChange(language === "en" ? "kh" : "en");
        break;
      case "favorites":
        onNavigate("favorites");
        break;
      default:
        break;
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navigationItems.map((item) => (
          item.isDropdown ? (
            <DropdownMenu key={item.id}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex flex-col items-center justify-center h-full w-full rounded-none ${
                    currentSection === item.id 
                      ? "text-amber-600 bg-amber-50" 
                      : "text-gray-600 hover:text-amber-600"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="top" className="mb-2 w-48">
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleMoreAction("contact")}
                >
                  <span>{language === "en" ? "Contact" : "ទំនាក់ទំនង"}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleMoreAction("install")}
                >
                  <span>{language === "en" ? "Install App" : "តំឡើង App"}</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleMoreAction("language")}
                >
                  <span>
                    {language === "en" 
                      ? "Switch to Khmer" 
                      : "ប្តូរទៅភាសាអង់គ្លេស"}
                  </span>
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleMoreAction("favorites")}
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
              className={`flex flex-col items-center justify-center h-full w-full rounded-none ${
                currentSection === item.id 
                  ? "text-amber-600 bg-amber-50" 
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => item.id === "cart" ? onCartClick() : onNavigate(item.id)}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.hasBadge && cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 min-w-0 p-0 text-xs flex items-center justify-center bg-red-500 text-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          )
        ))}
      </div>
    </div>
  )
}