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
      
      // Safari-compatible method to open Telegram
      const link = document.createElement('a')
      link.href = telegramUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      
      // Add to DOM, click, and remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Small delay to ensure the click is processed
      setTimeout(() => {
        onCheckout()
        setIsOrderProcessing(false)
      }, 100)
      
    } catch (error) {
      console.error('Error processing Telegram order:', error)
      setIsOrderProcessing(false)
      
      // Fallback: try window.location for older Safari versions
      try {
        const message = generateTelegramMessage()
        const encodedMessage = encodeURIComponent(message)
        const telegramUrl = `https://t.me/Hen_Chandaro?text=${encodedMessage}`
        window.location.href = telegramUrl
        setTimeout(() => {
          onCheckout()
        }, 500)
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0"
        style={{
          backgroundColor: "white",
          color: "#1f2937",
        }}
      >
        <div
          className="px-6 py-5 border-b"
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            borderColor: "#fbbf24",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                animation: "pulse-icon 2s ease-in-out infinite",
              }}
            >
              <ShoppingBag className="h-5 w-5" style={{ color: "white" }} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: "#92400e" }}>
              {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
            </h2>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center text-center p-8"
            style={{
              animation: "fadeIn 0.5s ease-out",
            }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                backgroundColor: "#fef3c7",
                animation: "pulse-icon 2s ease-in-out infinite",
              }}
            >
              <ShoppingBag className="h-12 w-12" style={{ color: "#d97706" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#1f2937" }}>
              {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
            </h3>
            <p className="mb-6" style={{ color: "#6b7280" }}>
              {language === "en" ? "Add some delicious items to get started!" : "បន្ថែមធាតុឆ្ងាញ់ៗដើម្បីចាប់ផ្តើម!"}
            </p>
            <Button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                color: "white",
                boxShadow: "0 4px 12px rgba(217, 119, 6, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(217, 119, 6, 0.4)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(217, 119, 6, 0.3)"
              }}
            >
              {language === "en" ? "Continue Shopping" : "បន្តទិញទំនិញ"}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl p-4 border transition-all duration-300"
                  style={{
                    backgroundColor: "white",
                    borderColor: "#fbbf24",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    animation: `slideInRight 0.4s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(217, 119, 6, 0.15)"
                    e.currentTarget.style.transform = "translateX(-4px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)"
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1" style={{ color: "#1f2937" }}>
                        {language === "kh" && item.name_kh ? item.name_kh : item.name}
                      </h4>
                      {Object.keys(item.options).length > 0 && (
                        <div
                          className="text-xs mt-2 px-3 py-2 rounded-lg"
                          style={{
                            backgroundColor: "#fef3c7",
                            color: "#92400e",
                          }}
                        >
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
                      className="p-2 rounded-full transition-all duration-300"
                      style={{
                        color: "#ef4444",
                        backgroundColor: "#fee2e2",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#ef4444"
                        e.currentTarget.style.color = "white"
                        e.currentTarget.style.transform = "scale(1.1)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#fee2e2"
                        e.currentTarget.style.color = "#ef4444"
                        e.currentTarget.style.transform = "scale(1)"
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-full"
                      style={{
                        backgroundColor: "#fef3c7",
                        border: "2px solid #fbbf24",
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="h-6 w-6 rounded-full p-0 transition-all duration-300"
                        style={{
                          backgroundColor: "white",
                          color: "#d97706",
                        }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-bold w-8 text-center" style={{ color: "#92400e" }}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 rounded-full p-0 transition-all duration-300"
                        style={{
                          backgroundColor: "white",
                          color: "#d97706",
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-lg font-bold" style={{ color: "#d97706" }}>
                        ${item.price.toFixed(2)}
                      </span>
                      <span className="text-xs font-medium" style={{ color: "#92400e" }}>
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
                backgroundColor: "white",
                borderColor: "#fbbf24",
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div
                className="mb-4 rounded-xl p-4"
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                  border: "2px solid #fbbf24",
                }}
              >
                <label className="block font-semibold mb-3 flex items-center gap-2" style={{ color: "#92400e" }}>
                  <Clock className="w-5 h-5" style={{ color: "#d97706" }} />
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
                      className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300"
                      style={{
                        backgroundColor: pickupOption === option.value ? "#d97706" : "white",
                        color: pickupOption === option.value ? "white" : "#92400e",
                        border: `2px solid ${pickupOption === option.value ? "#d97706" : "#fbbf24"}`,
                        transform: pickupOption === option.value ? "scale(1.05)" : "scale(1)",
                        boxShadow: pickupOption === option.value ? "0 4px 12px rgba(217, 119, 6, 0.3)" : "none",
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {pickupOption === "other" && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg"
                    style={{
                      backgroundColor: "white",
                      border: "2px solid #fbbf24",
                    }}
                  >
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="border-0 rounded-md px-2 py-1 w-16 text-center font-semibold"
                      style={{
                        backgroundColor: "#fef3c7",
                        color: "#92400e",
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: "#92400e" }}>
                      {language === "en" ? "minutes" : "នាទី"}
                    </span>
                  </div>
                )}
                <div
                  className="mt-3 text-sm font-semibold px-3 py-2 rounded-lg text-center"
                  style={{
                    backgroundColor: "white",
                    color: "#92400e",
                    border: "2px solid #fbbf24",
                  }}
                >
                  {language === "en" ? `Pick up at: ${getPickupTimeString()}` : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div
                  className="flex justify-between items-center text-xl font-bold px-4 py-3 rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
                    border: "2px solid #fbbf24",
                  }}
                >
                  <span style={{ color: "#92400e" }}>{language === "en" ? "Total:" : "សរុប:"}</span>
                  <div className="flex flex-col items-end">
                    <span style={{ color: "#d97706" }}>${totalPrice.toFixed(2)}</span>
                    <span className="text-sm font-semibold" style={{ color: "#92400e" }}>
                      R{totalPriceKHR.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTelegramOrder}
                disabled={isOrderProcessing}
                className="w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: isOrderProcessing 
                    ? "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"
                    : "linear-gradient(135deg, #0088cc 0%, #006699 100%)",
                  color: "white",
                  boxShadow: isOrderProcessing 
                    ? "0 4px 12px rgba(107, 114, 128, 0.3)"
                    : "0 8px 20px rgba(0, 136, 204, 0.3)",
                  cursor: isOrderProcessing ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isOrderProcessing) {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(0, 136, 204, 0.4)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOrderProcessing) {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 136, 204, 0.3)"
                  }
                }}
              >
                <Send className="h-5 w-5" />
                {isOrderProcessing 
                  ? (language === "en" ? "Processing..." : "កំពុងដំណើរការ...")
                  : (language === "en" ? "Order via Telegram" : "បញ្ជាទិញតាម Telegram")
                }
              </Button>
              <p className="text-xs text-center mt-3" style={{ color: "#6b7280" }}>
                {language === "en"
                  ? "You will be redirected to Telegram to complete your order"
                  : "អ្នកនឹងត្រូវបានបញ្ជូនទៅ Telegram ដើម្បីបញ្ចប់ការបញ្ជាទិញ"}
              </p>
            </div>
          </>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse-icon {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </SheetContent>
    </Sheet>
  )
}