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
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="sticky top-0 z-10 bg-white/98 backdrop-blur-md border-b border-gray-200 py-4 mb-8 -mx-4 px-4 shadow-sm">
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-1">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 px-4 py-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md border-amber-600"
                      : "border-amber-600/40 text-amber-700 bg-white hover:bg-amber-50 hover:border-amber-600/60 shadow-sm"
                  }`}
                >
                  {category.name[language]}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-amber-600 focus:ring-amber-600/20 rounded-full bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            if (categoryProducts.length === 0) return null

            const categoryInfo = categories.find((cat) => cat.id === categoryId)
            const categoryName = categoryInfo?.name[language] || categoryId.toUpperCase()

            return (
              <div key={categoryId} className="space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-amber-600 max-w-20"></div>
                    <h3 className="font-bold text-xl md:text-2xl text-amber-800 uppercase tracking-wider px-2 whitespace-nowrap">
                      {categoryName}
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-300 to-amber-600 max-w-20"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 hover:border-amber-300 bg-white rounded-xl overflow-hidden"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-32 md:h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/95 text-amber-800 border border-amber-200 font-bold text-xs md:text-sm shadow-lg backdrop-blur-sm">
                              ${product.price.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <h4 className="font-bold text-sm md:text-base text-gray-900 line-clamp-2 text-balance leading-tight">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2 hidden md:block leading-relaxed">
                            {product.description}
                          </p>
                          <Button
                            size="sm"
                            className="w-full h-8 md:h-9 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs md:text-sm shadow-md transition-all duration-200 hover:shadow-lg rounded-lg border-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              onProductClick(product)
                            }}
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}</span>
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
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
