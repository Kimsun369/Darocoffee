"use client"

import { useState, useEffect } from "react"
import { Minus, Plus, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
        <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wide">
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
              className="flex items-center space-x-3 p-3 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <RadioGroupItem
                value={option.name}
                id={`${subItemIndex}-${optionType}-${option.name}`}
                className="border-gray-300"
              />
              <Label
                htmlFor={`${subItemIndex}-${optionType}-${option.name}`}
                className="flex-1 cursor-pointer flex justify-between items-center text-gray-700"
              >
                <span className="text-sm font-medium">{option.name}</span>
                {option.price > 0 && (
                  <span className="text-gray-900 font-medium text-sm">+${option.price.toFixed(2)}</span>
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
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] max-h-[95vh] overflow-hidden bg-white border border-gray-200">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-medium text-gray-900 text-center">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-6 pb-6">
          <div className="space-y-8">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-lg font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">{product.description}</p>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 text-center border-b border-gray-200 pb-4">
                {language === "en" ? "Customize Your Order" : "កំណត់ការបញ្ជាទិញរបស់អ្នក"}
              </h3>

              <div className="space-y-6">
                {subItems.map((subItem, subItemIndex) => (
                  <div key={subItemIndex} className="border border-gray-200 p-6 bg-white">
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                      <h4 className="font-medium text-gray-900">
                        {language === "en" ? `Item ${subItemIndex + 1}` : `ទំនិញ ${subItemIndex + 1}`}
                      </h4>
                      {subItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-gray-600 h-8 w-8"
                          onClick={() => handleRemoveSubItem(subItemIndex)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-sm text-gray-900 uppercase tracking-wide mb-4">
                        {language === "en" ? "Quantity" : "បរិមាណ"}
                      </h4>
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(subItemIndex, subItem.quantity - 1)}
                          disabled={subItem.quantity <= 1}
                          className="h-10 w-10 border-gray-300"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-medium w-12 text-center text-gray-900">{subItem.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(subItemIndex, subItem.quantity + 1)}
                          className="h-10 w-10 border-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-6">{renderOptionsForSubItem(subItemIndex, subItem)}</div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{language === "en" ? "Item Total:" : "សរុបទំនិញ:"}</span>
                        <span className="text-lg font-medium text-gray-900">
                          ${calculateItemPrice(subItem).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={handleAddSubItem}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "Add Another Item" : "បន្ថែមទំនិញមួយទៀត"}
                </Button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between items-center text-xl font-medium">
                <span className="text-gray-900">{language === "en" ? "Total:" : "សរុប:"}</span>
                <span className="text-gray-900">${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <Button
                onClick={handleAddAllToCart}
                className="w-full bg-gray-900 text-white hover:bg-gray-800 py-4 text-lg font-medium"
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
