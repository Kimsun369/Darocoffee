"use client"

import { useState } from "react"
import { ShoppingCart, Menu, X, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  cartItemCount: number
  onCartClick: () => void
  language: "en" | "kh"
  onLanguageChange: (lang: "en" | "kh") => void
}

export function Header({ cartItemCount, onCartClick, language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-amber-600 flex items-center justify-center">
              <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-amber-800 dark:text-amber-200">
              Daro's Coffee
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className={`text-xs px-3 h-8 rounded-md ${
                  language === "en"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                🇬🇧
              </Button>
              <Button
                variant={language === "kh" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("kh")}
                className={`text-xs px-3 h-8 rounded-md ${
                  language === "kh"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                🇰🇭
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700 dark:text-amber-300" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs font-bold bg-red-600 text-white border-2 border-white dark:border-gray-900">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden h-10 w-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-amber-700 dark:text-amber-300" />
              ) : (
                <Menu className="h-5 w-5 text-amber-700 dark:text-amber-300" />
              )}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 py-4 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  onLanguageChange("en")
                  setMobileMenuOpen(false)
                }}
                className={`rounded-lg ${
                  language === "en"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                🇬🇧 English
              </Button>
              <Button
                variant={language === "kh" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  onLanguageChange("kh")
                  setMobileMenuOpen(false)
                }}
                className={`rounded-lg ${
                  language === "kh"
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                🇰🇭 ខ្មែរ
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
