"use client"

import { useState } from "react"
import { Plus, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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
  options?: Record<string, Array<{ name: string; price: number }>>
  discount?: number
  originalPrice?: number
  isDiscounted?: boolean
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
  const [optionsPricing, setOptionsPricing] = useState<Record<string, number>>({})

  if (!product) return null

  const handleOptionChange = (optionType: string, optionName: string, optionPrice: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionType]: optionName,
    }))
    setOptionsPricing((prev) => ({
      ...prev,
      [optionType]: optionPrice,
    }))
  }

  const calculateTotalPrice = () => {
    const basePrice = product.price
    const optionsTotal = Object.values(optionsPricing).reduce((sum, price) => sum + price, 0)
    return (basePrice + optionsTotal) * quantity
  }

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      name_kh: product.name_kh,
      price: calculateTotalPrice(),
      quantity,
      options: selectedOptions,
      optionsPricing,
    }

    onAddToCart(cartItem)
    onClose()
    setQuantity(1)
    setSelectedOptions({})
    setOptionsPricing({})
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "white",
          color: "#1f2937",
          border: "none",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
      >
        <DialogHeader className="relative pb-4 border-b border-gray-200">
          <DialogTitle className="text-2xl font-bold pr-8" style={{ color: "#1f2937" }}>
            {language === "en" ? product.name : product.name_kh}
          </DialogTitle>
         
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div
            className="relative aspect-video w-full overflow-hidden rounded-xl"
            style={{
              backgroundColor: "#f9fafb",
              animation: "scaleIn 0.4s ease-out",
            }}
          >
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
              style={{
                transition: "transform 0.3s ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"
              }}
            />
            {product.isDiscounted && product.discount && (
              <div
                className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "white",
                  animation: "pulse-glow 2s ease-in-out infinite",
                }}
              >
                -{product.discount}% OFF
              </div>
            )}
          </div>

          <div
            style={{
              animation: "slideUp 0.5s ease-out 0.1s both",
            }}
          >
            <h3 className="text-lg font-semibold mb-2" style={{ color: "#1f2937" }}>
              {language === "en" ? "Description" : "ការពិពណ៌នា"}
            </h3>
            <p className="leading-relaxed" style={{ color: "#6b7280" }}>
              {language === "en" ? product.description : product.description_kh}
            </p>
          </div>

          <div
            className="flex items-baseline gap-3"
            style={{
              animation: "slideUp 0.5s ease-out 0.2s both",
            }}
          >
            {product.isDiscounted && product.originalPrice ? (
              <>
                <span
                  className="text-3xl font-bold"
                  style={{
                    color: "#ef4444",
                    animation: "price-bounce 1s ease-in-out infinite",
                  }}
                >
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xl line-through" style={{ color: "#d97706" }}>
                  ${product.originalPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold" style={{ color: "#d97706" }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {product.options && Object.keys(product.options).length > 0 && (
            <div
              className="space-y-4"
              style={{
                animation: "slideUp 0.5s ease-out 0.3s both",
              }}
            >
              {Object.entries(product.options).map(([optionType, optionValues]) => (
                <div key={optionType}>
                  <h4 className="text-sm font-semibold mb-3 capitalize" style={{ color: "#1f2937" }}>
                    {optionType}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {optionValues.map((option) => (
                      <button
                        key={option.name}
                        onClick={() => handleOptionChange(optionType, option.name, option.price)}
                        className="px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-300"
                        style={{
                          backgroundColor: selectedOptions[optionType] === option.name ? "#d97706" : "white",
                          color: selectedOptions[optionType] === option.name ? "white" : "#1f2937",
                          borderColor: selectedOptions[optionType] === option.name ? "#d97706" : "#e5e7eb",
                          transform: selectedOptions[optionType] === option.name ? "scale(1.02)" : "scale(1)",
                          boxShadow:
                            selectedOptions[optionType] === option.name ? "0 4px 12px rgba(217, 119, 6, 0.3)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedOptions[optionType] !== option.name) {
                            e.currentTarget.style.borderColor = "#d97706"
                            e.currentTarget.style.transform = "scale(1.02)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedOptions[optionType] !== option.name) {
                            e.currentTarget.style.borderColor = "#e5e7eb"
                            e.currentTarget.style.transform = "scale(1)"
                          }
                        }}
                      >
                        {option.name} {option.price > 0 && `(+$${option.price.toFixed(2)})`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div
            className="flex items-center gap-4"
            style={{
              animation: "slideUp 0.5s ease-out 0.4s both",
            }}
          >
            <span className="text-sm font-semibold" style={{ color: "#1f2937" }}>
              {language === "en" ? "Quantity" : "បរិមាណ"}:
            </span>
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-full"
              style={{
                backgroundColor: "#fef3c7",
                border: "2px solid #fbbf24",
              }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 rounded-full hover:bg-amber-200 transition-all duration-300"
                style={{
                  backgroundColor: "white",
                  color: "#d97706",
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-bold w-12 text-center" style={{ color: "#92400e" }}>
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="h-8 w-8 rounded-full hover:bg-amber-200 transition-all duration-300"
                style={{
                  backgroundColor: "white",
                  color: "#d97706",
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className="flex items-center justify-between pt-4 border-t"
            style={{
              borderColor: "#e5e7eb",
              animation: "slideUp 0.5s ease-out 0.5s both",
            }}
          >
            <span className="text-lg font-semibold" style={{ color: "#1f2937" }}>
              {language === "en" ? "Total" : "សរុប"}:
            </span>
            <span className="text-2xl font-bold" style={{ color: "#d97706" }}>
              ${calculateTotalPrice().toFixed(2)}
            </span>
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              color: "white",
              boxShadow: "0 10px 25px rgba(217, 119, 6, 0.3)",
              animation: "slideUp 0.5s ease-out 0.6s both",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(217, 119, 6, 0.4)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(217, 119, 6, 0.3)"
            }}
          >
            {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
          </Button>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.8); }
          }
          @keyframes price-bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
