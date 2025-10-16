"use client"

import { Plus, Minus, Trash2, ShoppingBag, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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
  const [pickupOption, setPickupOption] = useState<"now" | "15" | "30" | "45" | "60" | "other">("now")
  const [customMinutes, setCustomMinutes] = useState<number>(5)
  const [isOrderProcessing, setIsOrderProcessing] = useState(false)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)
  const totalPriceKHR = totalPrice * 4000

  const getPickupTimeString = () => {
    if (pickupOption === "now") return language === "en" ? "ASAP" : "ឥឡូវនេះ"
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const generateTelegramMessage = () => {
    const now = new Date()
    const dateStr = now.toLocaleDateString("en-GB")
    const timeStr = now.toLocaleTimeString("en-GB", { hour12: false, hour: "2-digit", minute: "2-digit" })
    const pickupTimeStr = getPickupTimeString()

    let message = "FRESTHIES COFFEE ORDER\n\n"
    message += "Date: " + dateStr + "\n"
    message += "Order Time: " + timeStr + "\n"
    message += "Pickup Time: " + pickupTimeStr + "\n\n"
    message += "ORDER ITEMS:\n"
    message += "--------------------\n\n"

    cartItems.forEach((item) => {
      message += item.quantity + "x " + (language === "kh" && item.name_kh ? item.name_kh : item.name) + "\n"
      message += "$" + item.price.toFixed(2) + " or " + (item.price * 4000).toLocaleString() + " KHR\n"

      if (Object.keys(item.options).length > 0) {
        const optionsText = Object.entries(item.options)
          .map(([key, value]) => "  - " + key + ": " + value)
          .join("\n")
        message += optionsText + "\n"
      }
      message += "\n"
    })

    message += "--------------------\n"
    message += "TOTAL: $" + totalPrice.toFixed(2) + " or " + totalPriceKHR.toLocaleString() + " KHR\n\n"

    return message
  }

  const handleTelegramOrder = () => {
    if (isOrderProcessing) return

    setIsOrderProcessing(true)

    try {
      const message = generateTelegramMessage()
      const encodedMessage = encodeURIComponent(message)
      const telegramUrl = `https://t.me/Hen_Chandaro?text=${encodedMessage}`

      const link = document.createElement("a")
      link.href = telegramUrl
      link.target = "_blank"
      link.rel = "noopener noreferrer"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        onCheckout()
        setIsOrderProcessing(false)
      }, 100)
    } catch (error) {
      console.error("Error processing Telegram order:", error)
      setIsOrderProcessing(false)

      try {
        const message = generateTelegramMessage()
        const encodedMessage = encodeURIComponent(message)
        const telegramUrl = `https://t.me/Hen_Chandaro?text=${encodedMessage}`
        window.location.href = telegramUrl
        setTimeout(() => {
          onCheckout()
        }, 500)
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError)
      }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col p-0 bg-gray-50">
        <div className="px-6 py-5 border-b bg-white border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-600">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}</h2>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gray-100">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
            </h3>
            <p className="mb-6 text-gray-600">
              {language === "en" ? "Add some delicious items to get started!" : "បន្ថែមធាតុឆ្ងាញ់ៗដើម្បីចាប់ផ្តើម!"}
            </p>
            <Button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-semibold text-base bg-amber-600 hover:bg-amber-700 text-white transition-colors"
            >
              {language === "en" ? "Continue Shopping" : "បន្តទិញទំនិញ"}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl p-4 border bg-white border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {language === "kh" && item.name_kh ? item.name_kh : item.name}
                      </h4>
                      {Object.keys(item.options).length > 0 && (
                        <div className="text-xs mt-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-700">
                          {Object.entries(item.options).map(([key, value]) => (
                            <p key={key}>
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 border border-gray-200">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 rounded-full p-0 hover:bg-white"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold w-8 text-center text-gray-900">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full p-0 hover:bg-white"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold text-amber-600">${item.price.toFixed(2)}</span>
                      <span className="text-xs font-medium text-gray-600">R{(item.price * 4000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-shrink-0 border-t px-4 py-4 bg-white border-gray-200">
              <div className="mb-4 rounded-xl p-4 bg-gray-50 border border-gray-200">
                <label className="block font-semibold mb-3 flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-amber-600" />
                  {language === "en" ? "Pick up time:" : "ពេលយក:"}
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { value: "now", label: language === "en" ? "Now" : "ឥឡូវនេះ" },
                    { value: "15", label: `15 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "30", label: `30 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "45", label: `45 ${language === "en" ? "min" : "នាទី"}` },
                    { value: "60", label: `1 ${language === "en" ? "hr" : "ម៉ោង"}` },
                    { value: "other", label: language === "en" ? "Other" : "ផ្សេងទៀត" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPickupOption(option.value as any)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        pickupOption === option.value
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-amber-600"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {pickupOption === "other" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="border-0 rounded-md px-2 py-1 w-16 text-center font-semibold bg-gray-50 text-gray-900"
                    />
                    <span className="text-sm font-medium text-gray-700">{language === "en" ? "minutes" : "នាទី"}</span>
                  </div>
                )}
                <div className="mt-3 text-sm font-semibold px-3 py-2 rounded-lg text-center bg-white text-gray-900 border border-gray-200">
                  {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center text-xl font-bold px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-900">{language === "en" ? "Total:" : "សរុប:"}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-amber-600">${totalPrice.toFixed(2)}</span>
                    <span className="text-sm font-semibold text-gray-600">R{totalPriceKHR.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTelegramOrder}
                disabled={isOrderProcessing}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  isOrderProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                }`}
              >
                <Send className="h-5 w-5" />
                {isOrderProcessing
                  ? language === "en"
                    ? "Processing..."
                    : "កំពុងដំណើរការ..."
                  : language === "en"
                    ? "Order via Telegram"
                    : "បញ្ជាទិញតាម Telegram"}
              </Button>
              <p className="text-xs text-center mt-3 text-gray-600">
                {language === "en"
                  ? "You will be redirected to Telegram to complete your order"
                  : "អ្នកនឹងត្រូវបានបញ្ជូនទៅ Telegram ដើម្បីបញ្ចប់ការបញ្ជាទិញ"}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
