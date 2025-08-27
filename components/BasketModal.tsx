"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Trash, Minus, Plus, ShoppingCart, FileText, Maximize2, Download } from "lucide-react"

import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react"
import jsPDF from "jspdf"
import { useBasket } from "@/context/basket-context"

export function BasketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateItem, removeItem, clear, basketTotal } = useBasket()
  const [ordering, setOrdering] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Helper for order message/PDF
  const getOrderOptionsText = (category: string | undefined, options: any) => {
    let optionsText = ""
    if (category === "coffee") {
      optionsText = [
        `Size: ${options.size}`,
        `Shots: ${options.shots}`,
        `Sugar level: ${options.sugar}`,
        `Ice level: ${options.ice}`,
        `Milk type: ${options.milk}`
      ].join("\n")
    } else if (category === "tea") {
      optionsText = [
        `Size: ${options.size}`,
        `Sugar level: ${options.sugar}`,
        `Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["milk-drinks", "smoothies", "soft-drinks"].includes(category || "")
    ) {
      optionsText = [
        `Size: ${options.size}`,
        `Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["rice-dishes", "noodles", "sandwiches", "cakes-pastries", "salads", "snacks", "desserts"].includes(category || "")
    ) {
      optionsText = [
        `Portion size: ${options.portion}`,
        options.extras ? `• Special requests: ${options.extras}` : ""
      ].filter(Boolean).join("\n")
    }
    return optionsText
  }

  const calculateItemPrice = (category: string | undefined, options: any, basePrice: number) => {
    let additionalCharges = 0
    const PRICING = {
      sizes: { small: 0, medium: 0.5, large: 1.0 },
      coffeeShots: { single: 0, double: 0.8, triple: 1.5 },
      milk: { regular: 0, oat: 0.5, almond: 0.5, soy: 0.5, coconut: 0.5 },
      portions: { regular: 0, large: 2.0 }
    }
    if (options.size && PRICING.sizes[options.size] !== undefined)
      additionalCharges += PRICING.sizes[options.size]
    if (options.shots && PRICING.coffeeShots[options.shots] !== undefined)
      additionalCharges += PRICING.coffeeShots[options.shots]
    if (options.milk && PRICING.milk[options.milk] !== undefined)
      additionalCharges += PRICING.milk[options.milk]
    if (options.portion && PRICING.portions[options.portion] !== undefined)
      additionalCharges += PRICING.portions[options.portion]
    return basePrice + additionalCharges
  }

  // Helper for order message (no totals for Telegram)
  const generateOrderMessage = (timestamp: string) => {
    let msg = `Order:\nTime: ${timestamp}\n\n`
    items.forEach((item, idx) => {
      const optionsText = getOrderOptionsText(item.product.category, item.options)
      msg +=
        `Item ${idx + 1}: ${item.product.name}\n` +
        `  Quantity: ${item.quantity}\n` +
        (optionsText ? optionsText.split("\n").map(line => `  ${line}`).join("\n") + "\n" : "")
    })
    msg += `Thank you!`
    return msg
  }

  // Generate PDF as DataURL for preview (not download)
  const generateTransactionPDFDataUrl = async () => {
    const timestamp = new Date().toLocaleString()
    
    // Calculate dynamic height based on content
    const baseHeight = 200
    const itemHeight = items.length * 80 // Reduced from 100 to 80 to fit more items
    const totalHeight = Math.max(500, baseHeight + itemHeight)
    
    // Adjust font sizes based on number of items
    const titleFontSize = items.length > 5 ? 16 : 18
    const itemFontSize = items.length > 5 ? 9 : 10
    const smallFontSize = items.length > 5 ? 7 : 8
    
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [300, totalHeight]
    })

    doc.setFillColor("#f6e9d7")
    doc.rect(0, 0, 300, 70, "F")
    doc.setFontSize(titleFontSize)
    doc.setTextColor("#8d5524")
    doc.setFont("helvetica", "bold")
    doc.text("Slow Drip", 150, 32, { align: "center" })
    doc.setFontSize(smallFontSize)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#8d5524")
    doc.text("Order Receipt", 150, 50, { align: "center" })

    let y = 85
    doc.setFontSize(itemFontSize)
    doc.setTextColor("#333")
    doc.setFont("helvetica", "bold")
    doc.text(`Date: ${timestamp}`, 15, y)
    y += 20

    doc.setDrawColor("#e0c9a6")
    doc.line(15, y, 285, y)
    y += 15
    doc.setFont("helvetica", "bold")
    doc.setFontSize(itemFontSize)
    doc.text("Order Items", 15, y)
    y += 15

    items.forEach((item: { product: { name: any; category: string | undefined }; quantity: any; options: any }, idx: number) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(itemFontSize)
      doc.setTextColor("#8d5524")
      doc.text(`Item ${idx + 1}: ${item.product.name}`, 15, y)
      y += 12
      doc.setFont("helvetica", "normal")
      doc.setTextColor("#333")
      doc.text(`Quantity: ${item.quantity}`, 20, y)
      y += 10
      const optionsText = getOrderOptionsText(item.product.category, item.options)
      if (optionsText) {
        doc.setFont("helvetica", "normal")
        doc.setFontSize(smallFontSize)
        const lines = doc.splitTextToSize(optionsText, 250)
        doc.text(lines, 25, y)
        y += lines.length * 9 // Reduced from 10 to 9 to fit more items
      }
      y += 8
    })

    y += 8
    doc.setFont("helvetica", "bold")
    doc.setFontSize(itemFontSize + 2)
    doc.setTextColor("#8d5524")
    doc.text(`Grand Total: $${basketTotal.toFixed(2)}`, 15, y)
    y += 20

    doc.setFontSize(smallFontSize)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#333")
    doc.text("Thank you for your order!", 150, y, { align: "center" })
    y += 12
    doc.setFontSize(smallFontSize - 1)
    doc.setTextColor("#bfa16b")
    doc.text("Slow Drip · Heart of the city", 150, y, { align: "center" })

    // Return PDF as DataURL for preview
    return doc.output("dataurlstring")
  }

  // Download as image function for mobile-friendly saving - IMPROVED
  const downloadAsImage = async () => {
    try {
      // Check if user wants to allow image download
      const userConfirmed = window.confirm(
        "To save directly to your photos/gallery on mobile, we'll convert the receipt to an image (PNG format). Do you want to continue?"
      )
      
      if (!userConfirmed) {
        return
      }

      const timestamp = new Date().toLocaleString()
      
      // Create canvas for better mobile compatibility - IMPROVED SIZING
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')

      // Improved canvas size for higher resolution and better mobile display
      const pixelRatio = window.devicePixelRatio || 1
      const width = 600 * pixelRatio // Increased base width
      const baseHeight = 400 * pixelRatio
      const itemHeight = items.length * 160 * pixelRatio // Increased spacing
      const totalHeight = Math.max(800 * pixelRatio, baseHeight + itemHeight)
      
      canvas.width = width
      canvas.height = totalHeight
      
      // Scale context for high DPI displays
      ctx.scale(pixelRatio, pixelRatio)
      const displayWidth = width / pixelRatio
      const displayHeight = totalHeight / pixelRatio

      // Background
      ctx.fillStyle = '#f6e9d7'
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      // Header section
      ctx.fillStyle = '#f6e9d7'
      ctx.fillRect(0, 0, displayWidth, 120)

      // Title - Larger fonts for better clarity
      ctx.fillStyle = '#8d5524'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Slow Drip', displayWidth / 2, 50)
      
      ctx.font = '20px Arial'
      ctx.fillText('Order Receipt', displayWidth / 2, 85)

      let y = 140
      
      // Date
      ctx.textAlign = 'left'
      ctx.fillStyle = '#333'
      ctx.font = 'bold 18px Arial'
      ctx.fillText(`Date: ${timestamp}`, 30, y)
      y += 40

      // Line separator
      ctx.strokeStyle = '#e0c9a6'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(30, y)
      ctx.lineTo(displayWidth - 30, y)
      ctx.stroke()
      y += 35

      // Order items header
      ctx.fillStyle = '#333'
      ctx.font = 'bold 20px Arial'
      ctx.fillText('Order Items', 30, y)
      y += 35

      // Items
      items.forEach((item: { product: { name: any; category: string | undefined; price: number }; quantity: any; options: any }, idx: number) => {
        // Item name
        ctx.fillStyle = '#8d5524'
        ctx.font = 'bold 18px Arial'
        ctx.fillText(`Item ${idx + 1}: ${item.product.name}`, 30, y)
        y += 28
        
        // Quantity
        ctx.fillStyle = '#333'
        ctx.font = '16px Arial'
        ctx.fillText(`Quantity: ${item.quantity}`, 40, y)
        y += 24
        
        // Options
        const optionsText = getOrderOptionsText(item.product.category, item.options)
        if (optionsText) {
          ctx.font = '14px Arial'
          const lines = optionsText.split('\n')
          lines.forEach(line => {
            if (line.trim()) {
              ctx.fillText(line, 50, y)
              y += 20
            }
          })
        }
        
        // Price
        ctx.fillStyle = '#8d5524'
        ctx.font = 'bold 16px Arial'
        ctx.textAlign = 'right'
        const price = calculateItemPrice(item.product.category, item.options, item.product.price)
        ctx.fillText(`$${price.toFixed(2)}`, displayWidth - 30, y - 35)
        ctx.textAlign = 'left'
        
        y += 30
      })

      y += 20
      // Total
      ctx.fillStyle = '#8d5524'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`Grand Total: $${basketTotal.toFixed(2)}`, 30, y)
      y += 50

      // Footer
      ctx.fillStyle = '#333'
      ctx.font = '18px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Thank you for your order!', displayWidth / 2, y)
      y += 30
      
      ctx.fillStyle = '#bfa16b'
      ctx.font = '16px Arial'
      ctx.fillText('Slow Drip · Heart of the city', displayWidth / 2, y)

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Could not create image blob')
        
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `SlowDrip_Order_${new Date().toISOString().slice(0, 10)}.png`
        
        // For mobile browsers, try to trigger download
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up
        URL.revokeObjectURL(url)
      }, 'image/png', 1.0) // Maximum quality

    } catch (error) {
      console.error('Error generating image:', error)
      alert('Sorry, there was an error generating the image. Please try again.')
    }
  }

  // Show Transaction Modal
  const handleViewTransaction = async () => {
    setOrdering(true)
    setShowTransactionModal(true)
    setOrdering(false)
  }

  // Buy Now: send Telegram message (no totals)
  const handleBuyNow = async () => {
    setOrdering(true)
    const timestamp = new Date().toLocaleString()
    const message = generateOrderMessage(timestamp)
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://t.me/Eschoolcam?text=${encodedMessage}`, "_blank")
    setOrdering(false)
    clear()
    onClose()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full p-0 bg-cream-50 dark:bg-coffee-900 border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200 dark:border-coffee-800 bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-coffee-900 dark:to-coffee-800/70">
            <DialogTitle className="text-lg sm:text-xl font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-300" />
              Basket
            </DialogTitle>
          </div>
          <div className="p-0 sm:p-0">
            {items.length === 0 ? (
              <div className="text-center py-12 text-amber-700 dark:text-amber-200 text-base sm:text-lg font-medium">
                Your basket is empty.
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <ul className="divide-y divide-amber-100 dark:divide-coffee-800 px-3 sm:px-5 py-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {items.map((item: { product: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; category: string | undefined; price: number }; options: any; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
                    <li key={idx} className="py-4 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-coffee-900 dark:text-cream-100 text-base truncate">{item.product.name}</div>
                        <div className="text-xs text-amber-700 dark:text-amber-300 whitespace-pre-line mt-1">
                          {getOrderOptionsText(item.product.category, item.options)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-amber-200 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900"
                            onClick={() =>
                              updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-coffee-900 dark:text-cream-100">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 border-amber-200 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900"
                            onClick={() =>
                              updateItem(idx, { quantity: item.quantity + 1 })
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="ml-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-coffee-800 rounded-full"
                            onClick={() => removeItem(idx)}
                            aria-label="Remove item"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="font-bold text-amber-700 dark:text-amber-300 mt-1 text-right min-w-[70px]">
                        ${calculateItemPrice(item.product.category, item.options, item.product.price).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-amber-100 dark:border-coffee-800 px-5 py-4 bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-coffee-900 dark:to-coffee-800/70">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg text-coffee-900 dark:text-cream-100">Total</span>
                    <span className="font-bold text-lg text-amber-700 dark:text-amber-300">${basketTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-2">
                    <Button
                      onClick={clear}
                      variant="outline"
                      className="flex-1 border-amber-300 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900 hover:bg-amber-100 dark:hover:bg-coffee-800 transition"
                    >
                      Clear Basket
                    </Button>
                    <Button
                      onClick={handleViewTransaction}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base shadow-lg hover:scale-[1.02] transition-all duration-200 active:scale-95"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      View Transaction
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg hover:scale-[1.02] transition-all"
                      disabled={ordering}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {ordering ? "Ordering..." : "Buy Now"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Transaction Preview Modal - FIXED for mobile expand functionality and PDF display */}
      {showTransactionModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50 p-0 sm:p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className={`relative bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              isFullScreen 
                ? "w-full h-full max-w-none max-h-none rounded-none" 
                : "w-full h-full max-w-none max-h-none rounded-none sm:w-[95vw] sm:max-w-[500px] sm:h-[90vh] sm:max-h-[800px] sm:rounded-xl"
            }`}
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-amber-50 to-amber-100 flex-shrink-0">
              <h3 className="font-bold text-lg text-coffee-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Transaction Preview
              </h3>
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-600 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50 touch-manipulation"
                  aria-label="Download as Image"
                  onClick={downloadAsImage}
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="text-gray-600 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 touch-manipulation"
                  aria-label={isFullScreen ? "Exit full screen" : "View full screen"}
                  onClick={() => {
                    setIsFullScreen(!isFullScreen)
                    // Force a small delay to allow DOM to update
                    setTimeout(() => {
                      // Trigger any needed reflows
                      window.dispatchEvent(new Event('resize'))
                    }, 100)
                  }}
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 touch-manipulation"
                  aria-label="Close"
                  onClick={() => {
                    setShowTransactionModal(false)
                    setIsFullScreen(false)
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col">
              <TransactionPDFPreview 
                generateTransactionPDFDataUrl={generateTransactionPDFDataUrl} 
                isFullScreen={isFullScreen}
              />
            </div>
            
            <div className="p-4 border-t bg-white flex gap-2 flex-shrink-0">
              <Button
                onClick={() => {
                  setShowTransactionModal(false)
                  setIsFullScreen(false)
                }}
                variant="outline"
                className="flex-1 h-12 border-amber-300 text-amber-700 bg-white hover:bg-amber-50"
              >
                Back to Basket
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Confirm Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Helper component for PDF preview - IMPROVED for mobile display
function TransactionPDFPreview({ 
  generateTransactionPDFDataUrl, 
  isFullScreen 
}: { 
  generateTransactionPDFDataUrl: () => Promise<string>
  isFullScreen: boolean
}) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Generate PDF on mount
  useEffect(() => {
    setLoading(true)
    generateTransactionPDFDataUrl().then((url) => {
      setPdfUrl(url)
      setLoading(false)
    })
  }, [generateTransactionPDFDataUrl])

  // Re-generate PDF when fullscreen changes for better display
  useEffect(() => {
    if (pdfUrl) {
      setLoading(true)
      generateTransactionPDFDataUrl().then((url) => {
        setPdfUrl(url)
        setLoading(false)
      })
    }
  }, [isFullScreen, generateTransactionPDFDataUrl])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-coffee-700 font-medium">Generating transaction...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-gray-100">
  <iframe
    src={pdfUrl || ""}
    title="Transaction PDF Preview"
    className={`border-0 ${isFullScreen ? "w-full h-full" : "w-[90vw] h-[80vh]"} `}
    style={{
      background: "#f6e9d7",
      display: "block",
      margin: "0 auto"
    }}
  />
</div>

  )
}