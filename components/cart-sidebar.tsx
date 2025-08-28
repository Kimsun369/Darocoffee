"use client"

import { Minus, Plus, Trash2 } from "lucide-react"
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
      minutesToAdd = parseInt(pickupOption, 10)
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
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl text-[var(--coffee-primary)]">
            {language === "en" ? "Your Cart" : "កន្ត្រករបស់អ្នក"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  {language === "en" ? "Your cart is empty" : "កន្ត្រករបស់អ្នកទទេ"}
                </p>
                <Button onClick={onClose} variant="outline">
                  {language === "en" ? "Continue Shopping" : "បន្តទិញ"}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.name}</h4>
                        {Object.keys(item.options).length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">{formatOptions(item.options)}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Badge variant="secondary" className="text-[var(--coffee-primary)] font-semibold">
                        ${item.price.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pick up time selector */}
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  {language === "en" ? "Pick up time:" : "ពេលយក:"}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={pickupOption === "now" ? "default" : "outline"}
                    onClick={() => setPickupOption("now")}
                  >
                    {language === "en" ? "Now" : "ឥឡូវនេះ"}
                  </Button>
                  <Button
                    variant={pickupOption === "15" ? "default" : "outline"}
                    onClick={() => setPickupOption("15")}
                  >
                    15 {language === "en" ? "minutes" : "នាទី"}
                  </Button>
                  <Button
                    variant={pickupOption === "30" ? "default" : "outline"}
                    onClick={() => setPickupOption("30")}
                  >
                    30 {language === "en" ? "minutes" : "នាទី"}
                  </Button>
                  <Button
                    variant={pickupOption === "45" ? "default" : "outline"}
                    onClick={() => setPickupOption("45")}
                  >
                    45 {language === "en" ? "minutes" : "នាទី"}
                  </Button>
                  <Button
                    variant={pickupOption === "60" ? "default" : "outline"}
                    onClick={() => setPickupOption("60")}
                  >
                    1 {language === "en" ? "hour" : "ម៉ោង"}
                  </Button>
                  <Button
                    variant={pickupOption === "other" ? "default" : "outline"}
                    onClick={() => setPickupOption("other")}
                  >
                    {language === "en" ? "Other" : "ផ្សេងទៀត"}
                  </Button>
                  {pickupOption === "other" && (
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customMinutes}
                      onChange={e => setCustomMinutes(Number(e.target.value))}
                      className="ml-2 border rounded px-2 py-1 w-20"
                      placeholder={language === "en" ? "Minutes" : "នាទី"}
                    />
                  )}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {language === "en"
                    ? `Pick up at: ${getPickupTimeString()}`
                    : `យកនៅម៉ោង: ${getPickupTimeString()}`}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>{language === "en" ? "Total:" : "សរុប:"}</span>
                  <span className="text-[var(--coffee-primary)]">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleTelegramOrder}
                  className="w-full coffee-gradient text-white hover:opacity-90 text-lg py-6"
                >
                  {language === "en" ? "Order via Telegram" : "បញ្ជាទិញតាម Telegram"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
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
