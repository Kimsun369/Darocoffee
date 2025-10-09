// ProductModal.tsx
"use client"

import { useState, useEffect } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Product {
  id: number
  name: string
  name_kh: string
  image: string
  price: number
  category: string
  description: string
  description_kh: string
  options?: Record<string, Array<{ name: string; price: number }>>
}

interface CartItem {
  id: string
  productId: number
  name: string
  name_kh: string
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
      // Reset state when modal opens with new product
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

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random()}`,
      productId: product.id,
      name: product.name,
      name_kh: product.name_kh,
      price: calculateTotalPrice(),
      quantity,
      options: selectedOptions,
      optionsPricing: selectedOptionsPricing,
    }

    onAddToCart(cartItem)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`font-serif text-2xl ${language === "kh" ? "font-mono" : "font-sans"}`} style={{ color: "#d97706" }}>
            {language === "en" ? product.name : (product.name_kh || product.name)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image || "/placeholder.svg"}
              alt={language === "en" ? product.name : product.name_kh}
              className="w-full h-64 object-cover rounded-lg"
            />
            <Badge
              variant="secondary"
              className={`absolute top-4 right-4 bg-white/90 text-lg px-3 py-1 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: "#d97706" }}
            >
              ${product.price.toFixed(2)}
            </Badge>
          </div>

          {/* Description */}
          <p className={`leading-relaxed ${language === "kh" ? "font-mono" : "font-sans"}`} style={{ color: "#6b7280" }}>
            {language === "en" ? product.description : (product.description_kh || product.description)}
          </p>

          {/* Options */}
          {product.options &&
            Object.entries(product.options).map(([optionType, options]) => (
              <div key={optionType} className="space-y-3">
                <h4 className={`font-semibold capitalize text-lg ${language === "kh" ? "font-mono" : "font-sans"}`} style={{ color: "#1f2937" }}>
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
                  {!["size", "sugar", "milk", "shots", "whipped", "bread", "toppings"].includes(optionType) &&
                    optionType}
                </h4>
                <RadioGroup
                  value={selectedOptions[optionType]}
                  onValueChange={(value) => {
                    const option = options.find((opt) => opt.name === value)
                    if (option) {
                      handleOptionChange(optionType, option.name, option.price)
                    }
                  }}
                >
                  {options.map((option) => (
                    <div key={option.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.name} id={`${optionType}-${option.name}`} />
                      <Label
                        htmlFor={`${optionType}-${option.name}`}
                        className={`flex-1 cursor-pointer flex justify-between ${language === "kh" ? "font-mono" : "font-sans"}`}
                      >
                        <span>{option.name}</span>
                        {option.price > 0 && (
                          <span className="font-medium" style={{ color: "#d97706" }}>+${option.price.toFixed(2)}</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

          {/* Quantity */}
          <div className="space-y-3">
            <h4 className={`font-semibold text-lg ${language === "kh" ? "font-mono" : "font-sans"}`} style={{ color: "#1f2937" }}>
              {language === "en" ? "Quantity" : "បរិមាណ"}
            </h4>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className={`text-xl font-semibold w-8 text-center ${language === "kh" ? "font-mono" : "font-sans"}`}>
                {quantity}
              </span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Total Price & Add to Cart */}
          <div className="border-t pt-6 space-y-4">
            <div className={`flex justify-between items-center text-xl font-bold ${language === "kh" ? "font-mono" : "font-sans"}`}>
              <span>{language === "en" ? "Total:" : "សរុប:"}</span>
              <span style={{ color: "#d97706" }}>${calculateTotalPrice().toFixed(2)}</span>
            </div>
            <Button
              onClick={handleAddToCart}
              className={`w-full text-white hover:opacity-90 text-lg py-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
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