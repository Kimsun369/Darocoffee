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
    setQuantity(1)

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
    setAddedItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleAddAllToCart = () => {
    addedItems.forEach((item) => {
      const cartItem: CartItem = {
        id: `${product.id}-${item.id}`,
        productId: product.id,
        name: language === "en" ? product.name : product.name_kh,
        price:
          (item.basePrice + Object.values(item.optionsPricing).reduce((sum, price) => sum + price, 0)) * item.quantity,
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
          className="px-6 pt-6 pb-4 border-b"
          style={{
            backgroundColor: COLORS.background.primary,
            borderColor: COLORS.border.light,
          }}
        >
          <DialogTitle
            className="font-serif text-xl text-center"
            style={{ color: COLORS.text.primary }}
          >
            {language === "en" ? product.name : product.name_kh}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6 px-6 pb-32">
            {addedItems.length > 0 && (
              <div
                className="rounded-xl p-4 shadow-lg border-2"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary[50]} 0%, ${COLORS.background.primary} 100%)`,
                  borderColor: COLORS.primary[200],
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm" style={{ color: COLORS.primary[700] }}>
                    {language === "en" ? "Items to Add" : "មុខទំនិញដែលត្រូវបន្ថែម"}
                  </h4>
                  <div
                    className="px-3 py-1 rounded-full font-bold text-xs"
                    style={{
                      backgroundColor: COLORS.primary[600],
                      color: COLORS.text.inverse,
                    }}
                  >
                    {getTotalItemsCount()}
                  </div>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {addedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg text-sm border group"
                      style={{
                        backgroundColor: COLORS.background.primary,
                        borderColor: COLORS.primary[100],
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold" style={{ color: COLORS.text.primary }}>
                          {item.quantity}x {language === "en" ? product.name : product.name_kh}
                        </div>
                        <div className="text-xs mt-1" style={{ color: COLORS.text.secondary }}>
                          {getOptionsSummary(item.options)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAddedItem(item.id)}
                        className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          color: COLORS.semantic.error,
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative -mx-6">
              <img
                src={product.image || "/placeholder.svg"}
                alt={language === "en" ? product.name : product.name_kh}
                className="w-full h-64 object-cover"
              />
              <Badge
                className="absolute top-4 right-4 text-white border-0 text-lg px-4 py-2 rounded-full font-bold"
                style={{
                  background: `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[700]} 100%)`,
                }}
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            {(product.description || product.description_kh) && (
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: COLORS.background.primary,
                  borderColor: COLORS.border.light,
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: COLORS.text.secondary }}>
                  {language === "en" ? product.description : product.description_kh || product.description}
                </p>
              </div>
            )}

            {product.options && Object.keys(product.options).length > 0 && (
              <div className="space-y-4">
                {Object.entries(product.options).map(([optionType, options]) => (
                  <div key={optionType} className="space-y-3">
                    <h4 className="font-bold text-sm" style={{ color: COLORS.text.primary }}>
                      {getOptionDisplayName(optionType)}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const isSelected = selectedOptions[optionType] === option.name
                        return (
                          <button
                            key={option.name}
                            onClick={() => handleOptionChange(optionType, option.name, option.price)}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                              isSelected && "shadow-md"
                            )}
                            style={{
                              backgroundColor: isSelected ? COLORS.primary[600] : COLORS.background.primary,
                              color: isSelected ? COLORS.text.inverse : COLORS.text.primary,
                              borderColor: isSelected ? COLORS.primary[600] : COLORS.border.light,
                            }}
                          >
                            {option.name}
                            {option.price > 0 && (
                              <span className="ml-1 font-bold" style={{ color: isSelected ? COLORS.text.inverse : COLORS.primary[600] }}>
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
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: COLORS.background.primary,
                borderColor: COLORS.border.light,
              }}
            >
              <h4 className="font-bold text-center mb-3 text-sm" style={{ color: COLORS.text.primary }}>
                {language === "en" ? "Quantity" : "បរិមាណ"}
              </h4>
              <div className="flex items-center justify-center gap-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="rounded-full w-12 h-12 border-2"
                  style={{
                    borderColor: quantity <= 1 ? COLORS.border.light : COLORS.primary[600],
                    color: COLORS.text.primary,
                  }}
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <span className="text-3xl font-bold min-w-[3rem] text-center" style={{ color: COLORS.primary[600] }}>
                  {quantity}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  className="rounded-full w-12 h-12 border-2"
                  style={{
                    borderColor: COLORS.primary[600],
                    color: COLORS.text.primary,
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div
              className="rounded-xl p-4 space-y-2 border"
              style={{
                backgroundColor: COLORS.background.primary,
                borderColor: COLORS.border.light,
              }}
            >
              <div className="flex justify-between text-sm">
                <span style={{ color: COLORS.text.secondary }}>
                  {language === "en" ? "Base price" : "តម្លៃមូលដ្ឋាន"}
                </span>
                <span className="font-semibold" style={{ color: COLORS.text.primary }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>

              {Object.entries(selectedOptionsPricing).map(([optionType, price]) => {
                if (price > 0) {
                  return (
                    <div key={optionType} className="flex justify-between text-sm">
                      <span style={{ color: COLORS.text.secondary }}>
                        {getOptionDisplayName(optionType)}: {selectedOptions[optionType]}
                      </span>
                      <span className="font-semibold" style={{ color: COLORS.primary[600] }}>
                        +${price.toFixed(2)}
                      </span>
                    </div>
                  )
                }
                return null
              })}

              <div className="pt-3 flex justify-between font-bold text-lg border-t" style={{ borderColor: COLORS.primary[200] }}>
                <span style={{ color: COLORS.text.primary }}>{language === "en" ? "Item total" : "សរុបមុខទំនិញ"}</span>
                <span style={{ color: COLORS.primary[600] }}>${calculateBasePriceWithOptions().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 px-6 py-4 border-t shadow-2xl"
          style={{
            backgroundColor: COLORS.background.primary,
            borderColor: COLORS.border.medium,
          }}
        >
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold" style={{ color: COLORS.text.secondary }}>
                {language === "en" ? "Current Item" : "មុខទំនិញបច្ចុប្បន្ន"}
              </div>
              <div className="text-2xl font-bold" style={{ color: COLORS.primary[600] }}>
                ${calculateTotalPrice().toFixed(2)}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAddItem}
                variant="outline"
                className="px-6 py-2.5 rounded-full border-2 font-semibold"
                style={{
                  borderColor: COLORS.primary[600],
                  color: COLORS.primary[600],
                }}
              >
                {language === "en" ? "Add Item" : "បន្ថែមមុខទំនិញ"}
              </Button>

              <Button
                onClick={handleAddAllToCart}
                disabled={addedItems.length === 0}
                className="px-6 py-2.5 rounded-full text-white font-bold"
                style={{
                  background: addedItems.length > 0
                    ? `linear-gradient(135deg, ${COLORS.primary[500]} 0%, ${COLORS.primary[700]} 100%)`
                    : COLORS.border.medium,
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