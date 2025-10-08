"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Search, Heart, Plus, ChevronRight, Tag, Filter, X, Percent } from "lucide-react"
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

        // Direct fetch from Google Sheets
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

        // Process the discount data
        const processedDiscounts = rawData
          .map((item: any, index: number) => {
            if (!item || Object.keys(item).length === 0) return null

            // Skip header rows
            if (item["Event"] === "Event" || item["Discount ID"] === "Discount ID") {
              return null
            }

            // Handle column names with or without trailing spaces
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
    if (selectedEvent && selectedEvent !== "all") {
      return activeDiscounts.filter((d) => d.event === selectedEvent)
    }
    return activeDiscounts
  }, [discounts, selectedEvent])

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

  const getEventDiscountCount = (eventName: string): number => {
    if (eventName === "all") {
      return getActiveDiscounts.length
    }
    return getActiveDiscounts.filter((d) => d.event === eventName).length
  }

  return (
    <section className="min-h-screen bg-amber-50/30">
      <div className="container mx-auto max-w-7xl">
        {/* Debug Info - Enhanced */}
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <div className="text-sm text-blue-900 space-y-2">
            <div>
              <strong>🔍 Debug Info:</strong>
            </div>
            <div>
              - Discounts Loaded: <strong className="text-blue-600">{discounts.length}</strong>
            </div>
            <div>
              - Active Discounts: <strong className="text-green-600">{getActiveDiscounts.length}</strong>
            </div>
            <div>
              - Events: <strong className="text-purple-600">{events.length > 0 ? events.join(", ") : "None"}</strong>
            </div>
            <div>
              - Selected Event: <strong>{selectedEvent || "all"}</strong>
            </div>
            <div>
              - Discounts Loading: <strong>{discountsLoading ? "Yes" : "No"}</strong>
            </div>
            {discounts.length > 0 && (
              <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                <div className="font-semibold mb-1">Loaded Discounts:</div>
                {discounts.slice(0, 5).map((d) => (
                  <div key={d.id} className="text-xs">
                    • {d.productName} - {d.discountPercent}% off - Event: {d.event} - Active: {d.isActive ? "✅" : "❌"}
                  </div>
                ))}
                {discounts.length > 5 && <div className="text-xs mt-1">...and {discounts.length - 5} more</div>}
              </div>
            )}
          </div>
        </div>

        {/* Main Layout Container - Mobile: Column, Desktop: Row */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* DISCOUNT FILTER SIDEBAR - Always Visible */}
          {getActiveDiscounts.length > 0 && (
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="sticky top-4 bg-white rounded-xl shadow-sm border-2 border-amber-200 overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-amber-500 px-5 py-5 border-b-4 border-amber-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Percent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className={`font-bold text-lg text-white ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        {language === "en" ? "Discount Events" : "ព្រឹត្តិការណ៍បញ្ចុះតម្លៃ"}
                      </h2>
                      <p className="text-amber-100 text-xs">
                        {getActiveDiscounts.length} {language === "en" ? "active" : "សកម្ម"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Discount Filter Options */}
                <div className="p-4 space-y-2 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
                  {/* All Discounts Option */}
                  <button
                    onClick={() => onEventChange("all")}
                    className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-200 border-2 ${
                      selectedEvent === "all" || !selectedEvent
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-md"
                        : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        {language === "en" ? "All Discounts" : "បញ្ចុះតម្លៃទាំងអស់"}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                          selectedEvent === "all" || !selectedEvent
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {getEventDiscountCount("all")}
                      </span>
                    </div>
                  </button>

                  {/* Individual Event Options */}
                  {events.map((eventName) => (
                    <button
                      key={eventName}
                      onClick={() => onEventChange(eventName)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg transition-all duration-200 border-2 ${
                        selectedEvent === eventName
                          ? "bg-blue-500 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          {eventName}
                        </span>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                            selectedEvent === eventName ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getEventDiscountCount(eventName)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Clear Filter Button */}
                {selectedEvent && selectedEvent !== "all" && (
                  <div className="p-4 border-t-2 border-gray-100">
                    <Button
                      variant="outline"
                      onClick={clearEventFilter}
                      className="w-full text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border-gray-300 bg-transparent"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {language === "en" ? "Clear Filter" : "លុបតម្រង"}
                    </Button>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0">
            {/* Active Event Banner */}
            {selectedEvent && selectedEvent !== "all" && (
              <div className="mb-6 p-5 bg-blue-500 rounded-xl text-white shadow-md border-2 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">
                      {language === "en" ? "Active Event" : "ព្រឹត្តិការណ៍សកម្ម"}: {selectedEvent}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {language === "en"
                        ? `${getEventDiscountCount(selectedEvent)} exclusive discounts available`
                        : `ការបញ្ចុះតម្លៃ ${getEventDiscountCount(selectedEvent)} ពិសេស`}
                    </p>
                  </div>
                  <div className="bg-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold">
                    {getEventDiscountCount(selectedEvent)}
                  </div>
                </div>
              </div>
            )}

            {/* Category Filter & Search - Sticky */}
            <div className="sticky top-4 z-40 bg-white backdrop-blur-md border-2 border-amber-200 rounded-xl shadow-sm mb-6 p-5">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
                  <Input
                    placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 border-gray-200 focus:border-amber-500 focus:ring-amber-200 rounded-lg bg-white text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
                  />
                </div>
              </div>

              {/* Category Filter - Horizontal Scroll */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4 text-amber-700" />
                  <span
                    className={`text-sm font-bold text-amber-900 uppercase tracking-wide ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "Categories" : "ប្រភេទ"}
                  </span>
                </div>
                <div className="relative flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {visibleCategories.map((category) => {
                    const isSelected = selectedCategory === category.id

                    return (
                      <Button
                        key={category.id}
                        variant="ghost"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex-shrink-0 font-semibold whitespace-nowrap px-5 py-2.5 h-auto transition-all duration-200 rounded-lg border-2 ${
                          isSelected
                            ? "bg-amber-500 text-white border-amber-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-amber-50 hover:border-amber-300"
                        } ${language === "kh" ? "font-mono" : "font-sans"}`}
                      >
                        {category.name[language] || getCategoryDisplayName(category.id)}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="space-y-10">
              {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
                if (categoryProducts.length === 0) return null

                const categoryName = getCategoryDisplayName(categoryId)
                const displayProducts = selectedCategory === "all" ? categoryProducts.slice(0, 4) : categoryProducts
                const hasMoreProducts = selectedCategory === "all" && categoryProducts.length > 4

                return (
                  <div key={categoryId} className="space-y-5">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-2xl md:text-3xl text-gray-900 ${
                            language === "kh" ? "font-mono" : "font-sans"
                          }`}
                        >
                          {categoryName}
                        </h3>
                        <div className="w-16 h-1 bg-amber-500 rounded-full mt-2"></div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`bg-amber-100 text-amber-900 px-4 py-2 rounded-lg text-sm font-bold border-2 border-amber-200 ${
                            language === "kh" ? "font-mono" : "font-sans"
                          }`}
                        >
                          {categoryProducts.length} {language === "en" ? "items" : "ធាតុ"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {displayProducts.map((product) => (
                        <Card
                          key={product.id}
                          className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 border-gray-200 bg-white rounded-xl overflow-hidden"
                          onClick={() => onProductClick(product)}
                        >
                          <CardContent className="p-0">
                            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                              {/* DISCOUNT BADGE - Always visible when product has discount */}
                              {product.isDiscounted && product.discount && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg z-10 flex items-center gap-1.5 border-2 border-red-700">
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
                                className="absolute top-3 right-3 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 border-2 border-gray-200"
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
                                className="absolute bottom-3 right-3 w-10 h-10 bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border-2 border-amber-600"
                              >
                                <Plus className="h-5 w-5 text-white" />
                              </button>
                            </div>

                            <div className="p-4 space-y-2">
                              <h4
                                className={`font-semibold text-base text-gray-900 line-clamp-2 leading-tight ${language === "kh" ? "font-mono" : "font-sans"}`}
                              >
                                {language === "kh" ? product.name_kh : product.name}
                              </h4>
                              <p
                                className={`text-sm text-gray-600 line-clamp-2 leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
                              >
                                {language === "kh" ? product.description_kh : product.description}
                              </p>

                              {/* PRICE DISPLAY - Discounts always shown when applicable */}
                              <div className="flex flex-col gap-1 pt-1">
                                {product.isDiscounted ? (
                                  <>
                                    {/* Discounted Price */}
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-2xl font-bold text-red-600">
                                        ${product.price.toFixed(2)}
                                      </span>
                                      <span className="text-sm text-red-500 font-semibold">
                                        {(product.price * 4000).toLocaleString()} ៛
                                      </span>
                                    </div>
                                    {/* Original Price - Strikethrough */}
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
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                    <span className="text-sm text-gray-600 font-semibold">
                                      {(product.price * 4000).toLocaleString()} ៛
                                    </span>
                                  </div>
                                )}
                              </div>

                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onAddToCart(product)
                                }}
                                className={`w-full mt-2 ${
                                  product.isDiscounted
                                    ? "bg-red-600 hover:bg-red-700 border-2 border-red-700"
                                    : "bg-amber-500 hover:bg-amber-600 border-2 border-amber-600"
                                } text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${language === "kh" ? "font-mono" : "font-sans"}`}
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

                    {hasMoreProducts && (
                      <div className="text-center pt-4">
                        <Button
                          variant="outline"
                          onClick={() => handleSeeMore(categoryId)}
                          className={`border-2 border-amber-400 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-500 rounded-lg px-6 py-3 font-semibold shadow-sm hover:shadow-md transition-all duration-200 ${
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

            {/* No Results */}
            {Object.keys(productsByCategory).length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white rounded-xl p-8 border-2 border-gray-200 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-amber-600" />
                  </div>
                  <p
                    className={`text-gray-600 text-base leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
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