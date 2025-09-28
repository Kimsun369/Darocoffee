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
  name_kh: string
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
  const totalPriceKHR = totalPrice * 4000 // Convert USD to KHR

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
    return pickupDate.toLocaleTimeString("en-GB", { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatOptions = (options: Record<string, string>) => {
    return Object.entries(options)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" • ")
  }

  const generateTelegramMessage = () => {
    const now = new Date()
    
    // Universal date formatting
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    
    const dateStr = `${day}/${month}/${year}`
    const timeStr = `${hours}:${minutes}`
    const pickupTimeStr = getPickupTimeString()

    // BASIC, UNIVERSAL EMOJIS ONLY (tested across platforms)
    const safeEmojis = {
      coffee: '☕',
      calendar: '📅', 
      clock: '⏰',
      money: '💵',
      gear: '⚙️',
      total: '💰',
      timer: '⏱️',
      thanks: '🙏',
      bullet: '•'
    }

    // Use Khmer text if language is set to Khmer
    if (language === "kh") {
      let message = `${safeEmojis.coffee} ការកម្មង់ពី Fresthie'S COFFEE\n\n`
      message += `${safeEmojis.calendar} ${dateStr} | ${safeEmojis.clock} ${timeStr}\n`
      message += `ពេលយក: ${pickupTimeStr}\n\n`
      message += `==============================\n\n`

      cartItems.forEach((item, index) => {
        message += `${safeEmojis.bullet} ${item.quantity}x ${item.name_kh || item.name}\n`
        message += `${safeEmojis.money} $${(item.price * item.quantity).toFixed(2)} | ៛${(item.price * item.quantity * 4000).toLocaleString()}\n`

        if (Object.keys(item.options).length > 0) {
          const optionsText = Object.entries(item.options)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
          message += `${safeEmojis.gear} ${optionsText}\n`
        }
        message += `\n`
      })

      message += `==============================\n`
      message += `${safeEmojis.total} សរុប: $${totalPrice.toFixed(2)} | ៛${totalPriceKHR.toLocaleString()}\n`
      message += `${safeEmojis.timer} ពេលយក: ${pickupOption === "now" ? "ភ្លាមៗ" : pickupOption === "other" ? `${customMinutes} នាទី` : `${pickupOption} នាទី`}\n\n`
      message += `${safeEmojis.thanks} សូមអរគុណ!`

      return encodeURIComponent(message)
    }

    // Default to English - MAXIMUM COMPATIBILITY
    let message = `${safeEmojis.coffee} FRESTHIE'S COFFEE ORDER\n\n`
    message += `${safeEmojis.calendar} ${dateStr} | ${safeEmojis.clock} ${timeStr}\n`
    message += `Pickup: ${pickupTimeStr}\n\n`
    message += `==============================\n\n`

    cartItems.forEach((item, index) => {
      message += `${safeEmojis.bullet} ${item.quantity}x ${item.name}\n`
      message += `${safeEmojis.money} $${(item.price * item.quantity).toFixed(2)} | ៛${(item.price * item.quantity * 4000).toLocaleString()}\n`

      if (Object.keys(item.options).length > 0) {
        const optionsText = Object.entries(item.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ')
        message += `${safeEmojis.gear} ${optionsText}\n`
      }
      message += `\n`
    })

    message += `==============================\n`
    message += `${safeEmojis.total} TOTAL: $${totalPrice.toFixed(2)} | ៛${totalPriceKHR.toLocaleString()}\n`
    message += `${safeEmojis.timer} Pickup: ${pickupOption === "now" ? "ASAP" : pickupOption === "other" ? `${customMinutes} min` : `${pickupOption} min`}\n\n`
    message += `${safeEmojis.thanks} Thank you!`

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
      <SheetContent className="w-full sm:max-w-lg bg-white dark:bg-gray-900 p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5 text-amber-600" />
              <h2 className={`text-xl font-bold ${language === "kh" ? "font-mono" : "font-sans"}`}>
                {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
              </h2>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center p-6 max-w-sm w-full">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="text-amber-600 h-6 w-6" />
                </div>
                <p className={`text-gray-600 dark:text-gray-400 mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                  {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className={`border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${language === "kh" ? "font-mono" : "font-sans"}`}
                >
                  {language === "en" ? "Continue Shopping" : "បន្តទិញ"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Cart Items */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className={`font-semibold text-gray-900 dark:text-gray-100 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          {language === "kh" && item.name_kh ? item.name_kh : item.name}
                        </h4>
                        {Object.keys(item.options).length > 0 && (
                          <p className={`text-sm text-gray-600 dark:text-gray-400 mt-1 bg-amber-50 dark:bg-amber-900/20 rounded-md px-2 py-1 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                            {formatOptions(item.options)}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="h-7 w-7 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/30"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className={`font-medium w-6 text-center text-amber-800 dark:text-amber-200 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-800/30"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge className={`bg-amber-600 text-white font-medium px-3 py-1 mb-1 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          ${item.price.toFixed(2)}
                        </Badge>
                        <span className={`text-xs text-amber-600 font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
                          KHR {(item.price * 4000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fixed Bottom Section */}
              <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                {/* Pick up time selector */}
                <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <label className={`block font-medium mb-3 text-gray-900 dark:text-gray-100 flex items-center ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    <Clock className="w-4 h-4 text-amber-600 mr-2" />
                    {language === "en" ? "Pick up time:" : "ពេលយក:"}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
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
                        className={`text-xs h-8 ${language === "kh" ? "font-mono" : "font-sans"} ${
                          pickupOption === option.value
                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                            : "border-amber-300 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                        }`}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  {pickupOption === "other" && (
                    <div className="mt-3 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-md p-2">
                      <input
                        type="number"
                        min={1}
                        max={180}
                        value={customMinutes}
                        onChange={(e) => setCustomMinutes(Number(e.target.value))}
                        className={`border border-amber-300 rounded-md px-2 py-1 w-16 text-center bg-white dark:bg-gray-800 focus:border-amber-500 ${language === "kh" ? "font-mono" : "font-sans"}`}
                        placeholder="5"
                      />
                      <span className={`text-sm text-gray-600 dark:text-gray-400 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        {language === "en" ? "minutes" : "នាទី"}
                      </span>
                    </div>
                  )}
                  <div className={`mt-3 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md px-3 py-2 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span className={`text-gray-900 dark:text-gray-100 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                      {language === "en" ? "Total:" : "សរុប:"}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className={`text-amber-700 dark:text-amber-300 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        ${totalPrice.toFixed(2)}
                      </span>
                      <span className={`text-sm text-amber-600 font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}>
                        KHR {totalPriceKHR.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleTelegramOrder}
                    className={`w-full bg-amber-600 hover:bg-amber-700 text-white py-3 ${language === "kh" ? "font-mono" : "font-sans"}`}
                  >
                    {language === "en" ? "Order via Telegram" : "បញ្ជាទិញតាម Telegram"}
                  </Button>
                  <p className={`text-xs text-gray-500 dark:text-gray-400 text-center ${language === "kh" ? "font-mono" : "font-sans"}`}>
                    {language === "en"
                      ? "You will be redirected to Telegram to complete your order"
                      : "អ្នកនឹងត្រូវបានបញ្ជូនទៅ Telegram ដើម្បីបញ្ចប់ការបញ្ជាទិញ"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}