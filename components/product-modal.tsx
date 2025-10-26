"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, X } from "lucide-react"
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

interface AddedItem {
  id: string
  quantity: number
  options: Record<string, string>
  optionsPricing: Record<string, number>
  basePrice: number
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, language }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedOptionsPricing, setSelectedOptionsPricing] = useState<Record<string, number>>({})
  const [addedItems, setAddedItems] = useState<AddedItem[]>([])

  useEffect(() => {
    if (product && isOpen) {
      setQuantity(1)
      setAddedItems([])
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

  const handleAddItem = () => {
    const newItem: AddedItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quantity,
      options: { ...selectedOptions },
      optionsPricing: { ...selectedOptionsPricing },
      basePrice: product.price,
    }

    setAddedItems((prev) => [...prev, newItem])
    setQuantity(1) // Reset quantity for next item
    
    // Reset options to defaults for next item
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

  const handleRemoveAddedItem = (itemId: string) => {
    setAddedItems((prev) => prev.filter(item => item.id !== itemId))
  }

  const handleAddAllToCart = () => {
    addedItems.forEach((item) => {
      const cartItem: CartItem = {
        id: `${product.id}-${item.id}`,
        productId: product.id,
        name: language === "en" ? product.name : product.name_kh,
        price: (item.basePrice + Object.values(item.optionsPricing).reduce((sum, price) => sum + price, 0)) * item.quantity,
        quantity: item.quantity,
        options: item.options,
        optionsPricing: item.optionsPricing,
      }
      onAddToCart(cartItem)
    })
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

  const getTotalItemsCount = () => {
    return addedItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getOptionsSummary = (options: Record<string, string>) => {
    return Object.entries(options)
      .map(([key, value]) => `${getOptionDisplayName(key)}: ${value}`)
      .join(", ")
  }

  const modalBackgroundStyle = {
    background: COLORS.background.gradient,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-hidden p-0 sm:max-w-lg border-0 shadow-2xl"
        style={modalBackgroundStyle}
      >
        <DialogHeader
          className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b relative"
          style={{
            backgroundColor: COLORS.background.primary,
            borderColor: COLORS.border.light,
          }}
        >
          <DialogTitle className="font-serif text-lg sm:text-2xl leading-tight pr-12" style={{ color: COLORS.text.primary }}>
            {language === "en" ? product.name : product.name_kh}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-3 top-3 h-8 w-8 rounded-full"
            style={{
              color: COLORS.text.secondary,
              backgroundColor: COLORS.background.primary,
            }}
          >
           
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-28 sm:pb-32">
            {/* Added Items Preview */}
            {addedItems.length > 0 && (
              <div
                className="rounded-xl p-3 sm:p-4 shadow-sm border"
                style={{
                  backgroundColor: COLORS.background.primary,
                  borderColor: COLORS.border.light,
                }}
              >
                <h4 className="font-semibold text-sm sm:text-base mb-2" style={{ color: COLORS.text.primary }}>
                  {language === "en" ? "Items to Add" : "ធាតុដែលត្រូវបន្ថែម"} ({getTotalItemsCount()})
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {addedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg text-xs sm:text-sm"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium" style={{ color: COLORS.text.primary }}>
                          {item.quantity}x {language === "en" ? product.name : product.name_kh}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.text.secondary }}>
                          {getOptionsSummary(item.options)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAddedItem(item.id)}
                        className="h-6 w-6 rounded-full ml-2 flex-shrink-0"
                        style={{
                          color: COLORS.text.secondary,
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative -mx-4 sm:-mx-6">
              <img
                src={product.image || "/placeholder.svg"}
                alt={language === "en" ? product.name : product.name_kh}
                className="w-full h-48 sm:h-72 object-cover"
              />
              <Badge
                className="absolute top-3 right-3 text-white border-0 text-sm sm:text-lg px-3 py-1 sm:px-4 sm:py-1.5 shadow-lg rounded-full font-semibold"
                style={{ backgroundColor: COLORS.primary[600] }}
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            {(product.description || product.description_kh) && (
              <div
                className="rounded-xl p-3 sm:p-5 shadow-sm border"
                style={{
                  backgroundColor: COLORS.background.primary,
                  borderColor: COLORS.border.light,
                }}
              >
                <p className="text-xs sm:text-base leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {language === "en" ? product.description : product.description_kh || product.description}
                </p>
              </div>
            )}

            {product.options && Object.keys(product.options).length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                {Object.entries(product.options).map(([optionType, options]) => (
                  <div key={optionType} className="space-y-2 sm:space-y-3">
                    <h4
                      className="font-semibold text-xs sm:text-base tracking-tight"
                      style={{ color: COLORS.text.primary }}
                    >
                      {getOptionDisplayName(optionType)}
                    </h4>

                    <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
                      {options.map((option) => {
                        const isSelected = selectedOptions[optionType] === option.name
                        return (
                          <button
                            key={option.name}
                            onClick={() => handleOptionChange(optionType, option.name, option.price)}
                            className={cn(
                              "px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs sm:text-base font-medium transition-all duration-200 min-h-[40px] sm:min-h-[48px]",
                              "border-2 active:scale-95 shadow-sm",
                            )}
                            style={{
                              backgroundColor: isSelected ? COLORS.primary[600] : COLORS.background.primary,
                              color: isSelected ? COLORS.text.inverse : COLORS.text.primary,
                              borderColor: isSelected ? COLORS.primary[600] : COLORS.border.light,
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = COLORS.primary[600]
                                e.currentTarget.style.backgroundColor = COLORS.primary[50]
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = COLORS.border.light
                                e.currentTarget.style.backgroundColor = COLORS.background.primary
                              }
                            }}
                          >
                            {option.name}
                            {option.price > 0 && (
                              <span
                                className="ml-1"
                                style={{
                                  color: isSelected ? COLORS.text.inverse : COLORS.text.secondary,
                                  opacity: isSelected ? 0.9 : 1,
                                }}
                              >
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

            <div
              className="rounded-xl p-4 sm:p-6 shadow-sm border"
              style={{
                backgroundColor: COLORS.background.primary,
                borderColor: COLORS.border.light,
              }}
            >
              <h4
                className="font-semibold text-center mb-3 text-sm sm:text-base"
                style={{ color: COLORS.text.primary }}
              >
                {language === "en" ? "Quantity" : "បរិមាណ"}
              </h4>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-full w-10 h-10 sm:w-14 sm:h-14 border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.background.primary,
                  }}
                >
                  <Minus className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>

                <span
                  className="text-2xl sm:text-4xl font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center"
                  style={{ color: COLORS.primary[600] }}
                >
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full w-10 h-10 sm:w-14 sm:h-14 border-2 transition-all active:scale-90"
                  style={{
                    borderColor: COLORS.border.medium,
                    color: COLORS.text.primary,
                    backgroundColor: COLORS.background.primary,
                  }}
                >
                  <Plus className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
              </div>
            </div>

            <div
              className="rounded-xl p-3 sm:p-5 space-y-2 shadow-sm border"
              style={{
                backgroundColor: COLORS.background.primary,
                borderColor: COLORS.border.light,
              }}
            >
              <div className="flex justify-between text-xs sm:text-base">
                <span style={{ color: COLORS.text.secondary }}>{language === "en" ? "Base price" : "តម្លៃមូលដ្ឋាន"}</span>
                <span className="font-medium" style={{ color: COLORS.text.primary }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {Object.entries(selectedOptionsPricing).map(([optionType, price]) => {
                if (price > 0) {
                  return (
                    <div key={optionType} className="flex justify-between text-xs sm:text-sm">
                      <span style={{ color: COLORS.text.secondary }}>
                        {getOptionDisplayName(optionType)}: {selectedOptions[optionType]}
                      </span>
                      <span className="font-medium" style={{ color: COLORS.primary[600] }}>
                        +${price.toFixed(2)}
                      </span>
                    </div>
                  )
                }
                return null
              })}

              <div
                className="pt-2 flex justify-between font-semibold text-sm sm:text-lg border-t"
                style={{ borderColor: COLORS.border.light }}
              >
                <span style={{ color: COLORS.text.primary }}>{language === "en" ? "Item total" : "សរុបធាតុ"}</span>
                <span style={{ color: COLORS.primary[600] }}>${calculateBasePriceWithOptions().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 px-4 sm:px-6 py-3 sm:py-5 border-t shadow-2xl"
          style={{
            background: `linear-gradient(to top, ${COLORS.background.primary} 0%, ${COLORS.background.primary} 80%, ${COLORS.background.primary}CC 100%)`,
            backdropFilter: "blur(12px)",
            borderColor: COLORS.border.light,
          }}
        >
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 sm:gap-5">
            <div className="flex justify-between items-center sm:flex-col sm:items-start sm:justify-center">
              <span className="text-xs" style={{ color: COLORS.text.secondary }}>
                {language === "en" ? "Current Item" : "ធាតុបច្ចុប្បន្ន"}
              </span>
              <span className="text-xl sm:text-3xl font-bold" style={{ color: COLORS.primary[600] }}>
                ${calculateTotalPrice().toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-1">
              <Button
                onClick={handleAddItem}
                variant="outline"
                className="flex-1 text-sm sm:text-base py-2.5 sm:py-3.5 rounded-full border-2 font-medium whitespace-nowrap"
                style={{
                  borderColor: COLORS.primary[600],
                  color: COLORS.primary[600],
                  backgroundColor: COLORS.background.primary,
                }}
              >
                {language === "en" ? "Add Item" : "បន្ថែមធាតុ"}
              </Button>

              <Button
                onClick={handleAddAllToCart}
                disabled={addedItems.length === 0}
                className="flex-1 text-sm sm:text-base py-2.5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-white active:scale-95 font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: addedItems.length > 0 ? COLORS.primary[600] : COLORS.border.medium,
                }}
              >
                {language === "en" ? `Add All (${getTotalItemsCount()})` : `បន្ថែមទាំងអស់ (${getTotalItemsCount()})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}