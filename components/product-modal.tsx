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
      <div key={optionType} className="space-y-3">
        <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
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
          className="space-y-2"
        >
          {options.map((option) => (
            <div
              key={option.name}
              className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                <span className="text-sm font-medium">{option.name}</span>
                {option.price > 0 && (
                  <span className="text-amber-600 font-semibold bg-amber-50 dark:bg-amber-900/30 px-2 py-1 text-sm">
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
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] max-h-[95vh] overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
          <DialogTitle className="font-serif text-xl sm:text-2xl text-amber-600 leading-tight pr-8">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-6">
            {/* Product Image */}
            <div className="relative">
              <div className="overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 object-cover"
                />
              </div>
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 bg-white text-amber-600 text-base font-bold px-3 py-2 border border-amber-200"
              >
                ${product.price.toFixed(2)}
              </Badge>
            </div>

            {/* Description */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Sub Items */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-1 w-8 bg-amber-600"></div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
                  {language === "en" ? "Customize Your Items" : "កំណត់ទំនិញរបស់អ្នក"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subItems.map((subItem, subItemIndex) => (
                  <div
                    key={subItemIndex}
                    className="bg-white dark:bg-gray-800 p-4 border-2 border-gray-200 dark:border-gray-700 relative"
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                          {subItemIndex + 1}
                        </div>
                        <h4 className="font-bold text-base text-gray-800 dark:text-gray-200">
                          {language === "en" ? `Item ${subItemIndex + 1}` : `ទំនិញ ${subItemIndex + 1}`}
                        </h4>
                      </div>
                      {subItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 h-8 w-8"
                          onClick={() => handleRemoveSubItem(subItemIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 mb-4 border border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-base text-gray-800 dark:text-gray-200 mb-4">
                        {language === "en" ? "Quantity" : "បរិមាណ"}
                      </h4>
                      <div className="flex items-center justify-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(subItemIndex, subItem.quantity - 1)}
                          disabled={subItem.quantity <= 1}
                          className="h-10 w-10 border-2 border-gray-300 dark:border-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-2xl font-bold w-12 text-center text-amber-600">{subItem.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(subItemIndex, subItem.quantity + 1)}
                          className="h-10 w-10 border-2 border-gray-300 dark:border-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-4">{renderOptionsForSubItem(subItemIndex, subItem)}</div>

                    {/* Item Total */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="bg-amber-50 dark:bg-amber-900/30 p-3 border border-amber-200 dark:border-amber-600">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-gray-800 dark:text-gray-200 text-sm">
                            {language === "en" ? "Item Total:" : "សរុបទំនិញ:"}
                          </span>
                          <span className="text-amber-600 text-lg">${calculateItemPrice(subItem).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Another Item Button */}
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleAddSubItem}
                  variant="outline"
                  className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-6 py-3 text-sm font-semibold bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add Another Item" : "បន្ថែមទំនិញមួយទៀត"}
                </Button>
              </div>
            </div>

            {/* Total Price & Add to Cart */}
            <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span className="text-gray-800 dark:text-gray-200">{language === "en" ? "Total:" : "សរុប:"}</span>
                  <span className="text-amber-600">${calculateTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              <Button
                onClick={handleAddAllToCart}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg font-bold py-6"
              >
                {language === "en" ? "Add All to Cart" : "បន្ថែមទាំងអស់ទៅកន្ត្រក"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
