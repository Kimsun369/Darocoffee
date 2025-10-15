"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (product && isOpen) {
      // Reset state when modal opens with new product
      setQuantity(1)
      const defaultOptions: Record<string, string> = {}
      const defaultPricing: Record<string, number> = {}
      const defaultExpanded: Record<string, boolean> = {}

      if (product.options) {
        Object.entries(product.options).forEach(([key, options]) => {
          if (options.length > 0) {
            defaultOptions[key] = options[0].name
            defaultPricing[key] = options[0].price
            defaultExpanded[key] = true // Expand first section by default
          }
        })
      }

      setSelectedOptions(defaultOptions)
      setSelectedOptionsPricing(defaultPricing)
      setExpandedSections(defaultExpanded)
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

  const toggleSection = (optionType: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [optionType]: !prev[optionType]
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

  // Helper function to get option display name
  const getOptionDisplayName = (optionType: string) => {
    const optionMap: Record<string, { en: string; kh: string }> = {
      'size': { en: 'Size', kh: 'ទំហំ' },
      'sugar': { en: 'Sugar Level', kh: 'កម្រិតស្ករ' },
      'sugar_level': { en: 'Sugar Level', kh: 'កម្រិតស្ករ' },
      'milk': { en: 'Milk Type', kh: 'ប្រភេទទឹកដោះគោ' },
      'milk_type': { en: 'Milk Type', kh: 'ប្រភេទទឹកដោះគោ' },
      'shots': { en: 'Espresso Shots', kh: 'ការបាញ់កាហ្វេ' },
      'espresso_shots': { en: 'Espresso Shots', kh: 'ការបាញ់កាហ្វេ' },
      'whipped': { en: 'Whipped Cream', kh: 'ក្រែមវីប' },
      'whipped_cream': { en: 'Whipped Cream', kh: 'ក្រែមវីប' },
      'bread': { en: 'Bread Type', kh: 'ប្រភេទនំបុ័ង' },
      'bread_type': { en: 'Bread Type', kh: 'ប្រភេទនំបុ័ង' },
      'toppings': { en: 'Toppings', kh: 'គ្រឿងលាប' },
      'ice': { en: 'Ice Level', kh: 'កម្រិតទឹកកក' },
      'ice_level': { en: 'Ice Level', kh: 'កម្រិតទឹកកក' },
      'temperature': { en: 'Temperature', kh: 'សីតុណ្ហភាព' },
    }

    return optionMap[optionType]?.[language] || optionType
  }

  const getOptionIcon = (optionType: string) => {
    const iconMap: Record<string, string> = {
      'size': '📏',
      'sugar': '🍬',
      'sugar_level': '🍬',
      'milk': '🥛',
      'milk_type': '🥛',
      'shots': '☕',
      'espresso_shots': '☕',
      'whipped': '💨',
      'whipped_cream': '💨',
      'bread': '🍞',
      'bread_type': '🍞',
      'toppings': '🍯',
      'ice': '🧊',
      'ice_level': '🧊',
      'temperature': '🌡️',
    }
    return iconMap[optionType] || '⚙️'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="font-serif text-2xl text-[var(--coffee-primary)] text-center">
            {language === "en" ? product.name : product.name_kh}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 px-6 pb-6">
          {/* Product Image */}
          <div className="relative -mx-6">
            <img
              src={product.image || "/placeholder.svg"}
              alt={language === "en" ? product.name : product.name_kh}
              className="w-full h-48 object-cover"
            />
            <Badge
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[var(--coffee-primary)] border-0 text-lg px-3 py-1.5 shadow-lg rounded-full font-semibold"
            >
              ${product.price.toFixed(2)}
            </Badge>
          </div>

          {/* Description */}
          {(product.description || product.description_kh) && (
            <p className="text-sm text-gray-600 text-center leading-relaxed">
              {language === "en" ? product.description : product.description_kh || product.description}
            </p>
          )}

          {/* Options */}
          {product.options && Object.keys(product.options).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-center text-gray-900">
                {language === "en" ? "Customize Your Order" : "ប្ដូរតាមតម្រូវការ"}
              </h3>
              
              {Object.entries(product.options).map(([optionType, options]) => (
                <div key={optionType} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                  {/* Option Header - Always visible */}
                  <button
                    onClick={() => toggleSection(optionType)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getOptionIcon(optionType)}</span>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">
                          {getOptionDisplayName(optionType)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedOptions[optionType]}
                        </p>
                      </div>
                    </div>
                    {expandedSections[optionType] ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>

                  {/* Option Choices - Collapsible */}
                  {expandedSections[optionType] && (
                    <div className="px-4 pb-3 border-t border-gray-100">
                      <div className="grid gap-2 pt-3">
                        {options.map((option) => {
                          const isSelected = selectedOptions[optionType] === option.name
                          return (
                            <button
                              key={option.name}
                              onClick={() => handleOptionChange(optionType, option.name, option.price)}
                              className={cn(
                                "w-full p-3 rounded-lg border-2 transition-all duration-200 text-left",
                                "flex items-center justify-between group",
                                "hover:border-[var(--coffee-primary)] hover:bg-[var(--coffee-primary)]/5",
                                isSelected
                                  ? "border-[var(--coffee-primary)] bg-[var(--coffee-primary)]/10"
                                  : "border-gray-200 bg-white"
                              )}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={cn(
                                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                  isSelected
                                    ? "border-[var(--coffee-primary)] bg-[var(--coffee-primary)]"
                                    : "border-gray-300 group-hover:border-[var(--coffee-primary)]/50"
                                )}>
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                <span className={cn(
                                  "font-medium",
                                  isSelected ? "text-[var(--coffee-primary)]" : "text-gray-900"
                                )}>
                                  {option.name}
                                </span>
                              </div>
                              {option.price > 0 && (
                                <span className={cn(
                                  "text-sm font-medium px-2 py-1 rounded-full min-w-[60px] text-center",
                                  isSelected
                                    ? "bg-[var(--coffee-primary)] text-white"
                                    : "bg-gray-100 text-gray-700 group-hover:bg-[var(--coffee-primary)]/10 group-hover:text-[var(--coffee-primary)]"
                                )}>
                                  +${option.price.toFixed(2)}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity Selector */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 text-center mb-3">
              {language === "en" ? "Quantity" : "បរិមាណ"}
            </h4>
            <div className="flex items-center justify-between max-w-xs mx-auto">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="rounded-full w-12 h-12 border-2 border-gray-300 hover:border-[var(--coffee-primary)] hover:bg-[var(--coffee-primary)]/5 transition-colors"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-[var(--coffee-primary)] w-12 text-center">
                  {quantity}
                </span>
                <span className="text-xs text-gray-600 mt-1">
                  {language === "en" ? "items" : "ធាតុ"}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-full w-12 h-12 border-2 border-gray-300 hover:border-[var(--coffee-primary)] hover:bg-[var(--coffee-primary)]/5 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{language === "en" ? "Base price" : "តម្លៃមូលដ្ឋាន"}</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
            
            {Object.entries(selectedOptionsPricing).map(([optionType, price]) => {
              if (price > 0) {
                return (
                  <div key={optionType} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {getOptionDisplayName(optionType)}: {selectedOptions[optionType]}
                    </span>
                    <span className="text-[var(--coffee-primary)]">+${price.toFixed(2)}</span>
                  </div>
                )
              }
              return null
            })}
            
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">{language === "en" ? "Item total" : "សរុបធាតុ"}</span>
              <span>${calculateBasePriceWithOptions().toFixed(2)}</span>
            </div>
          </div>

          {/* Total Price & Add to Cart */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-sm text-gray-600 block">
                  {language === "en" ? "Total" : "សរុប"}
                </span>
                <span className="text-2xl font-bold text-[var(--coffee-primary)]">
                  ${calculateTotalPrice().toFixed(2)}
                </span>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="text-lg py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-[var(--coffee-primary)] to-[var(--coffee-primary)]/90 hover:from-[var(--coffee-primary)]/90 hover:to-[var(--coffee-primary)] text-white"
              >
                {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}