"use client"

import { useState } from "react"
import { ShoppingCart, Menu, X, Coffee, Search, ChevronRight, Star, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  cartItemCount: number
  onCartClick: () => void
  language: "en" | "kh"
  onLanguageChange: (lang: "en" | "kh") => void
}

export function Header({ cartItemCount, onCartClick, language, onLanguageChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationItems = [
    { name: language === "en" ? "New" : "ថ្មី", href: "#new" },
    { name: language === "en" ? "Hot Drinks" : "ភេសជ្ជៈក្តៅ", href: "#hot-drinks" },
    { name: language === "en" ? "Cold Drinks" : "ភេសជ្ជៈត្រជាក់", href: "#cold-drinks" },
    { name: language === "en" ? "Pastries" : "នំ", href: "#pastries" },
    { name: language === "en" ? "Snacks" : "អាហារសម្រន់", href: "#snacks" },
    { name: language === "en" ? "Breakfast" : "អាហារពេលព្រឹក", href: "#breakfast" },
  ]

  const specialSections = [
    {
      name: language === "en" ? "Featured" : "ពិសេស",
      icon: <Star className="h-5 w-5" />,
      href: "#featured",
    },
    {
      name: language === "en" ? "Loyalty Program" : "កម្មវិធីភក្តីភាព",
      icon: <Gift className="h-5 w-5" />,
      href: "#loyalty",
    },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-amber-600 flex items-center justify-center">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Daro's Coffee</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="hidden sm:flex items-center space-x-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
                <Button
                  variant={language === "en" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLanguageChange("en")}
                  className={`text-xs px-3 h-8 rounded-md ${
                    language === "en" ? "bg-amber-600 hover:bg-amber-700 text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  🇬🇧
                </Button>
                <Button
                  variant={language === "kh" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLanguageChange("kh")}
                  className={`text-xs px-3 h-8 rounded-md ${
                    language === "kh" ? "bg-amber-600 hover:bg-amber-700 text-white" : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  🇰🇭
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onCartClick}
                className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -right-2 -top-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 text-xs font-bold bg-red-500 hover:bg-red-600 border-2 border-white">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </Badge>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />

          {/* Navigation Panel */}
          <div className="relative ml-auto h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-600 flex items-center justify-center">
                    <Coffee className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-serif text-lg font-bold text-gray-900">Daro's Coffee</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-lg hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </Button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={language === "en" ? "Search menu..." : "ស្វែងរកម្ហូប..."}
                    className="pl-10 h-12 rounded-lg border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Navigation Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation */}
                <div className="p-4">
                  <nav className="space-y-1">
                    {navigationItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between py-3 px-2 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Special Sections */}
                <div className="border-t border-gray-200 p-4">
                  <div className="space-y-1">
                    {specialSections.map((section) => (
                      <a
                        key={section.href}
                        href={section.href}
                        className="flex items-center space-x-3 py-3 px-2 text-lg font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {section.icon}
                        <span>{section.name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Language Selector (Mobile) */}
                <div className="sm:hidden border-t border-gray-200 p-4">
                  <div className="space-y-2">
                    <Button
                      variant={language === "en" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        onLanguageChange("en")
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full justify-start rounded-lg ${
                        language === "en"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "hover:bg-gray-100 text-gray-700"
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
                      className={`w-full justify-start rounded-lg ${
                        language === "kh"
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      🇰🇭 ខ្មែរ
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="border-t border-gray-200 p-4">
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    {language === "en"
                      ? "Join our loyalty program and get the best coffee, exclusive offers, and rewards."
                      : "ចូលរួមកម្មវិធីភក្តីភាពរបស់យើង ហើយទទួលបានកាហ្វេល្អបំផុត ការផ្តល់ជូនពិសេស និងរង្វាន់។"}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === "en" ? "Join Now" : "ចូលរួមឥឡូវ"}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg bg-transparent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {language === "en" ? "Learn More" : "ស្វែងយល់បន្ថែម"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
