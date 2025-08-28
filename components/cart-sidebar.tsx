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
      <SheetContent className="w-full sm:max-w-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-l border-amber-200/20 dark:border-gray-700/20 shadow-2xl shadow-amber-500/10">
        <SheetHeader className="pb-6 border-b border-amber-200/20 dark:border-gray-700/20 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/20 dark:to-transparent rounded-t-2xl -mx-6 px-6 pt-6 mb-6">
          <SheetTitle className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 bg-clip-text text-transparent flex items-center">
            <div className="w-3 h-8 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-700 rounded-full mr-3 shadow-lg shadow-amber-500/30"></div>
            {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
            <ShoppingBag className="ml-auto h-6 w-6 text-amber-600" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-10 border border-amber-200/30 dark:border-gray-700/30 shadow-2xl shadow-amber-500/10 max-w-sm">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/40 animate-pulse">
                  <ShoppingBag className="text-white h-8 w-8" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 font-medium leading-relaxed">
                  {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-amber-300/50 text-amber-700 hover:bg-amber-50/80 dark:hover:bg-amber-900/30 rounded-2xl px-8 py-3 bg-transparent backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {language === "en" ? "Continue Shopping" : "បន្តទិញ"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-thin scrollbar-thumb-amber-300/50 scrollbar-track-transparent">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-amber-200/30 dark:border-gray-700/30 rounded-3xl p-5 space-y-4 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-gray-800/90 group"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition-colors duration-300">
                          {item.name}
                        </h4>
                        {Object.keys(item.options).length > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-amber-50/90 dark:bg-amber-900/30 rounded-xl px-4 py-2 inline-block border border-amber-200/40 backdrop-blur-sm">
                            {formatOptions(item.options)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/30 rounded-2xl h-10 w-10 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 bg-gradient-to-r from-amber-50/90 to-amber-100/80 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl p-3 border border-amber-200/40 backdrop-blur-sm shadow-lg">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="h-9 w-9 rounded-xl border-amber-300/60 hover:bg-amber-100/80 dark:hover:bg-amber-800/50 transition-all duration-300 hover:scale-110 shadow-md disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-bold w-10 text-center text-amber-800 dark:text-amber-200 text-lg">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-9 w-9 rounded-xl border-amber-300/60 hover:bg-amber-100/80 dark:hover:bg-amber-800/50 transition-all duration-300 hover:scale-110 shadow-md"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white font-bold text-lg px-4 py-2 shadow-xl shadow-amber-500/40 rounded-2xl border border-amber-400/30">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pick up time selector */}
              <div className="mb-6 bg-gradient-to-br from-white/85 to-amber-50/80 dark:from-gray-800/85 dark:to-amber-900/20 backdrop-blur-xl rounded-3xl p-6 border border-amber-200/30 dark:border-gray-700/30 shadow-xl">
                <label className="block font-bold mb-5 text-gray-900 dark:text-gray-100 flex items-center text-lg">
                  <Clock className="w-5 h-5 text-amber-600 mr-3" />
                  {language === "en" ? "Pick up time:" : "ពេលយក:"}
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "now", label: language === "en" ? "Now" : "ឥឡូវនេះ" },
                    { value: "15", label: `15 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "30", label: `30 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "45", label: `45 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "60", label: `1 ${language === "en" ? "hr" : "ម៉ោង"}` },
                    { value: "other", label: language === "en" ? "Other" : "ផ្សេងទៀត" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={pickupOption === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPickupOption(option.value as any)}
                      className={`rounded-2xl text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 shadow-lg ${
                        pickupOption === option.value
                          ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white shadow-xl shadow-amber-500/40 border-amber-400/30"
                          : "border-amber-300/60 text-amber-700 hover:bg-amber-50/80 dark:hover:bg-amber-900/30 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm"
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {pickupOption === "other" && (
                  <div className="mt-4 flex items-center space-x-3 bg-white/70 dark:bg-gray-800/70 rounded-2xl p-3 border border-amber-200/40 backdrop-blur-sm">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="border border-amber-300/60 rounded-xl px-4 py-3 w-24 text-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 font-medium"
                      placeholder="5"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {language === "en" ? "minutes" : "នាទី"}
                    </span>
                  </div>
                )}
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-r from-amber-50/90 to-amber-100/80 dark:from-amber-900/30 dark:to-amber-800/30 rounded-2xl px-4 py-3 border border-amber-200/40 backdrop-blur-sm font-medium">
                  {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-amber-200/20 dark:border-gray-700/20 pt-6 space-y-6">
                <div className="bg-gradient-to-br from-amber-50/90 via-amber-100/80 to-amber-200/70 dark:from-amber-900/30 dark:via-amber-800/30 dark:to-amber-700/20 rounded-3xl p-6 border border-amber-200/40 dark:border-amber-600/30 shadow-xl backdrop-blur-xl">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-900 dark:text-gray-100 text-2xl">
                      {language === "en" ? "Total:" : "សរុប:"}
                    </span>
                    <span className="text-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent font-black">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleTelegramOrder}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:via-amber-700 hover:to-amber-800 text-white text-lg py-7 rounded-3xl shadow-2xl shadow-amber-500/40 hover:shadow-3xl hover:shadow-amber-500/50 transition-all duration-500 hover:scale-[1.02] font-bold border border-amber-400/30 backdrop-blur-sm"
                >
                  {language === "en" ? "Order via Telegram" : "បញ្ជាទិញតាម Telegram"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed bg-white/50 dark:bg-gray-800/50 rounded-2xl p-3 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
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
