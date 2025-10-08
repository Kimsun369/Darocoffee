"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Search, Heart, Plus, ChevronRight, Tag, Filter, X, Percent, Sparkles } from "lucide-react"
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

  // Apply discounts to products automatically
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

  // Get count of products for each event
  const getEventProductCount = useMemo(() => {
    const eventCounts: Record<string, number> = { all: 0 }
    
    // Count all discounted products for "all" filter
    eventCounts.all = productsWithDiscounts.filter(p => p.isDiscounted).length
    
    // Count products for each specific event
    events.forEach(event => {
      eventCounts[event] = productsWithDiscounts.filter(p => 
        p.isDiscounted && p.discountEvent === event
      ).length
    })
    
    return eventCounts
  }, [productsWithDiscounts, events])

  // Filter products based on search and category
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

  // Get products for the selected discount event
  const eventFilteredProducts = useMemo(() => {
    if (!selectedEvent || selectedEvent === "all") {
      return filteredProducts
    }

    // When a specific event is selected, show only discounted products from that event
    return filteredProducts.filter((product) => 
      product.isDiscounted && product.discountEvent === selectedEvent
    )
  }, [filteredProducts, selectedEvent])

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {}

    if (selectedCategory === "all") {
      eventFilteredProducts.forEach((product) => {
        const categoryId = mapCategoryToId(product.category)
        if (!grouped[categoryId]) {
          grouped[categoryId] = []
        }
        grouped[categoryId].push(product)
      })
    } else {
      grouped[selectedCategory] = eventFilteredProducts.filter(
        (product) => mapCategoryToId(product.category) === selectedCategory,
      )
    }

    return grouped
  }, [eventFilteredProducts, selectedCategory])

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

  const handleSeeMore = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const clearEventFilter = () => {
    onEventChange("all")
  }

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
    <section className="min-h-screen bg-gradient-to-br from-amber-50/50 to-orange-50/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main Layout Container */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* DISCOUNT FILTER SIDEBAR */}
          {getActiveDiscounts.length > 0 && (
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="sticky top-4 bg-gradient-to-b from-white to-amber-50 rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`font-bold text-xl text-white ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        {language === "en" ? "Special Offers" : "ការផ្តល់ជូនពិសេស"}
                      </h2>
                      <p className="text-amber-100 text-sm mt-1">
                        {getActiveDiscounts.length} {language === "en" ? "active promotions" : "ការផ្សព្វផ្សាយសកម្ម"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discount Filter Options */}
                <div className="p-5 space-y-3 max-h-[500px] overflow-y-auto">
                  {/* All Discounts Option */}
                  <button
                    onClick={() => onEventChange("all")}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 border-2 group ${
                      selectedEvent === "all" || !selectedEvent
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-emerald-600 shadow-lg"
                        : "bg-white text-gray-700 border-amber-100 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${selectedEvent === "all" ? "bg-white/20" : "bg-amber-100"}`}>
                          <Percent className={`h-4 w-4 ${selectedEvent === "all" ? "text-white" : "text-amber-600"}`} />
                        </div>
                        <span className={`font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          {language === "en" ? "All Offers" : "ការផ្តល់ជូនទាំងអស់"}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-bold px-3 py-1.5 rounded-lg min-w-10 text-center ${
                          selectedEvent === "all" || !selectedEvent
                            ? "bg-white/20 text-white backdrop-blur-sm"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {getEventProductCount.all}
                      </span>
                    </div>
                  </button>

                  {/* Individual Event Options */}
                  {events.map((eventName) => (
                    <button
                      key={eventName}
                      onClick={() => onEventChange(eventName)}
                      className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 border-2 group ${
                        selectedEvent === eventName
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-white text-gray-700 border-amber-100 hover:border-amber-300 hover:bg-amber-50 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${selectedEvent === eventName ? "bg-white/20" : "bg-blue-100"}`}>
                            <Tag className={`h-4 w-4 ${selectedEvent === eventName ? "text-white" : "text-blue-600"}`} />
                          </div>
                          <span className={`font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}>
                            {eventName}
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold px-3 py-1.5 rounded-lg min-w-10 text-center ${
                            selectedEvent === eventName
                              ? "bg-white/20 text-white backdrop-blur-sm"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getEventProductCount[eventName] || 0}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Clear Filter Button */}
                {selectedEvent && selectedEvent !== "all" && (
                  <div className="p-5 border-t border-amber-200 bg-amber-50/50">
                    <Button
                      variant="outline"
                      onClick={clearEventFilter}
                      className="w-full text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-white border-amber-300 bg-white/80 backdrop-blur-sm"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === "en" ? "Clear Filter" : "លុបតម្រង"}
                    </Button>
                  </div>
                )}
              </div>

              {/* DISCOUNT EVENT PRODUCTS - Display directly below filter when event is selected */}
              {selectedEvent && selectedEvent !== "all" && (
                <div className="mt-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg border border-blue-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-xl">
                        {selectedEvent}
                      </h3>
                      <div className="bg-white/20 px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm border border-white/30">
                        {getEventProductCount[selectedEvent] || 0} {language === "en" ? "items" : "ធាតុ"}
                      </div>
                    </div>
                    <p className="text-blue-100 text-sm">
                      {language === "en"
                        ? `Showing ${getEventProductCount[selectedEvent] || 0} discounted products from this event`
                        : `ការបង្ហាញផលិតផលបញ្ចុះតម្លៃ ${getEventProductCount[selectedEvent] || 0} ពីព្រឹត្តិការណ៍នេះ`}
                    </p>
                  </div>

                  {/* Event Products Grid */}
                  <div className="mt-4 grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
                    {eventFilteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 bg-white rounded-xl overflow-hidden"
                        onClick={() => onProductClick(product)}
                      >
                        <CardContent className="p-0">
                          <div className="flex">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                              />
                            </div>
                            <div className="flex-1 p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`font-semibold text-sm text-gray-900 line-clamp-1 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                                    {language === "kh" ? product.name_kh : product.name}
                                  </h4>
                                  <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-lg font-bold text-red-600">
                                      ${product.price.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                      ${product.originalPrice?.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAddToCart(product)
                                  }}
                                  className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg flex items-center justify-center ml-2 flex-shrink-0"
                                >
                                  <Plus className="h-4 w-4 text-white" />
                                </button>
                              </div>
                              {product.discount && (
                                <div className="mt-1">
                                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                                    {product.discount}% OFF
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            {/* Category Filter & Search */}
            <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-lg border border-amber-200 rounded-2xl shadow-lg mb-8 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <Input
                    placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 border-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-xl bg-white/50 text-base transition-all duration-200 ${language === "kh" ? "font-mono" : "font-sans"}`}
                  />
                </div>
              </div>

              {/* Category Filter - Horizontal Scroll */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Filter className="h-4 w-4 text-amber-700" />
                  </div>
                  <span
                    className={`text-sm font-bold text-amber-900 uppercase tracking-wide ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "Browse Categories" : "រុករកប្រភេទ"}
                  </span>
                </div>
                
                {/* Scrollable Category Container */}
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-100">
                    {visibleCategories.map((category) => {
                      const isSelected = selectedCategory === category.id

                      return (
                        <Button
                          key={category.id}
                          variant="ghost"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex-shrink-0 font-semibold whitespace-nowrap px-6 py-3 h-auto transition-all duration-300 rounded-xl border-2 ${
                            isSelected
                              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 shadow-lg"
                              : "bg-white text-gray-700 border-amber-100 hover:bg-amber-50 hover:border-amber-300 hover:shadow-md"
                          } ${language === "kh" ? "font-mono" : "font-sans"}`}
                        >
                          {category.name[language] || getCategoryDisplayName(category.id)}
                        </Button>
                      )
                    })}
                  </div>
                  
                  {/* Gradient fade effect for scroll indication */}
                  <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* REGULAR PRODUCTS GRID - Only show when no specific event is selected */}
            {(!selectedEvent || selectedEvent === "all") && (
              <div className="space-y-12">
                {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
                  if (categoryProducts.length === 0) return null

                  const categoryName = getCategoryDisplayName(categoryId)
                  const displayProducts = selectedCategory === "all" ? categoryProducts.slice(0, 4) : categoryProducts
                  const hasMoreProducts = selectedCategory === "all" && categoryProducts.length > 4

                  return (
                    <div key={categoryId} className="space-y-6">
                      {/* Category Header */}
                      <div className="flex items-center justify-between px-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-8 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                            <h3
                              className={`font-bold text-3xl text-gray-900 ${language === "kh" ? "font-mono" : "font-sans"}`}
                            >
                              {categoryName}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm ml-6">
                            {categoryProducts.length} {language === "en" ? "delicious items" : "មុខម្ហូបឆ្ងាញ់"}
                          </p>
                        </div>
                      </div>

                      {/* Products Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayProducts.map((product) => (
                          <Card
                            key={product.id}
                            className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-gray-200 bg-white rounded-2xl overflow-hidden"
                            onClick={() => onProductClick(product)}
                          >
                            <CardContent className="p-0">
                              <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                                {/* Discount Badge */}
                                {product.isDiscounted && product.discount && (
                                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-xl z-10 flex items-center gap-2 border border-red-700">
                                    <Tag className="h-4 w-4" />
                                    {product.discount}% OFF
                                  </div>
                                )}

                                {/* Product Image */}
                                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                  <img
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = "/placeholder.svg"
                                    }}
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute top-4 right-4 flex flex-col gap-2">
                                  <button
                                    onClick={(e) => toggleFavorite(product.id, e)}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
                                  >
                                    <Heart
                                      className={`h-5 w-5 transition-colors ${
                                        favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-400"
                                      }`}
                                    />
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onAddToCart(product)
                                    }}
                                    className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-amber-600"
                                  >
                                    <Plus className="h-5 w-5 text-white" />
                                  </button>
                                </div>
                              </div>

                              {/* Product Info */}
                              <div className="p-5 space-y-3">
                                <h4
                                  className={`font-bold text-lg text-gray-900 line-clamp-2 leading-tight ${language === "kh" ? "font-mono" : "font-sans"}`}
                                >
                                  {language === "kh" ? product.name_kh : product.name}
                                </h4>
                                <p
                                  className={`text-sm text-gray-600 line-clamp-2 leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
                                >
                                  {language === "kh" ? product.description_kh : product.description}
                                </p>

                                {/* Price Display */}
                                <div className="flex flex-col gap-2 pt-2">
                                  {product.isDiscounted ? (
                                    <>
                                      <div className="flex items-baseline gap-3">
                                        <span className="text-2xl font-bold text-red-600">
                                          ${product.price.toFixed(2)}
                                        </span>
                                        <span className="text-sm text-red-500 font-semibold">
                                          {(product.price * 4000).toLocaleString()} ៛
                                        </span>
                                      </div>
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-base text-gray-500 line-through font-medium">
                                          ${product.originalPrice?.toFixed(2)}
                                        </span>
                                        <span className="text-xs text-gray-400 line-through">
                                          {((product.originalPrice || 0) * 4000).toLocaleString()} ៛
                                        </span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-baseline gap-3">
                                      <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                      <span className="text-sm text-gray-600 font-semibold">
                                        {(product.price * 4000).toLocaleString()} ៛
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Add to Cart Button */}
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onAddToCart(product)
                                  }}
                                  className={`w-full mt-4 font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                                    product.isDiscounted
                                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border border-red-600"
                                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border border-amber-600"
                                  } text-white ${language === "kh" ? "font-mono" : "font-sans"}`}
                                >
                                  {product.isDiscounted
                                    ? language === "en"
                                      ? "Add Discounted Item"
                                      : "បន្ថែមវត្ថុបញ្ចុះតម្លៃ"
                                    : language === "en"
                                      ? "Add to Cart"
                                      : "បន្ថែមទៅកន្ត្រក"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* See More Button */}
                      {hasMoreProducts && (
                        <div className="text-center pt-6">
                          <Button
                            variant="outline"
                            onClick={() => handleSeeMore(categoryId)}
                            className="border-2 border-amber-400 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-500 rounded-xl px-8 py-3.5 font-semibold shadow-md hover:shadow-lg transition-all duration-300 group"
                          >
                            <span className="mr-2">{language === "en" ? "See More" : "មើលបន្ថែម"}</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* No Results */}
            {Object.keys(productsByCategory).length === 0 && (!selectedEvent || selectedEvent === "all") && (
              <div className="text-center py-20">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-amber-200 max-w-md mx-auto shadow-lg">
                  <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="h-10 w-10 text-amber-600" />
                  </div>
                  <h3 className={`text-xl font-bold text-gray-900 mb-3 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {language === "en" ? "No items found" : "រកមិនឃើញធាតុ"}
                  </h3>
                  <p
                    className={`text-gray-600 text-base leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" 
                      ? "Try adjusting your search or filter to find what you're looking for." 
                      : "សូមព្យាយាមកែសម្រួលការស្វែងរក ឬតម្រងរបស់អ្នកដើម្បីស្វែងរកអ្វីដែលអ្នកកំពុងស្វែងរក។"}
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}