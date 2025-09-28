"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Search, Heart, Plus, ChevronRight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: number
  name: string
  name_kh: string
  image: string
  price: number
  category: string
  category_kh: string
  description: string
  description_kh: string
  category_description?: string
  category_description_kh?: string
  options?: Record<string, Array<{ name: string; price: number }>>
  discount?: number
  originalPrice?: number
  isDiscounted?: boolean
}

interface Discount {
  id: string | number
  discountName: string
  productName: string
  duplicateCheck: string
  discountPercent: number
  originalPrice: number
  isActive: boolean
  calculatedPrice: number | string
}

interface MenuSectionProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
  language: "en" | "kh"
}

// Define your categories with both English and Khmer names
const categories = [
  { id: "all", name: { en: "All", kh: "ទាំងអស់" } },
  { id: "coffee", name: { en: "Coffee", kh: "កាហ្វេ" } },
  { id: "tea", name: { en: "Tea", kh: "តែ" } },
  { id: "dessert", name: { en: "Dessert", kh: "បង្អែម" } },
  { id: "bakery", name: { en: "Bakery", kh: "នំប៉័ង" } },
  { id: "rice", name: { en: "Rice", kh: "បាយ" } },
  { id: "noodle", name: { en: "Noodle", kh: "មី" } },
]

export function MenuSection({ products, onProductClick, onAddToCart, language }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [categoriesFromSheet, setCategoriesFromSheet] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [discountsLoading, setDiscountsLoading] = useState(true)

  // Load categories from Google Sheets
  useEffect(() => {
    async function loadCategories() {
      try {
        const SHEET_ID = "1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU"
        const url = `https://opensheet.elk.sh/${SHEET_ID}/Categories`

        const response = await fetch(url)

        if (response.ok) {
          const data = await response.json()
          setCategoriesFromSheet(data)
          console.log("Categories loaded from sheet:", data)
        } else {
          console.error("Failed to load categories sheet")
        }
      } catch (error) {
        console.error("Error loading categories from sheet:", error)
      }
    }

    loadCategories()
  }, [])

  // Load discounts from Google Sheets
  useEffect(() => {
    async function loadDiscounts() {
      try {
        // Import the discount function from our data file
        const mod = await import("@/data/google-sheet.data")
        const discountData = await mod.fetchDiscountsFromGoogleSheet()
        setDiscounts(discountData)
        console.log("Discounts loaded:", discountData)
      } catch (error) {
        console.error("Error loading discounts:", error)
      } finally {
        setDiscountsLoading(false)
      }
    }

    loadDiscounts()
  }, [])

  // Map Google Sheet categories to your predefined category IDs
  const mapCategoryToId = (categoryName: string): string => {
    const lowerCategory = categoryName.toLowerCase().trim()

    const categoryMap: Record<string, string> = {
      coffee: "coffee",
      tea: "tea",
      dessert: "dessert",
      bakery: "bakery",
      rice: "rice",
      noodle: "noodle",
    }

    return categoryMap[lowerCategory] || lowerCategory
  }

  // Get image URL for a category
  const getCategoryImage = (categoryId: string): string => {
    if (categoryId === "all") return ""

    const sheetCategory = categoriesFromSheet.find(
      (cat) => mapCategoryToId(cat.Category || cat.category) === categoryId,
    )

    console.log("Looking for category:", categoryId, "Found:", sheetCategory)

    return sheetCategory?.["Image URL"] || sheetCategory?.["image url"] || ""
  }

  // Enhance products with discount information
  const productsWithDiscounts = useMemo(() => {
    if (!discounts.length) return products

    return products.map(product => {
      // Find active discounts for this product - IMPROVED MATCHING LOGIC
      const productDiscounts = discounts.filter(discount => {
        if (!discount.isActive) return false
        
        // Clean and compare product names (case insensitive, trim whitespace)
        const discountProductName = discount.productName?.toLowerCase().trim() || ''
        const productName = product.name.toLowerCase().trim()
        
        // Debug logging
        console.log('Discount matching:', {
          productName: product.name,
          discountProductName: discount.productName,
          matches: productName === discountProductName,
          productNameLower: productName,
          discountProductNameLower: discountProductName
        })
        
        // Also check if product name contains discount product name or vice versa
        return productName === discountProductName || 
              productName.includes(discountProductName) ||
              discountProductName.includes(productName)
      })

      if (productDiscounts.length > 0) {
        console.log('FOUND DISCOUNT for product:', product.name, 'Discount:', productDiscounts[0])
        // Take the first active discount
        const discount = productDiscounts[0]
        
        // Calculate discounted price safely
        const discountPercent = discount.discountPercent || 0
        const originalPrice = discount.originalPrice > 0 ? discount.originalPrice : product.price
        const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100))

        return {
          ...product,
          originalPrice: originalPrice,
          price: discountedPrice,
          discount: discountPercent,
          isDiscounted: true
        }
      } else {
        console.log('NO DISCOUNT for product:', product.name)
      }

      return product
    })
  }, [products, discounts])



  const filteredProducts = useMemo(() => {
    let filtered = productsWithDiscounts

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.name_kh.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description_kh.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => mapCategoryToId(product.category) === selectedCategory)
    }

    return filtered
  }, [productsWithDiscounts, searchQuery, selectedCategory])

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {}

    if (selectedCategory === "all") {
      filteredProducts.forEach((product) => {
        const categoryId = mapCategoryToId(product.category)
        if (!grouped[categoryId]) {
          grouped[categoryId] = []
        }
        grouped[categoryId].push(product)
      })
    } else {
      grouped[selectedCategory] = filteredProducts.filter(
        (product) => mapCategoryToId(product.category) === selectedCategory,
      )
    }

    return grouped
  }, [filteredProducts, selectedCategory])

  // Get available categories from actual products
  const availableCategories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    productsWithDiscounts.forEach((product) => {
      const mappedId = mapCategoryToId(product.category)
      uniqueCategories.add(mappedId)
    })
    return Array.from(uniqueCategories)
  }, [productsWithDiscounts])

  // Create dynamic categories
  const dynamicCategories = useMemo(() => {
    const dynamicCats = [...categories]

    availableCategories.forEach((categoryId) => {
      if (!dynamicCats.find((cat) => cat.id === categoryId) && categoryId !== "all") {
        const sheetCategory = categoriesFromSheet.find(
          (cat) => mapCategoryToId(cat.Category || cat.category) === categoryId,
        )

        dynamicCats.push({
          id: categoryId,
          name: {
            en:
              sheetCategory?.Category ||
              sheetCategory?.category ||
              categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
            kh:
              sheetCategory?.category_kh ||
              sheetCategory?.["Category_KH"] ||
              sheetCategory?.Category ||
              sheetCategory?.category ||
              categoryId,
          },
        })
      }
    })

    return dynamicCats
  }, [availableCategories, categoriesFromSheet])

  // Filter categories to only show those that have products
  const visibleCategories = dynamicCategories.filter((cat) => cat.id === "all" || availableCategories.includes(cat.id))

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

  const handleSeeMore = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  // Get display name for category
  const getCategoryDisplayName = (categoryId: string) => {
    const predefinedCategory = categories.find((cat) => cat.id === categoryId)
    if (predefinedCategory) {
      return predefinedCategory.name[language]
    }

    const sheetCategory = categoriesFromSheet.find(
      (cat) => mapCategoryToId(cat.Category || cat.category) === categoryId,
    )

    if (sheetCategory) {
      return language === "kh"
        ? sheetCategory.category_kh || sheetCategory["Category_KH"] || sheetCategory.Category || sheetCategory.category
        : sheetCategory.Category || sheetCategory.category
    }

    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
  }


  return (
    <section className="py-3 px-3 sm:py-4 sm:px-4 bg-gradient-to-br from-amber-50 to-orange-50 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Filter section with sticky positioning */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-amber-100 py-3 sm:py-4 mb-4 sm:mb-6 -mx-3 sm:-mx-4 px-3 sm:px-4 shadow-sm">
          <div className="mb-3 sm:mb-4">
            <div className="relative flex gap-0 overflow-x-auto scrollbar-hide pb-2 sm:pb-3 px-1">
              {visibleCategories.map((category, index) => {
                const imageUrl = getCategoryImage(category.id)
                const isSelected = selectedCategory === category.id

                return (
                  <div key={category.id} className="relative flex-shrink-0">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`relative text-xs sm:text-sm font-bold whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 h-auto transition-all duration-300 border-0 overflow-hidden min-h-[50px] sm:min-h-[60px] min-w-[90px] sm:min-w-[110px] shadow-md hover:shadow-lg ${
                        isSelected
                          ? "bg-amber-600/80 text-white shadow-xl scale-105 z-10"
                          : "bg-white/70 text-amber-800 hover:bg-amber-50 hover:scale-102"
                      } ${language === "kh" ? "font-mono" : "font-sans"}`}
                      style={{
                        clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                        marginLeft: index === 0 ? "0" : "-15px",
                        ...(imageUrl && isSelected
                          ? {
                              backgroundImage: `linear-gradient(rgba(245, 158, 11, 0.6), rgba(217, 119, 6, 0.6)), url(${imageUrl})`,
                              backgroundSize: "120%",
                              backgroundPosition: "center",
                              transition: "all 0.3s ease",
                            }
                          : imageUrl && !isSelected
                            ? {
                                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${imageUrl})`,
                                backgroundSize: "120%",
                                backgroundPosition: "center",
                                transition: "all 0.3s ease",
                              }
                            : undefined),
                      }}
                    >
                      <span
                        className={`relative z-10 text-center font-bold ${
                          isSelected ? "text-white drop-shadow-md" : "text-amber-800"
                        }`}
                      >
                        {category.name[language] || getCategoryDisplayName(category.id)}
                      </span>
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 border-amber-200 focus:border-amber-400 focus:ring-amber-200 rounded-xl bg-white focus:bg-white text-sm sm:text-base shadow-sm focus:shadow-md transition-all duration-200 ${language === "kh" ? "font-mono" : "font-sans"}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            if (categoryProducts.length === 0) return null

            const categoryName = getCategoryDisplayName(categoryId)
            const displayProducts = selectedCategory === "all" ? categoryProducts.slice(0, 4) : categoryProducts
            const hasMoreProducts = selectedCategory === "all" && categoryProducts.length > 4

            return (
              <div key={categoryId} className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between px-1 sm:px-2">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-xl sm:text-2xl md:text-3xl text-gray-800 ${
                        language === "kh" ? "font-mono" : "font-serif"
                      }`}
                    >
                      {categoryName}
                    </h3>
                    <div className="w-8 sm:w-12 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-1"></div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold shadow-sm ${
                        language === "kh" ? "font-mono" : "font-sans"
                      }`}
                    >
                      {categoryProducts.length} {language === "en" ? "items" : "ធាតុ"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {displayProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-amber-100 bg-white rounded-2xl overflow-hidden shadow-sm"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          {/* DISCOUNT BADGE - Updated with better styling */}
                          {product.isDiscounted && product.discount && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg z-10 flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {product.discount}% OFF
                            </div>
                          )}

                          <div className="w-full h-full flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
                            />
                          </div>

                          <button
                            onClick={(e) => toggleFavorite(product.id, e)}
                            className="absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"}`}
                            />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddToCart(product)
                            }}
                            className="absolute bottom-2 right-2 w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                          >
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </button>
                        </div>

                        <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
                          <h4
                            className={`font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 leading-tight ${language === "kh" ? "font-mono" : "font-sans"}`}
                          >
                            {language === "kh" ? product.name_kh : product.name}
                          </h4>
                          <p
                            className={`text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
                          >
                            {language === "kh" ? product.description_kh : product.description}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1">
                            {/* Updated price display with discount styling */}
                            {product.isDiscounted ? (
                              <div className="flex items-center gap-2">
                                <span className="text-base sm:text-lg font-bold text-red-600">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  ${product.originalPrice?.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-base sm:text-lg font-bold text-amber-700">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                            <span className={`text-xs sm:text-sm ${product.isDiscounted ? 'text-red-500' : 'text-amber-600'} font-medium`}>
                              KHR {(product.price * 4000).toLocaleString()}
                            </span>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddToCart(product)
                            }}
                            className={`w-full mt-1.5 sm:mt-2 ${
                              product.isDiscounted 
                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                                : 'bg-amber-600 hover:bg-amber-700'
                            } text-white text-xs sm:text-sm font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 ${language === "kh" ? "font-mono" : "font-sans"}`}
                          >
                            {product.isDiscounted 
                              ? (language === "en" ? "Add Discounted Item" : "បន្ថែមវត្ថុបញ្ចុះតម្លៃ") 
                              : (language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក")
                            }
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {hasMoreProducts && (
                  <div className="text-center pt-2 sm:pt-3">
                    <Button
                      variant="outline"
                      onClick={() => handleSeeMore(categoryId)}
                      className={`border-2 border-amber-300 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-amber-800 hover:border-amber-400 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 ${
                        language === "kh" ? "font-mono" : "font-sans"
                      }`}
                    >
                      <span className="mr-1">{language === "en" ? "See More" : "មើលបន្ថែម"}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {Object.keys(productsByCategory).length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-amber-100 max-w-sm mx-auto shadow-sm">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
              </div>
              <p
                className={`text-gray-600 text-sm sm:text-base leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
              >
                {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}