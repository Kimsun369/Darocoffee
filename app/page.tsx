"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DiscountBanner } from "@/components/discount-banner"
import { MenuSection } from "@/components/menu-section"
import { ProductModal } from "@/components/product-modal"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import productsData from "@/data/products.json"

interface Product {
  id: number
  name: string
  image: string
  price: number
  category: string
  description: string
  options?: Record<string, Array<{ name: string; price: number }>>
}

interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  options: Record<string, string>
  optionsPricing: Record<string, number>
}

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [language, setLanguage] = useState<"en" | "kh">("en")

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("daros-coffee-cart")
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("daros-coffee-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item])
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
              price: (item.price / item.quantity) * quantity,
            }
          : item,
      ),
    )
  }

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    setCartItems([])
    setIsCartOpen(false)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main>
        <DiscountBanner />

        <MenuSection
          products={
            (productsData as any[]).map((product) => ({
              ...product,
              options: product.options
                ? Object.fromEntries(
                    Object.entries(product.options).filter(([_, v]) => Array.isArray(v))
                  )
                : undefined,
            })) as Product[]
          }
          onProductClick={handleProductClick}
          language={language}
        />
      </main>

      <Footer language={language} />

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCart}
        language={language}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        language={language}
      />
    </div>
  )
}
