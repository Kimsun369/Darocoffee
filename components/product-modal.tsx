"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  description: string
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

interface SubItem {
  options: Record<string, string>
  optionsPricing: Record<string, number>
  quantity: number
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItem) => void
  language: "en" | "kh"
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, language }: ProductModalProps) {
  const [subItems, setSubItems] = useState<SubItem[]>([])

  const getDefaultOptions = (
    product: Product | null,
  ): { options: Record<string, string>; optionsPricing: Record<string, number> } => {
    const defaultOptions: Record<string, string> = {}
    const defaultPricing: Record<string, number> = {}

    if (product?.options) {
      Object.entries(product.options).forEach(([key, options]) => {
        if (options.length > 0) {
          defaultOptions[key] = options[0].name
          defaultPricing[key] = options[0].price
        }
      })
    }

    return { options: defaultOptions, optionsPricing: defaultPricing }
  }

  useEffect(() => {
    if (product && isOpen) {
      const defaults = getDefaultOptions(product)
      setSubItems([
        {
          ...defaults,
          quantity: 1,
        },
      ])
    }
  }, [product, isOpen])

  if (!product) return null

  const handleOptionChange = (subItemIndex: number, optionType: string, optionName: string, optionPrice: number) => {
    setSubItems((prev) =>
      prev.map((item, idx) => {
        if (idx === subItemIndex) {
          return {
            ...item,
            options: { ...item.options, [optionType]: optionName },
            optionsPricing: { ...item.optionsPricing, [optionType]: optionPrice },
          }
        }
        return item
      }),
    )
  }

  const handleQuantityChange = (subItemIndex: number, newQuantity: number) => {
    setSubItems((prev) =>
      prev.map((item, idx) => {
        if (idx === subItemIndex) {
          return { ...item, quantity: Math.max(1, newQuantity) }
        }
        return item
      }),
    )
  }

  const calculateItemPrice = (subItem: SubItem) => {
    const basePrice = product.price
    const optionsPrice = Object.values(subItem.optionsPricing).reduce((sum, price) => sum + price, 0)
    return (basePrice + optionsPrice) * subItem.quantity
  }

  const calculateTotalPrice = () => {
    return subItems.reduce((sum, item) => sum + calculateItemPrice(item), 0)
  }

  const handleAddSubItem = () => {
    const defaults = getDefaultOptions(product)
    setSubItems((prev) => [...prev, { ...defaults, quantity: 1 }])
  }

  const handleRemoveSubItem = (index: number) => {
    if (subItems.length > 1) {
      setSubItems((prev) => prev.filter((_, idx) => idx !== index))
    }
  }

  const handleAddAllToCart = () => {
    subItems.forEach((subItem) => {
      const cartItem: CartItem = {
        id: `${product.id}-${Date.now()}-${Math.random()}`,
        productId: product.id,
        name: product.name,
        price: calculateItemPrice(subItem),
        quantity: 1, // Each subItem represents one cart entry with its own quantity handled internally
        options: subItem.options,
        optionsPricing: subItem.optionsPricing,
      }
      onAddToCart(cartItem)
    })
    onClose()
  }

  const renderOptionsForSubItem = (subItemIndex: number, subItem: SubItem) => {
    if (!product.options) return null

    return Object.entries(product.options).map(([optionType, options]) => (
      <div key={optionType} className="space-y-4">
        <h4 className="font-semibold capitalize text-base sm:text-lg text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
          {optionType === "size" && language === "en" && "Size"}
          {optionType === "size" && language === "kh" && "ទំហំ"}
          {optionType === "sugar" && language === "en" && "Sugar Level"}
          {optionType === "sugar" && language === "kh" && "កម្រិតស្ករ"}
          {optionType === "milk" && language === "en" && "Milk Type"}
          {optionType === "milk" && language === "kh" && "ប្រភេទទឹកដោះគោ"}
          {optionType === "shots" && language === "en" && "Espresso Shots"}
          {optionType === "shots" && language === "kh" && "ការបាញ់កាហ្វេ"}
          {optionType === "whipped" && language === "en" && "Whipped Cream"}
          {optionType === "whipped" && language === "kh" && "ក្រែមវីប"}
          {optionType === "bread" && language === "en" && "Bread Type"}
          {optionType === "bread" && language === "kh" && "ប្រភេទនំបុ័ង"}
          {optionType === "toppings" && language === "en" && "Toppings"}
          {optionType === "toppings" && language === "kh" && "គ្រឿងលាប"}
          {!["size", "sugar", "milk", "shots", "whipped", "bread", "toppings"].includes(optionType) && optionType}
        </h4>
        <RadioGroup
          value={subItem.options[optionType]}
          onValueChange={(value) => {
            const option = options.find((opt) => opt.name === value)
            if (option) {
              handleOptionChange(subItemIndex, optionType, option.name, option.price)
            }
          }}
          className="space-y-3"
        >
          {options.map((option) => (
            <div
              key={option.name}
              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RadioGroupItem
                value={option.name}
                id={`${subItemIndex}-${optionType}-${option.name}`}
                className="border-2 border-gray-300 dark:border-gray-600"
              />
              <Label
                htmlFor={`${subItemIndex}-${optionType}-${option.name}`}
                className="flex-1 cursor-pointer flex justify-between items-center text-gray-700 dark:text-gray-300"
              >
                <span className="text-sm sm:text-base font-medium">{option.name}</span>
                {option.price > 0 && (
                  <span className="text-[var(--coffee-primary)] font-semibold bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded-md text-sm">
                    +${option.price.toFixed(2)}
                  </span>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] sm:w-[90vw] md:w-[85vw] max-h-[95vh] overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl rounded-2xl sm:rounded-3xl">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="font-serif text-xl sm:text-2xl md:text-3xl text-[var(--coffee-primary)] leading-tight pr-8">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-6 sm:space-y-8">
            {/* Product Image */}
            <div className="relative group">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 md:h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <Badge
                variant="secondary"
                className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm text-[var(--coffee-primary)] text-base sm:text-lg font-bold px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg border-0"
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 sm:p-6">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Sub Items */}
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center space-x-2">
                <div className="h-1 w-8 bg-[var(--coffee-primary)] rounded-full"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {language === "en" ? "Customize Your Items" : "កំណត់ទំនិញរបស់អ្នក"}
                </h3>
              </div>

              {subItems.map((subItem, subItemIndex) => (
                <div
                  key={subItemIndex}
                  className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--coffee-primary)]/5 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--coffee-primary)] flex items-center justify-center text-white font-bold text-sm">
                        {subItemIndex + 1}
                      </div>
                      <h4 className="font-bold text-base sm:text-lg md:text-xl text-gray-800 dark:text-gray-200">
                        {language === "en" ? `Item ${subItemIndex + 1}` : `ទំនិញ ${subItemIndex + 1}`}
                      </h4>
                    </div>
                    {subItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-full h-8 w-8 sm:h-10 sm:w-10"
                        onClick={() => handleRemoveSubItem(subItemIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 mb-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200 mb-4">
                      {language === "en" ? "Quantity" : "បរិមាណ"}
                    </h4>
                    <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(subItemIndex, subItem.quantity - 1)}
                        disabled={subItem.quantity <= 1}
                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-gray-300 dark:border-gray-600 hover:border-[var(--coffee-primary)] transition-colors"
                      >
                        <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                      <span className="text-2xl sm:text-3xl font-bold w-12 sm:w-16 text-center text-[var(--coffee-primary)]">
                        {subItem.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(subItemIndex, subItem.quantity + 1)}
                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-gray-300 dark:border-gray-600 hover:border-[var(--coffee-primary)] transition-colors"
                      >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-6">{renderOptionsForSubItem(subItemIndex, subItem)}</div>

                  {/* Item Total */}
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                    <div className="bg-gradient-to-r from-[var(--coffee-primary)]/10 to-orange-100/50 dark:from-[var(--coffee-primary)]/20 dark:to-orange-900/30 rounded-xl p-4 sm:p-5">
                      <div className="flex justify-between items-center font-bold text-base sm:text-lg">
                        <span className="text-gray-800 dark:text-gray-200">
                          {language === "en" ? "Item Total:" : "សរុបទំនិញ:"}
                        </span>
                        <span className="text-[var(--coffee-primary)] text-xl sm:text-2xl">
                          ${calculateItemPrice(subItem).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Item Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleAddSubItem}
                  variant="outline"
                  className="border-2 border-[var(--coffee-primary)] text-[var(--coffee-primary)] hover:bg-[var(--coffee-primary)] hover:text-white rounded-full px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 shadow-lg bg-transparent"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {language === "en" ? "Add Another Item" : "បន្ថែមទំនិញមួយទៀត"}
                </Button>
              </div>
            </div>

            {/* Total Price & Add to Cart */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 pt-6 -mx-4 sm:-mx-6 px-4 sm:px-6 -mb-4 sm:-mb-6 pb-4 sm:pb-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex justify-between items-center text-xl sm:text-2xl md:text-3xl font-bold">
                    <span className="text-gray-800 dark:text-gray-200">{language === "en" ? "Total:" : "សរុប:"}</span>
                    <span className="text-[var(--coffee-primary)]">${calculateTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleAddAllToCart}
                  className="w-full coffee-gradient text-white hover:opacity-90 text-base sm:text-lg md:text-xl font-bold py-4 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {language === "en" ? "Add All to Cart" : "បន្ថែមទាំងអស់ទៅកន្ត្រក"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
