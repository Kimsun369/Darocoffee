"use client"

import { useState } from "react"
import { ShoppingCart, Menu, X, Coffee, Search, Globe, User, Heart, Truck, RotateCcw } from "lucide-react"
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

  const promotionalItems = [
    {
      icon: <Truck className="h-4 w-4" />,
      text: language === "en" ? "FREE DELIVERY OVER $20" : "ដឹកជញ្ជូនឥតគិតថ្លៃលើស $20",
    },
    {
      icon: <Coffee className="h-4 w-4" />,
      text: language === "en" ? "FRESH ROASTED DAILY" : "អាំងស្រស់ប្រចាំថ្ងៃ",
    },
    {
      icon: <RotateCcw className="h-4 w-4" />,
      text: language === "en" ? "100% SATISFACTION GUARANTEE" : "ការធានា 100% ពេញចិត្ត",
    },
  ]

  const mainNavigation = [
    { name: language === "en" ? "HOME" : "ទំព័រដើម", href: "#home" },
    { name: language === "en" ? "MENU" : "ម៉ឺនុយ", href: "#menu" },
    { name: language === "en" ? "ABOUT" : "អំពីយើង", href: "#about" },
    { name: language === "en" ? "CONTACT" : "ទំនាក់ទំនង", href: "#contact", special: true },
  ]

  return (
    <>
      <div className="bg-black text-white py-2 text-xs">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between space-x-4 overflow-x-auto">
            {promotionalItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
                {item.icon}
                <span className={`font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-18 items-center justify-between">
            <nav className="hidden lg:flex items-center space-x-8">
              {mainNavigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-amber-600 ${
                    item.special ? "text-red-500 hover:text-red-600" : "text-gray-900"
                  } ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-amber-600 flex items-center justify-center">
                <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">DARO'S</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search icon */}
              <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-lg hover:bg-gray-100">
                <Search className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Language/Globe icon */}
              <div className="hidden sm:flex">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onLanguageChange(language === "en" ? "kh" : "en")}
                  className="h-10 w-10 rounded-lg hover:bg-gray-100"
                >
                  <Globe className="h-5 w-5 text-gray-700" />
                </Button>
              </div>

              {/* User icon */}
              <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-lg hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Heart/Favorites icon */}
              <Button variant="ghost" size="icon" className="hidden sm:flex h-10 w-10 rounded-lg hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Cart icon */}
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

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden h-10 w-10 sm:h-11 sm:w-11 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />

          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-600 flex items-center justify-center">
                    <Coffee className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-serif text-lg font-bold text-gray-900">DARO'S</span>
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

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto p-4">
                <nav className="space-y-2">
                  {mainNavigation.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`block py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                        item.special ? "text-red-500 hover:bg-red-50" : "text-gray-900 hover:bg-gray-50"
                      } ${language === "kh" ? "font-mono" : "font-sans"}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                {/* Mobile action icons section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3
                    className={`text-sm font-medium text-gray-500 mb-3 ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "ACTIONS" : "សកម្មភាព"}
                  </h3>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full justify-start py-3 px-4 text-lg font-medium rounded-lg hover:bg-gray-50 text-gray-900 ${language === "kh" ? "font-mono" : "font-sans"}`}
                    >
                      <Search className="h-5 w-5 mr-3 text-gray-700" />
                      {language === "en" ? "Search" : "ស្វែងរក"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full justify-start py-3 px-4 text-lg font-medium rounded-lg hover:bg-gray-50 text-gray-900 ${language === "kh" ? "font-mono" : "font-sans"}`}
                    >
                      <User className="h-5 w-5 mr-3 text-gray-700" />
                      {language === "en" ? "Account" : "គណនី"}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`w-full justify-start py-3 px-4 text-lg font-medium rounded-lg hover:bg-gray-50 text-gray-900 ${language === "kh" ? "font-mono" : "font-sans"}`}
                    >
                      <Heart className="h-5 w-5 mr-3 text-gray-700" />
                      {language === "en" ? "Favorites" : "ចូលចិត្ត"}
                    </Button>
                  </div>
                </div>

                {/* Language selector */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3
                    className={`text-sm font-medium text-gray-500 mb-3 ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "LANGUAGE" : "ភាសា"}
                  </h3>
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
            </div>
          </div>
        </div>
      )}
    </>
  )
}
