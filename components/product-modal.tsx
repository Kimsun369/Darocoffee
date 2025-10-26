"use client"

import { useState, useEffect } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { COLORS } from "@/config/color-config"

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
  displayOrder: number
  options?: Record<string, Array<{ name: string; price: number }>>
}

interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  options: Record<string, string>
  optionsPricing: Record<string, number>
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
  language: "en" | "kh"
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, language }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedOptionsPricing, setSelectedOptionsPricing] = useState<Record<string, number>>({})

  useEffect(() => {
    if (product && isOpen) {
      setQuantity(1)
      const defaultOptions: Record<string, string> = {}
      const defaultPricing: Record<string, number> = {}

      if (product.options) {
        Object.entries(product.options).forEach(([key, options]) => {
          if (options.length > 0) {
            defaultOptions[key] = options[0].name
            defaultPricing[key] = options[0].price
          }
        })
      }

      setSelectedOptions(defaultOptions)
      setSelectedOptionsPricing(defaultPricing)
    }
  }, [product, isOpen])

  if (!product) return null

  const handleOptionChange = (optionType: string, optionName: string, optionPrice: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: optionName,
    }))
    setSelectedOptionsPricing((prev) => ({
      ...prev,
      [optionType]: optionPrice,
    }))
  }

  const calculateTotalPrice = () => {
    const basePrice = product.price
    const optionsPrice = Object.values(selectedOptionsPricing).reduce((sum, price) => sum + price, 0)
    return (basePrice + optionsPrice) * quantity
  }

  const calculateBasePriceWithOptions = () => {
    const basePrice = product.price
    const optionsPrice = Object.values(selectedOptionsPricing).reduce((sum, price) => sum + price, 0)
    return basePrice + optionsPrice
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random()}`,
      productId: product.id,
      name: language === "en" ? product.name : product.name_kh,
      price: calculateTotalPrice(),
      quantity,
      options: selectedOptions,
      optionsPricing: selectedOptionsPricing,
    }

    onAddToCart(cartItem)
    onClose()
  }

  const getOptionDisplayName = (optionType: string) => {
    const optionMap: Record<string, { en: string; kh: string }> = {
      size: { en: "Size", kh: "ទំហំ" },
      sugar: { en: "Sugar Level", kh: "កម្រិតស្ករ" },
      sugar_level: { en: "Sugar Level", kh: "កម្រិតស្ករ" },
      milk: { en: "Milk Type", kh: "ប្រភេទទឹកដោះគោ" },
      milk_type: { en: "Milk Type", kh: "ប្រភេទទឹកដោះគោ" },
      shots: { en: "Espresso Shots", kh: "ការបាញ់កាហ្វេ" },
      espresso_shots: { en: "Espresso Shots", kh: "ការបាញ់កាហ្វេ" },
      whipped: { en: "Whipped Cream", kh: "ក្រែមវីប" },
      whipped_cream: { en: "Whipped Cream", kh: "ក្រែមវីប" },
      bread: { en: "Bread Type", kh: "ប្រភេទនំបុ័ង" },
      bread_type: { en: "Bread Type", kh: "ប្រភេទនំបុ័ង" },
      toppings: { en: "Toppings", kh: "គ្រឿងលាប" },
      ice: { en: "Ice Level", kh: "កម្រិតទឹកកក" },
      ice_level: { en: "Ice Level", kh: "កម្រិតទឹកកក" },
      temperature: { en: "Temperature", kh: "សីតុណ្ហភាព" },
    }

    return optionMap[optionType]?.[language] || optionType
  }

  // Use dynamic theme background for menu
  const modalBackgroundStyle = {
    background: COLORS.background.menu,
  }

  const primaryColor = COLORS.primary[600]
  const primaryDarkColor = COLORS.primary[700]
  const primaryLightColor = COLORS.primary[50]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md max-h-[90vh] overflow-hidden p-0 sm:max-w-lg border-0"
        style={modalBackgroundStyle}
      >
        <DialogHeader 
          className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 bg-white/50 backdrop-blur-sm"
        >
          <DialogTitle 
            className="font-serif text-xl sm:text-2xl leading-tight"
            style={{ color: primaryDarkColor }}
          >
            {language === "en" ? product.name : product.name_kh}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-5 sm:space-y-6 px-5 sm:px-6 pb-32 sm:pb-36">
            <div className="relative -mx-5 sm:-mx-6">
              <img
                src={product.image || "/placeholder.svg"}
                alt={language === "en" ? product.name : product.name_kh}
                className="w-full h-64 sm:h-72 object-cover"
              />
              <Badge 
                className="absolute top-4 right-4 text-white border-0 text-base sm:text-lg px-4 py-1.5 shadow-lg rounded-full font-semibold"
                style={{ backgroundColor: primaryColor }}
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            {(product.description || product.description_kh) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-sm">
                <p 
                  className="text-sm sm:text-base leading-relaxed"
                  style={{ color: COLORS.text.primary }}
                >
                  {language === "en" ? product.description : product.description_kh || product.description}
                </p>
              </div>
            )}

            {product.options && Object.keys(product.options).length > 0 && (
              <div className="space-y-5 sm:space-y-6">
                {Object.entries(product.options).map(([optionType, options]) => (
                  <div key={optionType} className="space-y-3">
                    <h4 
                      className="font-semibold text-sm sm:text-base tracking-tight"
                      style={{ color: COLORS.text.primary }}
                    >
                      {getOptionDisplayName(optionType)}
                    </h4>

                    <div className="flex flex-wrap gap-2 sm:gap-2.5">
                      {options.map((option) => {
                        const isSelected = selectedOptions[optionType] === option.name
                        return (
                          <button
                            key={option.name}
                            onClick={() => handleOptionChange(optionType, option.name, option.price)}
                            className={cn(
                              "px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-200 min-h-[44px] sm:min-h-[48px]",
                              "border-2 active:scale-95",
                              isSelected
                                ? "text-white shadow-md"
                                : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                            )}
                            style={{
                              backgroundColor: isSelected ? primaryColor : 'white',
                              borderColor: isSelected ? primaryColor : COLORS.border.light,
                            }}
                          >
                            {option.name}
                            {option.price > 0 && (
                              <span className={cn("ml-1.5", isSelected ? "text-white/90" : "text-stone-600")}>
                                +${option.price.toFixed(2)}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-sm">
              <h4 
                className="font-semibold text-center mb-4 text-sm sm:text-base"
                style={{ color: COLORS.text.primary }}
              >
                {language === "en" ? "Quantity" : "បរិមាណ"}
              </h4>
              <div className="flex items-center justify-center gap-6 sm:gap-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                  style={{
                    borderColor: COLORS.border.light,
                    color: COLORS.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.borderColor = primaryColor
                      e.currentTarget.style.backgroundColor = primaryLightColor
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (quantity > 1) {
                      e.currentTarget.style.borderColor = COLORS.border.light
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Minus className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>

                <span 
                  className="text-3xl sm:text-4xl font-bold min-w-[3rem] text-center"
                  style={{ color: primaryColor }}
                >
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full w-12 h-12 sm:w-14 sm:h-14 border-2 transition-all active:scale-90"
                  style={{
                    borderColor: COLORS.border.light,
                    color: COLORS.text.primary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = primaryColor
                    e.currentTarget.style.backgroundColor = primaryLightColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border.light
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Plus className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-sm">
              <div className="flex justify-between text-sm sm:text-base">
                <span style={{ color: COLORS.text.secondary }}>{language === "en" ? "Base price" : "តម្លៃមូលដ្ឋាន"}</span>
                <span className="font-medium" style={{ color: COLORS.text.primary }}>${product.price.toFixed(2)}</span>
              </div>

              {Object.entries(selectedOptionsPricing).map(([optionType, price]) => {
                if (price > 0) {
                  return (
                    <div key={optionType} className="flex justify-between text-sm">
                      <span style={{ color: COLORS.text.secondary }}>
                        {getOptionDisplayName(optionType)}: {selectedOptions[optionType]}
                      </span>
                      <span className="font-medium" style={{ color: primaryColor }}>+${price.toFixed(2)}</span>
                    </div>
                  )
                }
                return null
              })}

              <div className="border-t border-stone-200 pt-2.5 flex justify-between font-semibold text-base sm:text-lg">
                <span style={{ color: COLORS.text.primary }}>{language === "en" ? "Item total" : "សរុបធាតុ"}</span>
                <span style={{ color: primaryColor }}>${calculateBasePriceWithOptions().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-md border-t border-stone-200 shadow-2xl px-5 sm:px-6 py-4 sm:py-5">
          <div className="max-w-md mx-auto flex justify-between items-center gap-4 sm:gap-5">
            <div className="flex flex-col">
              <span className="text-xs" style={{ color: COLORS.text.secondary }}>{language === "en" ? "Total" : "សរុប"}</span>
              <span 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: primaryColor }}
              >
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>

            <Button
              onClick={handleAddToCart}
              className="text-base sm:text-lg py-3 sm:py-3.5 px-8 sm:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-white active:scale-95 font-semibold whitespace-nowrap"
              style={{
                backgroundColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = primaryDarkColor
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = primaryColor
              }}
            >
              {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}