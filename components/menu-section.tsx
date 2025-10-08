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

  // 1. Exact match (highest priority)
  if (productClean === discountClean) return true

  // 2. Word boundary matching - more strict than includes()
  const productWords = productClean.split(/\s+/)
  const discountWords = discountClean.split(/\s+/)
  
  // Check if all discount words appear in product name as whole words
  const allDiscountWordsMatch = discountWords.every(discountWord => 
    productWords.some(productWord => productWord === discountWord)
  )
  
  if (allDiscountWordsMatch) return true

  // 3. Handle common variations but be more specific
  const variations: Record<string, string[]> = {
    iced: ["ice"],
    latte: ["late"],
    cappuccino: ["capuccino", "cappucino"],
    americano: ["american"],
    matcha: ["maccha", "green tea"],
    chocolate: ["choco"],
  }

  let productVar = productClean
  let discountVar = discountClean

  Object.entries(variations).forEach(([standard, alts]) => {
    alts.forEach((alt) => {
      // Use word boundaries to avoid partial matches
      productVar = productVar.replace(new RegExp(`\\b${alt}\\b`, 'g'), standard)
      discountVar = discountVar.replace(new RegExp(`\\b${alt}\\b`, 'g'), standard)
    })
  })

  // Only return true if we have exact match after variations
  return productVar === discountVar
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
      className="group cursor-pointer overflow-hidden border-0 hover:shadow-2xl transition-all duration-300"
      style={{
        backgroundColor: "#ffffff",
        border: "2px solid #fcd34d",
        animation: "scaleIn 0.4s ease-out forwards",
        animationDelay: `${index * 50}ms`,
        opacity: 0,
        transform: "scale(0.9)",
      }}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div
          className="relative aspect-[4/3] overflow-hidden"
          style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)" }}
        >
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
            }}
          />

          {product.isDiscounted && product.discount && (
            <div
              className="absolute top-2 left-2 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
              style={{
                background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                animation: "glowPulse 2s ease-in-out infinite",
              }}
            >
              <Sparkles
                className="h-3 w-3"
                style={{
                  animation: "spin 3s linear infinite",
                }}
              />
              <span style={{ animation: "pulse 1.5s ease-in-out infinite" }}>-{product.discount}%</span>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => toggleFavorite(product.id, e)}
            className="absolute top-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(4px)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)"
              e.currentTarget.style.backgroundColor = "#ffffff"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)"
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
            }}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
              style={favorites.has(product.id) ? { animation: "pulse 1s ease-in-out infinite" } : {}}
            />
          </button>
        </div>

        <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
          <h3 className="font-semibold text-base mb-1 line-clamp-1" style={{ color: "#111827" }}>
            {language === "en" ? product.name : product.name_kh}
          </h3>
          <p className="text-xs mb-3 line-clamp-2" style={{ color: "#4b5563" }}>
            {language === "en" ? product.description : product.description_kh}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {product.isDiscounted && product.originalPrice ? (
                <>
                  <span
                    className="text-lg font-bold"
                    style={{
                      color: "#dc2626",
                      animation: "priceBounce 1s ease-in-out infinite",
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium line-through" style={{ color: "#78350f" }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold" style={{ color: "#78350f" }}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart(product)
              }}
              className="rounded-full h-8 w-8 p-0 text-white shadow-md transition-all"
              style={{
                backgroundColor: "#d97706",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#b45309"
                e.currentTarget.style.transform = "scale(1.1)"
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#d97706"
                e.currentTarget.style.transform = "scale(1)"
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom right, #fffbeb, #fef3c7)" }}>
      <div
        className="sticky top-0 z-40 border-b-2 shadow-md"
        style={{ backgroundColor: "#ffffff", borderColor: "#fcd34d" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search
              className="absolute left-4 top-1/2 h-5 w-5"
              style={{ transform: "translateY(-50%)", color: "#d97706" }}
            />
            <Input
              type="text"
              placeholder={language === "en" ? "Search menu..." : "ស្វែងរកម្ហូប..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 border-2 rounded-xl shadow-sm focus-visible:ring-2"
              style={{
                backgroundColor: "#ffffff",
                color: "#111827",
                borderColor: "#fcd34d",
              }}
            />
          </div>
        </div>
      </div>

      {discountedProducts.length > 0 && (
        <div
          className="relative border-y-4 shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
            borderColor: "#b91c1c",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.1,
              backgroundImage:
                "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')",
              animation: "shimmer 20s linear infinite",
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(4px)",
                    animation: "float 3s ease-in-out infinite",
                  }}
                >
                  <Sparkles className="h-7 w-7" style={{ color: "#ffffff" }} />
                </div>
                <div>
                  <h2
                    className="text-3xl font-bold flex items-center gap-2"
                    style={{
                      color: "#ffffff",
                      textShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      animation: "slideRight 0.6s ease-out",
                    }}
                  >
                    {language === "en" ? "🔥 Hot Deals" : "🔥 ការផ្តល់ជូនពិសេស"}
                  </h2>
                  <p
                    className="text-base font-medium mt-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.9)",
                      animation: "fadeIn 0.8s ease-out",
                    }}
                  >
                    {language === "en"
                      ? `${eventFilteredDiscountedProducts.length} amazing offers waiting for you!`
                      : `${eventFilteredDiscountedProducts.length} ការផ្តល់ជូនពិសេសសម្រាប់អ្នក!`}
                  </p>
                </div>
              </div>
            </div>

            {events.length > 0 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: "thin" }}>
                <button
                  onClick={() => onEventChange("all")}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
                  style={{
                    backgroundColor: !selectedEvent || selectedEvent === "all" ? "#ffffff" : "rgba(255, 255, 255, 0.2)",
                    color: !selectedEvent || selectedEvent === "all" ? "#dc2626" : "#ffffff",
                    backdropFilter: "blur(4px)",
                    transform: !selectedEvent || selectedEvent === "all" ? "scale(1.05)" : "scale(1)",
                    animation: !selectedEvent || selectedEvent === "all" ? "pulse 2s ease-in-out infinite" : "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      !selectedEvent || selectedEvent === "all" ? "scale(1.05)" : "scale(1)"
                  }}
                >
                  <Tag className="h-4 w-4" />
                  <span>{language === "en" ? "All Offers" : "ទាំងអស់"}</span>
                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                  >
                    {getEventProductCount.all}
                  </span>
                </button>

                {events.map((event) => (
                  <button
                    key={event}
                    onClick={() => onEventChange(event)}
                    className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg"
                    style={{
                      backgroundColor: selectedEvent === event ? "#ffffff" : "rgba(255, 255, 255, 0.2)",
                      color: selectedEvent === event ? "#dc2626" : "#ffffff",
                      backdropFilter: "blur(4px)",
                      transform: selectedEvent === event ? "scale(1.05)" : "scale(1)",
                      animation: selectedEvent === event ? "pulse 2s ease-in-out infinite" : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = selectedEvent === event ? "scale(1.05)" : "scale(1)"
                    }}
                  >
                    <span>{event}</span>
                    <span
                      className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ backgroundColor: "#dc2626", color: "#ffffff" }}
                    >
                      {getEventProductCount[event]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-x-auto pb-4" style={{ scrollbarWidth: "thin" }}>
              <div className="flex gap-4 sm:gap-5" style={{ minWidth: "min-content" }}>
                {eventFilteredDiscountedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[160px] sm:w-[200px]"
                    style={{
                      animation: "slideRight 0.5s ease-out forwards",
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                    }}
                  >
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="sticky z-30 border-b shadow-sm"
        style={{
          top: "73px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "#fef3c7",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="relative flex gap-0 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {visibleCategories.map((category, index) => {
              const imageUrl = getCategoryImage(category.id)
              const isSelected = selectedCategory === category.id

              return (
                <div key={category.id} className="relative flex-shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedCategory(category.id)}
                    className="relative text-xs sm:text-sm font-bold whitespace-nowrap px-4 sm:px-6 py-3 sm:py-4 h-auto transition-all duration-300 border-0 overflow-hidden min-h-[50px] sm:min-h-[60px] min-w-[90px] sm:min-w-[110px] shadow-md"
                    style={{
                      clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0% 100%)",
                      marginLeft: index === 0 ? "0" : "-15px",
                      backgroundColor: isSelected ? "rgba(217, 119, 6, 0.8)" : "rgba(255, 255, 255, 0.7)",
                      color: isSelected ? "#ffffff" : "#92400e",
                      transform: isSelected ? "scale(1.05)" : "scale(1)",
                      zIndex: isSelected ? 10 : 1,
                      boxShadow: isSelected
                        ? "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                        : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      ...(imageUrl && isSelected
                        ? {
                            backgroundImage: `linear-gradient(rgba(217, 119, 6, 0.6), rgba(180, 83, 9, 0.6)), url(${imageUrl})`,
                            backgroundSize: "120%",
                            backgroundPosition: "center",
                          }
                        : imageUrl && !isSelected
                          ? {
                              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), url(${imageUrl})`,
                              backgroundSize: "120%",
                              backgroundPosition: "center",
                            }
                          : undefined),
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "#fef3c7"
                        e.currentTarget.style.transform = "scale(1.02)"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.7)"
                        e.currentTarget.style.transform = "scale(1)"
                      }
                    }}
                  >
                    <span
                      className={`relative z-10 text-center font-bold ${language === "kh" ? "font-mono" : "font-sans"}`}
                      style={{
                        color: isSelected ? "#ffffff" : "#92400e",
                        textShadow: isSelected ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                      }}
                    >
                      {category.name[language]}
                    </span>
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
        style={{ background: "linear-gradient(to bottom right, #fffbeb, #fef3c7)" }}
      >
        {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
          if (categoryProducts.length === 0) return null

          const category = dynamicCategories.find((cat) => cat.id === categoryId)
          const categoryImage = getCategoryImage(categoryId)
          const isExpanded = expandedCategories.has(categoryId)
          const displayProducts = isExpanded ? categoryProducts : categoryProducts.slice(0, 4)
          const hasMore = categoryProducts.length > 4

          return (
            <div
              key={categoryId}
              className="mb-12"
              style={{
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              {/* Category Header */}
              {selectedCategory === "all" && category && (
                <div
                  className="mb-6 flex items-center gap-4"
                  style={{
                    animation: "slideRight 0.5s ease-out",
                  }}
                >
                  {categoryImage && (
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 shadow-md border-2"
                      style={{
                        backgroundColor: "#fef3c7",
                        borderColor: "#fcd34d",
                      }}
                    >
                      <img
                        src={categoryImage || "/placeholder.svg"}
                        alt={category.name[language]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#111827" }}>
                    {category.name[language]}
                  </h2>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {displayProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => toggleCategoryExpansion(categoryId)}
                    variant="outline"
                    className="px-6 py-2 rounded-full border-2 font-semibold shadow-sm transition-all"
                    style={{
                      borderColor: "#d97706",
                      color: "#92400e",
                      backgroundColor: "#ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#fef3c7"
                      e.currentTarget.style.color = "#78350f"
                      e.currentTarget.style.transform = "scale(1.05)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff"
                      e.currentTarget.style.color = "#92400e"
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                    }}
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
          <div
            className="text-center py-16"
            style={{
              animation: "fadeIn 0.6s ease-out",
            }}
          >
            <Coffee
              className="h-16 w-16 mx-auto mb-4"
              style={{
                color: "#fbbf24",
                animation: "bounce 2s ease-in-out infinite",
              }}
            />
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#111827" }}>
              {language === "en" ? "No items found" : "រកមិនឃើញទេ"}
            </h3>
            <p style={{ color: "#4b5563" }}>
              {language === "en" ? "Try adjusting your filters or search query" : "សូមព្យាយាមកែប្រែការស្វែងរករបស់អ្នក"}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
          }
        }

        @keyframes priceBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
