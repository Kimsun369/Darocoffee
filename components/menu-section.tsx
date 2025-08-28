"use client"

import { useState, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  description: string
  options?: Record<string, Array<{ name: string; price: number }>>
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
      // Group all products by their categories
      filteredProducts.forEach((product) => {
        if (!grouped[product.category]) {
          grouped[product.category] = []
        }
        grouped[product.category].push(product)
      })
    } else {
      // Show only selected category
      grouped[selectedCategory] = filteredProducts.filter((product) => product.category === selectedCategory)
    }

    return grouped
  }, [filteredProducts, selectedCategory])

  return (
    <section className="py-8 px-4 bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl">
        <div className="sticky top-16 sm:top-18 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-amber-200/30 dark:border-gray-700/30 rounded-2xl py-6 mb-8 shadow-xl shadow-amber-100/20 dark:shadow-gray-900/20">
          {/* Category Filter */}
          <div className="mb-6 px-6">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 px-4 py-2 transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30 border-0"
                      : "border-amber-300/60 dark:border-amber-600/40 text-amber-700 dark:text-amber-300 bg-white/60 dark:bg-gray-800/60 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-400/80 shadow-md backdrop-blur-sm"
                  }`}
                >
                  {category.name[language]}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto px-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/70 dark:text-amber-400/70" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-amber-200/60 dark:border-gray-600/60 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md text-base placeholder:text-amber-600/50 dark:placeholder:text-amber-400/50"
              />
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            if (categoryProducts.length === 0) return null

            const categoryInfo = categories.find((cat) => cat.id === categoryId)
            const categoryName = categoryInfo?.name[language] || categoryId.toUpperCase()

            return (
              <div key={categoryId} className="space-y-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-6 mb-10">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-amber-500/80 max-w-24"></div>
                    <div className="relative">
                      <h3 className="font-bold text-2xl md:text-3xl lg:text-4xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 bg-clip-text text-transparent uppercase tracking-wider px-4 whitespace-nowrap">
                        {categoryName}
                      </h3>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-300/60 to-amber-500/80 max-w-24"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/30 dark:hover:shadow-amber-900/20 hover:-translate-y-2 border border-amber-200/40 dark:border-gray-700/40 hover:border-amber-300/60 dark:hover:border-amber-600/40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-[1.02]"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-32 sm:h-36 md:h-44 lg:h-48 w-full object-cover transition-all duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <Badge className="bg-white/95 dark:bg-gray-900/95 text-amber-800 dark:text-amber-200 border border-amber-200/50 dark:border-amber-600/50 font-bold text-xs sm:text-sm shadow-lg backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                              ${product.price.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                          <h4 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100 line-clamp-2 text-balance leading-tight group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors duration-300">
                            {product.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed hidden sm:block">
                            {product.description}
                          </p>
                          <Button
                            size="sm"
                            className="w-full h-8 sm:h-9 md:h-10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/40 rounded-xl border-0 hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation()
                              onProductClick(product)
                            }}
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                            <span className="truncate text-xs sm:text-sm">
                              {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
                            </span>
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
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-amber-200/40 dark:border-gray-700/40 shadow-lg max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                <Search className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
