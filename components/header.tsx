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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-amber-800 signature-font">Daro's Coffee</h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Toggle with Flags */}
            <div className="hidden sm:flex items-center space-x-1 bg-amber-50 rounded-lg p-1 border border-amber-200">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className={`text-xs px-3 h-8 ${language === "en" ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100"}`}
              >
                🇬🇧
              </Button>
              <Button
                variant={language === "kh" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("kh")}
                className={`text-xs px-3 h-8 ${language === "kh" ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100"}`}
              >
                🇰🇭
              </Button>
            </div>

            {/* Cart Icon */}
            <Button variant="ghost" size="icon" onClick={onCartClick} className="relative hover:bg-amber-50">
              <ShoppingCart className="h-5 w-5 text-amber-700" />
              {cartItemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs bg-amber-600 hover:bg-amber-700">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden hover:bg-amber-50"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-amber-700" /> : <Menu className="h-5 w-5 text-amber-700" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-amber-200 py-4 bg-amber-50/50">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant={language === "en" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("en")}
                className={language === "en" ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100"}
              >
                🇬🇧 English
              </Button>
              <Button
                variant={language === "kh" ? "default" : "ghost"}
                size="sm"
                onClick={() => onLanguageChange("kh")}
                className={language === "kh" ? "bg-amber-600 hover:bg-amber-700" : "hover:bg-amber-100"}
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
