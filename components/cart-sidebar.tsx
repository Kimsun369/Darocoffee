"use client"

import { Plus, Minus, Trash2, ShoppingBag, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useState } from "react"
import { COLORS } from "@/config/color-config"

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
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-lg flex flex-col p-0"
        style={{ backgroundColor: COLORS.background.secondary }}
      >
        <div 
          className="px-6 py-5 border-b"
          style={{ 
            backgroundColor: COLORS.background.primary,
            borderColor: COLORS.border.light
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl"
              style={{ backgroundColor: COLORS.primary[600] }}
            >
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h2 
              className={`text-xl font-bold ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.text.primary }}
            >
              {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
            </h2>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div 
            className="flex-1 flex flex-col items-center justify-center text-center p-8"
            style={{ backgroundColor: COLORS.background.primary }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: COLORS.gray[100] }}
            >
              <ShoppingBag 
                className="h-12 w-12"
                style={{ color: COLORS.gray[400] }}
              />
            </div>
            <h3 
              className={`text-xl font-semibold mb-2 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.text.primary }}
            >
              {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
            </h3>
            <p 
              className={`mb-6 ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{ color: COLORS.text.secondary }}
            >
              {language === "en" ? "Add some delicious items to get started!" : "បន្ថែមធាតុឆ្ងាញ់ៗដើម្បីចាប់ផ្តើម!"}
            </p>
            <Button
              onClick={onClose}
              className={`px-8 py-3 rounded-xl font-semibold text-base text-white transition-colors ${language === "kh" ? "font-mono" : "font-sans"}`}
              style={{
                backgroundColor: COLORS.primary[600],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary[700]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.primary[600]
              }}
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
                  className="rounded-xl p-4 border hover:shadow-md transition-shadow"
                  style={{ 
                    backgroundColor: COLORS.background.primary,
                    borderColor: COLORS.border.light
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 
                        className={`font-semibold mb-1 ${language === "kh" ? "font-mono" : "font-sans"}`}
                        style={{ color: COLORS.text.primary }}
                      >
                        {language === "kh" && item.name_kh ? item.name_kh : item.name}
                      </h4>
                      {Object.keys(item.options).length > 0 && (
                        <div 
                          className="text-xs mt-2 px-3 py-2 rounded-lg"
                          style={{ 
                            backgroundColor: COLORS.gray[50],
                            color: COLORS.text.secondary
                          }}
                        >
                          {Object.entries(item.options).map(([key, value]) => (
                            <p key={key} className={language === "kh" ? "font-mono" : "font-sans"}>
                              {key}: {value}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ 
                        color: COLORS.semantic.error,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#fef2f2"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-full border"
                      style={{ 
                        backgroundColor: COLORS.gray[100],
                        borderColor: COLORS.border.light
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="h-7 w-7 rounded-full p-0"
                        style={{ 
                          color: COLORS.text.primary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.background.primary
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span 
                        className={`font-bold w-8 text-center ${language === "kh" ? "font-mono" : "font-sans"}`}
                        style={{ color: COLORS.text.primary }}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full p-0"
                        style={{ 
                          color: COLORS.text.primary,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = COLORS.background.primary
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span 
                        className={`text-lg font-bold ${language === "kh" ? "font-mono" : "font-sans"}`}
                        style={{ color: COLORS.primary[600] }}
                      >
                        ${item.price.toFixed(2)}
                      </span>
                      <span 
                        className={`text-xs font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}
                        style={{ color: COLORS.text.secondary }}
                      >
                        R{(item.price * 4000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="flex-shrink-0 border-t px-4 py-4"
              style={{ 
                backgroundColor: COLORS.background.primary,
                borderColor: COLORS.border.light
              }}
            >
              <div 
                className="mb-4 rounded-xl p-4 border"
                style={{ 
                  backgroundColor: COLORS.gray[50],
                  borderColor: COLORS.border.light
                }}
              >
                <label 
                  className={`block font-semibold mb-3 flex items-center gap-2 ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ color: COLORS.text.primary }}
                >
                  <Clock 
                    className="w-5 h-5"
                    style={{ color: COLORS.primary[600] }}
                  />
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
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${language === "kh" ? "font-mono" : "font-sans"} ${
                        pickupOption === option.value
                          ? "text-white shadow-sm"
                          : "border hover:border-amber-600"
                      }`}
                      style={{
                        backgroundColor: pickupOption === option.value ? COLORS.primary[600] : COLORS.background.primary,
                        color: pickupOption === option.value ? COLORS.text.inverse : COLORS.text.primary,
                        borderColor: pickupOption === option.value ? COLORS.primary[600] : COLORS.border.light,
                      }}
                      onMouseEnter={(e) => {
                        if (pickupOption !== option.value) {
                          e.currentTarget.style.borderColor = COLORS.primary[600]
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pickupOption !== option.value) {
                          e.currentTarget.style.borderColor = COLORS.border.light
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {pickupOption === "other" && (
                  <div 
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border"
                    style={{ 
                      backgroundColor: COLORS.background.primary,
                      borderColor: COLORS.border.light
                    }}
                  >
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className={`border-0 rounded-md px-2 py-1 w-16 text-center font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}
                      style={{ 
                        backgroundColor: COLORS.gray[50],
                        color: COLORS.text.primary
                      }}
                    />
                    <span 
                      className={`text-sm font-medium ${language === "kh" ? "font-mono" : "font-sans"}`}
                      style={{ color: COLORS.text.secondary }}
                    >
                      {language === "en" ? "minutes" : "នាទី"}
                    </span>
                  </div>
                )}
                <div 
                  className={`mt-3 text-sm font-semibold px-3 py-2 rounded-lg text-center border ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ 
                    backgroundColor: COLORS.background.primary,
                    color: COLORS.text.primary,
                    borderColor: COLORS.border.light
                  }}
                >
                  {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div 
                  className={`flex justify-between items-center text-xl font-bold px-4 py-3 rounded-xl border ${language === "kh" ? "font-mono" : "font-sans"}`}
                  style={{ 
                    backgroundColor: COLORS.gray[50],
                    color: COLORS.text.primary,
                    borderColor: COLORS.border.light
                  }}
                >
                  <span>{language === "en" ? "Total:" : "សរុប:"}</span>
                  <div className="flex flex-col items-end">
                    <span style={{ color: COLORS.primary[600] }}>${totalPrice.toFixed(2)}</span>
                    <span 
                      className={`text-sm font-semibold ${language === "kh" ? "font-mono" : "font-sans"}`}
                      style={{ color: COLORS.text.secondary }}
                    >
                      R{totalPriceKHR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTelegramOrder}
                disabled={isOrderProcessing}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${language === "kh" ? "font-mono" : "font-sans"} ${
                  isOrderProcessing
                    ? "cursor-not-allowed"
                    : "text-white shadow-sm"
                }`}
                style={{
                  backgroundColor: isOrderProcessing ? COLORS.gray[400] : COLORS.semantic.info,
                }}
                onMouseEnter={(e) => {
                  if (!isOrderProcessing) {
                    e.currentTarget.style.backgroundColor = "#2563eb"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOrderProcessing) {
                    e.currentTarget.style.backgroundColor = COLORS.semantic.info
                  }
                }}
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
              <p 
                className={`text-xs text-center mt-3 ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{ color: COLORS.text.secondary }}
              >
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