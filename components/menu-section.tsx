"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  description: string
  options?: Record<string, Array<{ name: string; price: number }>>
  discount?: number // Added discount property for discount badges
}

interface MenuSectionProps {
  products: Product[]
  onProductClick: (product: Product) => void
  language: "en" | "kh"
}

const categories = [
  { id: "all", name: { en: "All", kh: "ទាំងអស់" } },
  { id: "coffee", name: { en: "Coffee", kh: "កាហ្វេ" } },
  { id: "tea", name: { en: "Tea", kh: "តែ" } },
  { id: "noodles", name: { en: "Noodles", kh: "មី" } },
  { id: "european-breakfast", name: { en: "European Breakfast", kh: "អាហារពេលព្រឹកអឺរ៉ុប" } },
  { id: "khmer-breakfast", name: { en: "Khmer Breakfast", kh: "អាហារពេលព្រឹកខ្មែរ" } },
  { id: "salads", name: { en: "Salads", kh: "សាលាដ" } },
  { id: "pizza", name: { en: "Pizza", kh: "ភីហ្សា" } },
  { id: "sandwiches", name: { en: "Sandwiches", kh: "នំបុ័ង" } },
  { id: "pastries", name: { en: "Pastries", kh: "នំកេក" } },
  { id: "desserts", name: { en: "Desserts", kh: "បង្អែម" } },
  { id: "beverages", name: { en: "Beverages", kh: "ភេសជ្ជៈ" } },
]

export function MenuSection({ products, onProductClick, language }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const filteredProducts = useMemo(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered
  }, [products, searchQuery])

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {}

    if (selectedCategory === "all") {
      filteredProducts.forEach((product) => {
        if (!grouped[product.category]) {
          grouped[product.category] = []
        }
        grouped[product.category].push(product)
      })
    } else {
      grouped[selectedCategory] = filteredProducts.filter((product) => product.category === selectedCategory)
    }

    return grouped
  }, [filteredProducts, selectedCategory])

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  return (
    <section className="py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="sticky top-16 sm:top-18 z-40 bg-gray-50 py-6 mb-8">
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 px-6 py-2.5 h-auto transition-all duration-200 border-2 ${
                    selectedCategory === category.id
                      ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                      : "border-amber-200 text-amber-600 bg-white hover:bg-amber-50 hover:border-amber-300"
                  }`}
                >
                  {category.name[language]}
                </Button>
              ))}
            </div>
          </div>

          <div className="max-w-md mx-auto px-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-gray-200 focus:border-amber-300 focus:ring-amber-200 rounded-lg bg-white focus:bg-white text-base"
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-600 text-sm">
            {Object.values(productsByCategory).flat().length} {language === "en" ? "items found" : "ធាតុបានរកឃើញ"}
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            if (categoryProducts.length === 0) return null

            const categoryInfo = categories.find((cat) => cat.id === categoryId)
            const categoryName = categoryInfo?.name[language] || categoryId.toUpperCase()

            return (
              <div key={categoryId} className="space-y-6">
                <div className="text-center relative">
                  <div className="flex items-center justify-center">
                    <div className="flex-1 h-px bg-gray-300 max-w-32"></div>
                    <h3 className="font-bold text-xl md:text-2xl text-black mx-6 tracking-wider">{categoryName}</h3>
                    <div className="flex-1 h-px bg-gray-300 max-w-32"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-200 hover:shadow-lg border-0 bg-white rounded-lg overflow-hidden shadow-sm"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden bg-gray-100">
                          {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {product.discount}% OFF
                            </div>
                          )}

                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-48 sm:h-56 md:h-64 w-full object-cover"
                          />
                          <button
                            onClick={(e) => toggleFavorite(product.id, e)}
                            className="absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                            />
                          </button>
                        </div>

                        <div className="p-4 space-y-2">
                          <p className="text-xs text-gray-500 font-medium">ID: {String(product.id).padStart(4, "0")}</p>

                          <h4 className="font-bold text-base text-black line-clamp-2 leading-relaxed uppercase">
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-500">${product.price.toFixed(2)}</span>
                            <span className="text-sm text-red-500 font-medium">
                              KHR {(product.price * 4000).toLocaleString()}
                            </span>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              onProductClick(product)
                            }}
                            className="w-full mt-3 bg-black hover:bg-gray-900 text-white text-sm font-medium py-2 rounded-md transition-colors duration-200"
                          >
                            {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {Object.keys(productsByCategory).length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">
                {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
