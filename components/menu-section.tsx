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
    <section className="py-8 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="sticky top-16 sm:top-18 z-40 bg-white border-b border-gray-100 py-6 mb-8">
          {/* Category Filter - RedBox Restaurant Style */}
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

          {/* Search Bar */}
          <div className="max-w-md mx-auto px-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-gray-200 focus:border-amber-300 focus:ring-amber-200 rounded-lg bg-gray-50 focus:bg-white text-base"
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
                  <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-2">{categoryName}</h3>
                  <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {categoryProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300 bg-white rounded-lg overflow-hidden"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="h-32 sm:h-36 md:h-44 lg:h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <Badge className="bg-white text-gray-900 border border-gray-200 font-semibold text-xs sm:text-sm shadow-sm px-2 sm:px-3 py-1 rounded-full">
                              ${product.price.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                          <h4 className="font-semibold text-sm sm:text-base md:text-lg text-gray-900 line-clamp-2 leading-tight">
                            {product.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed hidden sm:block">
                            {product.description}
                          </p>
                          <Button
                            size="sm"
                            className="w-full h-8 sm:h-9 md:h-10 bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs sm:text-sm rounded-lg border-0"
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
