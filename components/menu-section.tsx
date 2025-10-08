"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Search, Heart, Plus, Tag, Sparkles, Coffee, ChevronDown, ChevronUp } from "lucide-react"
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
  discountEvent?: string
}

interface Discount {
  id: string | number
  discountName: string
  productName: string
  duplicateCheck: string
  discountPercent: number
  originalPrice: number
  discountedPrice: number
  isActive: boolean
  event: string
}

interface MenuSectionProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
  language: "en" | "kh"
  selectedEvent?: string
  onEventChange: (eventName: string) => void
}

const categories = [
  { id: "all", name: { en: "All", kh: "ទាំងអស់" } },
  { id: "coffee", name: { en: "Coffee", kh: "កាហ្វេ" } },
  { id: "tea", name: { en: "Tea", kh: "តែ" } },
  { id: "dessert", name: { en: "Dessert", kh: "បង្អែម" } },
  { id: "bakery", name: { en: "Bakery", kh: "នំប៉័ង" } },
  { id: "rice", name: { en: "Rice", kh: "បាយ" } },
  { id: "noodle", name: { en: "Noodle", kh: "មី" } },
]

export function MenuSection({
  products,
  onProductClick,
  onAddToCart,
  language,
  selectedEvent,
  onEventChange,
}: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [categoriesFromSheet, setCategoriesFromSheet] = useState<any[]>([])
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [events, setEvents] = useState<string[]>([])
  const [discountsLoading, setDiscountsLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadCategories() {
      try {
        const SHEET_ID = "1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU"
        const url = `https://opensheet.elk.sh/${SHEET_ID}/Categories`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setCategoriesFromSheet(data)
        }
      } catch (error) {
        console.error("Error loading categories from sheet:", error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    async function loadDiscounts() {
      try {
        console.log("🔄 Loading discounts from Google Sheet...")
        setDiscountsLoading(true)

        const SHEET_ID = "1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU"
        const url = `https://opensheet.elk.sh/${SHEET_ID}/Discount`
        console.log("📡 Fetching from:", url)

        const response = await fetch(url)
        if (!response.ok) {
          console.error("❌ HTTP error! status:", response.status)
          setDiscountsLoading(false)
          return
        }

        const rawData = await response.json()
        console.log("📦 RAW DISCOUNT DATA:", rawData)

        const processedDiscounts = rawData
          .map((item: any, index: number) => {
            if (!item || Object.keys(item).length === 0) return null

            if (item["Event"] === "Event" || item["Discount ID"] === "Discount ID") {
              return null
            }

            const discountId = item["Discount ID"] || index + 1
            const discountName = (item["Discount Name "] || item["Discount Name"] || "").trim()
            const duplicateCheck = (item["Duplicate Check"] || "").trim()
            const discountPercent = Number.parseFloat(item["Discount %"] || item["Discount Percent"] || "0")
            const discountedPrice = Number.parseFloat(item["Price"] || "0")
            const event = (item["Event"] || "").trim()

            const productName = discountName

            console.log("🔍 Processing row:", {
              discountId,
              productName,
              duplicateCheck,
              discountPercent,
              discountedPrice,
              event,
              rawItem: item,
            })

            if (!productName || productName === "") {
              console.warn("❌ Skipping - no product name:", item)
              return null
            }

            const isValid = duplicateCheck.toUpperCase() === "OK" && discountPercent > 0 && discountedPrice > 0

            const originalPrice = discountedPrice / (1 - discountPercent / 100)

            const discount: Discount = {
              id: discountId,
              discountName: productName,
              productName: productName,
              duplicateCheck: duplicateCheck,
              discountPercent,
              originalPrice: Math.round(originalPrice * 100) / 100,
              discountedPrice: Math.round(discountedPrice * 100) / 100,
              isActive: isValid,
              event: event,
            }

            console.log(isValid ? "✅ Valid discount:" : "❌ Invalid discount:", discount)
            return discount
          })
          .filter(Boolean)

        console.log("🎯 PROCESSED DISCOUNTS:", processedDiscounts)
        setDiscounts(processedDiscounts)

        const uniqueEvents = Array.from(
          new Set(processedDiscounts.filter((d: Discount) => d.isActive).map((d: Discount) => d.event.trim())),
        ).filter((event) => event && event !== "")

        console.log("🎯 Available events:", uniqueEvents)
        setEvents(uniqueEvents)
      } catch (error) {
        console.error("❌ Error loading discounts:", error)
      } finally {
        setDiscountsLoading(false)
      }
    }
    loadDiscounts()
  }, [])

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

  const getCategoryImage = (categoryId: string): string => {
    if (categoryId === "all") return ""
    const sheetCategory = categoriesFromSheet.find(
      (cat) => mapCategoryToId(cat.Category || cat.category) === categoryId,
    )
    return sheetCategory?.["Image URL"] || sheetCategory?.["image url"] || ""
  }

  const getActiveDiscounts = useMemo(() => {
    const activeDiscounts = discounts.filter((d) => d.isActive)
    return activeDiscounts
  }, [discounts])

  const matchProductWithDiscount = (productName: string, discountProductName: string): boolean => {
    if (!productName || !discountProductName) return false

    const productClean = productName.toLowerCase().trim()
    const discountClean = discountProductName.toLowerCase().trim()

    if (productClean === discountClean) return true
    if (productClean.includes(discountClean) || discountClean.includes(productClean)) return true

    const variations: Record<string, string[]> = {
      iced: ["ice"],
      latte: ["late"],
      cappuccino: ["capuccino", "cappucino"],
      americano: ["american"],
      matcha: ["maccha", "green tea"],
      chocolate: ["choco"],
      cake: ["cakes"],
      tea: ["teas"],
    }

    let productVar = productClean
    let discountVar = discountClean

    Object.entries(variations).forEach(([standard, alts]) => {
      alts.forEach((alt) => {
        productVar = productVar.replace(alt, standard)
        discountVar = discountVar.replace(alt, standard)
      })
    })

    if (productVar === discountVar || productVar.includes(discountVar) || discountVar.includes(productVar)) {
      return true
    }

    return false
  }

  const productsWithDiscounts = useMemo(() => {
    if (getActiveDiscounts.length === 0) {
      return products.map((product) => ({
        ...product,
        isDiscounted: false,
      }))
    }

    const processedProducts = products.map((product) => {
      const matchingDiscounts = getActiveDiscounts.filter((discount) =>
        matchProductWithDiscount(product.name, discount.productName),
      )

      if (matchingDiscounts.length > 0) {
        const discount = matchingDiscounts[0]

        return {
          ...product,
          originalPrice: discount.originalPrice,
          price: discount.discountedPrice,
          discount: discount.discountPercent,
          isDiscounted: true,
          discountEvent: discount.event,
        }
      }

      return {
        ...product,
        isDiscounted: false,
      }
    })

    const discountedCount = processedProducts.filter((p) => p.isDiscounted).length
    console.log(`🎯 Final: ${discountedCount}/${processedProducts.length} products discounted`)

    return processedProducts
  }, [products, getActiveDiscounts])

  const discountedProducts = useMemo(() => {
    return productsWithDiscounts.filter((p) => p.isDiscounted)
  }, [productsWithDiscounts])

  const eventFilteredDiscountedProducts = useMemo(() => {
    if (!selectedEvent || selectedEvent === "all") {
      return discountedProducts
    }
    return discountedProducts.filter((product) => product.discountEvent === selectedEvent)
  }, [discountedProducts, selectedEvent])

  const getEventProductCount = useMemo(() => {
    const eventCounts: Record<string, number> = { all: 0 }

    eventCounts.all = discountedProducts.length

    events.forEach((event) => {
      eventCounts[event] = discountedProducts.filter((p) => p.discountEvent === event).length
    })

    return eventCounts
  }, [discountedProducts, events])

  const filteredProducts = useMemo(() => {
    let filtered = productsWithDiscounts

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.name_kh && product.name_kh.toLowerCase().includes(searchQuery.toLowerCase())) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.description_kh && product.description_kh.toLowerCase().includes(searchQuery.toLowerCase())),
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

  const availableCategories = useMemo(() => {
    const uniqueCategories = new Set<string>()
    productsWithDiscounts.forEach((product) => {
      const mappedId = mapCategoryToId(product.category)
      uniqueCategories.add(mappedId)
    })
    return Array.from(uniqueCategories)
  }, [productsWithDiscounts])

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

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <Card
      key={product.id}
      onClick={() => onProductClick(product)}
      className="group cursor-pointer overflow-hidden border border-border/50 bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 animate-slide-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {product.isDiscounted && product.discount && (
            <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse-subtle">
              -{product.discount}%
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(product.id, e)}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-base mb-1 line-clamp-1">
            {language === "en" ? product.name : product.name_kh}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {language === "en" ? product.description : product.description_kh}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {product.isDiscounted && product.originalPrice ? (
                <>
                  <span className="text-lg font-bold text-red-600 animate-pulse-subtle">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-amber-700 line-through">${product.originalPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-amber-700">${product.price.toFixed(2)}</span>
              )}
            </div>

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              className="rounded-full h-8 w-8 p-0 bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder={language === "en" ? "Search menu..." : "ស្វែងរកម្ហូប..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-card border-border/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/20 rounded-xl"
            />
          </div>
        </div>
      </div>

      {discountedProducts.length > 0 && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            {/* Discount Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-700">
                    {language === "en" ? "Special Offers" : "ការផ្តល់ជូនពិសេស"}
                  </h2>
                  <p className="text-sm text-red-600">
                    {language === "en"
                      ? `${eventFilteredDiscountedProducts.length} items on sale`
                      : `${eventFilteredDiscountedProducts.length} ធាតុកំពុងបញ្ចុះតម្លៃ`}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Filters */}
            {events.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 mb-4">
                <button
                  onClick={() => onEventChange("all")}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    !selectedEvent || selectedEvent === "all"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                  }`}
                >
                  <Tag className="h-4 w-4" />
                  <span>{language === "en" ? "All Offers" : "ទាំងអស់"}</span>
                  <span className="ml-1 text-xs opacity-90">({getEventProductCount.all})</span>
                </button>

                {events.map((event) => (
                  <button
                    key={event}
                    onClick={() => onEventChange(event)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedEvent === event
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                    }`}
                  >
                    <span>{event}</span>
                    <span className="ml-1 text-xs opacity-90">({getEventProductCount[event]})</span>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {eventFilteredDiscountedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="sticky top-[73px] z-30 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {visibleCategories.map((category) => {
              const isActive = selectedCategory === category.id
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id)
                  }}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-secondary/60 text-secondary-foreground hover:bg-secondary hover:shadow-sm"
                  }`}
                >
                  {category.name[language]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
          if (categoryProducts.length === 0) return null

          const category = dynamicCategories.find((cat) => cat.id === categoryId)
          const categoryImage = getCategoryImage(categoryId)
          const isExpanded = expandedCategories.has(categoryId)
          const displayProducts = isExpanded ? categoryProducts : categoryProducts.slice(0, 4)
          const hasMore = categoryProducts.length > 4

          return (
            <div key={categoryId} className="mb-12">
              {/* Category Header */}
              {selectedCategory === "all" && category && (
                <div className="mb-6 flex items-center gap-4">
                  {categoryImage && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-secondary/50 flex-shrink-0">
                      <img
                        src={categoryImage || "/placeholder.svg"}
                        alt={category.name[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-semibold text-foreground tracking-tight">{category.name[language]}</h2>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {displayProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => toggleCategoryExpansion(categoryId)}
                    variant="outline"
                    className="px-6 py-2 rounded-full border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        {language === "en" ? "Show Less" : "បង្ហាញតិច"}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        {language === "en"
                          ? `See More (${categoryProducts.length - 4})`
                          : `មើលបន្ថែម (${categoryProducts.length - 4})`}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )
        })}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Coffee className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {language === "en" ? "No items found" : "រកមិនឃើញទេ"}
            </h3>
            <p className="text-muted-foreground">
              {language === "en" ? "Try adjusting your filters or search query" : "សូមព្យាយាមកែប្រែការស្វែងរករបស់អ្នក"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
