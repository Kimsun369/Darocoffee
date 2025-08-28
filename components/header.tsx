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
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-amber-200/30 shadow-lg shadow-amber-100/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-amber-200/50">
              <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-sm" />
            </div>
            <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 bg-clip-text text-transparent">
              Daro's Coffee
            </h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Toggle with Modern Glass Effect */}
            <div className="hidden sm:flex items-center space-x-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-1 border border-amber-200/40 shadow-lg shadow-amber-100/20">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className={`text-xs px-3 h-8 rounded-lg transition-all duration-300 ${
                  language === "en"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                }`}
              >
                🇬🇧
              </Button>
              <Button
                variant={language === "kh" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("kh")}
                className={`text-xs px-3 h-8 rounded-lg transition-all duration-300 ${
                  language === "kh"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                }`}
              >
                🇰🇭
              </Button>
            </div>

            {/* Cart Icon with Modern Styling */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl hover:bg-amber-50/80 dark:hover:bg-amber-900/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-200/30"
            >
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-700 dark:text-amber-300" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-2 border-white dark:border-gray-900 shadow-lg shadow-red-500/30 animate-pulse">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden h-10 w-10 rounded-xl hover:bg-amber-50/80 dark:hover:bg-amber-900/20 transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-amber-700 dark:text-amber-300" />
              ) : (
                <Menu className="h-5 w-5 text-amber-700 dark:text-amber-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu with Glass Effect */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-amber-200/30 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl -mx-4 px-4 shadow-lg shadow-amber-100/20">
            <div className="flex items-center justify-center space-x-3">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  onLanguageChange("en")
                  setMobileMenuOpen(false)
                }}
                className={`rounded-lg transition-all duration-300 ${
                  language === "en"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300"
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
                className={`rounded-lg transition-all duration-300 ${
                  language === "kh"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/30"
                    : "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-300"
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
