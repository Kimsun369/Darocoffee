"use client"

import { Minus, Plus, Trash2, ShoppingBag, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  options: Record<string, string>
  optionsPricing: Record<string, number>
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
  language: "en" | "kh"
}

export function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  language,
}: CartSidebarProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  // Pickup time state
  const [pickupOption, setPickupOption] = useState<"now" | "15" | "30" | "45" | "60" | "other">("now")
  const [customMinutes, setCustomMinutes] = useState<number>(5)

  // Calculate pick up time string
  const getPickupTimeString = () => {
    if (pickupOption === "now") return language === "en" ? "Now" : "ឥឡូវនេះ"
    const now = new Date()
    let minutesToAdd = 0
    if (pickupOption === "other") {
      minutesToAdd = customMinutes
    } else {
      minutesToAdd = Number.parseInt(pickupOption, 10)
    }
    const pickupDate = new Date(now.getTime() + minutesToAdd * 60000)
    return pickupDate.toLocaleTimeString("en-GB", { hour12: false })
  }

  const formatOptions = (options: Record<string, string>) => {
    return Object.entries(options)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ")
  }

  const generateTelegramMessage = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB")
    const timeStr = now.toLocaleTimeString("en-GB", { hour12: false })
    const pickupTimeStr = getPickupTimeString()

    let message = `Order\nTime: ${dateStr}, ${timeStr}\n\n`

    cartItems.forEach((item, index) => {
      message += `Item ${index + 1}: ${item.name}\n`
      message += `   Amount: ${item.quantity}\n`

      Object.entries(item.options).forEach(([key, value]) => {
        const formattedKey = key.charAt(0).toUpperCase() + key.slice(1)
        message += `   ${formattedKey}: ${value}\n`
      })

      message += `   Pick up time: ${pickupTimeStr}\n\n`
    })

    message += "Thank you!"

    return encodeURIComponent(message)
  }

  const handleTelegramOrder = () => {
    const message = generateTelegramMessage()
    const telegramUrl = `https://t.me/Hen_Chandaro?text=${message}`
    window.open(telegramUrl, "_blank")
    onCheckout()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
        <SheetHeader className="pb-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 -mx-6 px-6 pt-6 mb-6">
          <SheetTitle className="font-serif text-2xl text-amber-600 flex items-center">
            <div className="w-3 h-8 bg-amber-600 mr-3"></div>
            {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
            <ShoppingBag className="ml-auto h-6 w-6 text-amber-600" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-gray-50 dark:bg-gray-800 p-10 border border-gray-200 dark:border-gray-700 max-w-sm">
                <div className="w-20 h-20 bg-amber-600 flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="text-white h-8 w-8" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 font-medium leading-relaxed">
                  {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 px-8 py-3 bg-transparent"
                >
                  {language === "en" ? "Continue Shopping" : "បន្តទិញ"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">{item.name}</h4>
                        {Object.keys(item.options).length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 border border-gray-200 dark:border-gray-700">
                            {formatOptions(item.options)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 h-10 w-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="h-9 w-9 border-gray-300 dark:border-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-10 text-center text-amber-600 text-lg">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-9 w-9 border-gray-300 dark:border-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="bg-amber-600 text-white font-bold text-lg px-4 py-2">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pick up time selector */}
              <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700">
                <label className="block font-bold mb-5 text-gray-900 dark:text-gray-100 flex items-center text-lg">
                  <Clock className="w-5 h-5 text-amber-600 mr-3" />
                  {language === "en" ? "Pick up time:" : "ពេលយក:"}
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      value: "now",
                      label: language === "en" ? "Now" : "ឥឡូវនេះ",
                    },
                    {
                      value: "15",
                      label: `15 ${language === "en" ? "min" : "នាទី"}`,
                    },
                    {
                      value: "30",
                      label: `30 ${language === "en" ? "min" : "នាទី"}`,
                    },
                    {
                      value: "45",
                      label: `45 ${language === "en" ? "min" : "នាទី"}`,
                    },
                    {
                      value: "60",
                      label: `1 ${language === "en" ? "hr" : "ម៉ោង"}`,
                    },
                    {
                      value: "other",
                      label: language === "en" ? "Other" : "ផ្សេងទៀត",
                    },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={pickupOption === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPickupOption(option.value as any)}
                      className={`text-sm font-medium px-4 py-2 ${
                        pickupOption === option.value
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/30 bg-white dark:bg-gray-800"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {pickupOption === "other" && (
                  <div className="mt-4 flex items-center space-x-3 bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="border border-gray-300 dark:border-gray-600 px-4 py-3 w-24 text-center bg-white dark:bg-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium"
                      placeholder="5"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {language === "en" ? "minutes" : "នាទី"}
                    </span>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/30 px-4 py-3 border border-amber-200 dark:border-amber-600 font-medium">
                  {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
                <div className="bg-amber-50 dark:bg-amber-900/30 p-6 border border-amber-200 dark:border-amber-600">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900 dark:text-gray-100 text-2xl">
                      {language === "en" ? "Total:" : "សរុប:"}
                    </span>
                    <span className="text-3xl text-amber-600 font-black">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleTelegramOrder}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-lg py-7 font-bold"
                >
                  {language === "en" ? "Order via Telegram" : "បញ្ជាទិញតាម Telegram"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed bg-gray-50 dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                  {language === "en"
                    ? "You will be redirected to Telegram to complete your order"
                    : "អ្នកនឹងត្រូវបានបញ្ជូនទៅ Telegram ដើម្បីបញ្ចប់ការបញ្ជាទិញ"}
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
