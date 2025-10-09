// HomePage.tsx
"use client"

import { useState, useEffect } from "react"
import { DiscountBanner } from "@/components/discount-banner"
import { MenuSection } from "@/components/menu-section"
import { ProductModal } from "@/components/product-modal"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

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

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [language, setLanguage] = useState<"en" | "kh">("en")
  const [productsData, setProductsData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState("top")
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string>("all")

  // Handle event selection from banner
  const handleEventSelect = (eventName: string) => {
    console.log("Event selected in main page:", eventName)
    setSelectedEvent(eventName)

    // Scroll to menu section when event is selected
    const menuSection = document.getElementById("menu-section")
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle event change from menu section
  const handleEventChange = (eventName: string) => {
    console.log("Event changed in main page:", eventName)
    setSelectedEvent(eventName)
  }

  const handleScrollToSection = (section: string) => {
    setCurrentSection(section)

    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (section === "menu") {
      const menuSection = document.getElementById("menu-section")
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" })
      }
    } else if (section === "contact") {
      const footer = document.querySelector("footer")
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" })
      }
    } else if (section === "favorites") {
      // For now, just scroll to menu section as favorites isn't implemented
      const menuSection = document.getElementById("menu-section")
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" })
      }
      alert(language === "en" ? "Favorites feature coming soon!" : "មុខងារចូលចិត្តនឹងមកដល់ឆាប់ៗ!")
    } else if (section === "account") {
      // For now, just scroll to footer as account isn't implemented
      const footer = document.querySelector("footer")
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" })
      }
      alert(language === "en" ? "Account feature coming soon!" : "មុខងារគណនីនឹងមកដល់ឆាប់ៗ!")
    }
  }

  const handleInstallPrompt = () => {
    setShowInstallPrompt(true)
  }

  // Track scroll position to update current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const menuSection = document.getElementById("menu-section")
      const footer = document.querySelector("footer")

      if (footer && scrollPosition + window.innerHeight >= document.body.scrollHeight - 100) {
        setCurrentSection("contact")
      } else if (menuSection && scrollPosition >= menuSection.offsetTop - 100) {
        setCurrentSection("menu")
      } else if (scrollPosition < 100) {
        setCurrentSection("top")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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

  // Load products data on client-side only
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const mod = await import("@/data/google-sheet.data")
        const products = await mod.fetchProductsFromGoogleSheet()

        console.log("Loaded products:", products)
        console.log("Categories found:", [...new Set(products.map((p) => p.category))])
        console.log(
          "Sample images:",
          products.slice(0, 3).map((p) => ({ name: p.name, image: p.image })),
        )

        setProductsData(products)
      } catch (error) {
        console.error("Error loading products from Google Sheets:", error)
        setProductsData([])
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  // Function to handle direct add to cart from menu
  const handleAddToCartFromMenu = (product: Product) => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      name_kh: product.name_kh,
      price: product.price,
      quantity: 1,
      options: {},
      optionsPricing: {},
    }

    setCartItems((prev) => [...prev, cartItem])

    // Show success message for discounted items
    if (product.isDiscounted) {
      const message = language === "en" ? "Discounted item added to cart!" : "ធាតុបញ្ចុះតម្លៃត្រូវបានបន្ថែមទៅកន្ត្រក!"
      alert(message)
    }
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
    alert(language === "en" ? "Order placed successfully!" : "ការកម្មង់ទទួលបានជោគជ័យ!")
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 pb-20">
      <main>
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setIsCartOpen(true)}
          language={language}
          onLanguageChange={setLanguage}
          onScrollToSection={handleScrollToSection}
          currentSection={currentSection}
        />

        {/* Discount Banner with event selection - FIXED: Added language prop */}
        <DiscountBanner 
          onEventClick={handleEventSelect} 
          selectedEvent={selectedEvent} 
          language={language} // This line was added
        />

        {/* Menu Section with ID for scrolling */}
        <div id="menu-section">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
              <p 
                className={`text-amber-800 ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{ fontFamily: language === "kh" ? "'Khmer OS', sans-serif" : undefined }}
              >
                {language === "en" ? "Loading menu..." : "កំពុងដំណើរការ menu..."}
              </p>
            </div>
          ) : productsData.length > 0 ? (
            <MenuSection
              products={productsData.map((product) => ({
                ...product,
                options: product.options
                  ? Object.fromEntries(Object.entries(product.options).filter(([_, v]) => Array.isArray(v)))
                  : undefined,
              }))}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCartFromMenu}
              language={language}
              selectedEvent={selectedEvent}
              onEventChange={handleEventChange}
            />
          ) : (
            <div className="text-center py-20">
              <div className="text-amber-600 text-6xl mb-4">☕</div>
              <h3 
                className={`text-amber-800 text-xl font-semibold mb-2 ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{ fontFamily: language === "kh" ? "'Khmer OS', sans-serif" : undefined }}
              >
                {language === "en" ? "Menu Not Available" : "Menu មិនអាចប្រើបាន"}
              </h3>
              <p 
                className={`text-amber-700 ${language === "kh" ? "font-mono" : "font-sans"}`}
                style={{ fontFamily: language === "kh" ? "'Khmer OS', sans-serif" : undefined }}
              >
                {language === "en"
                  ? "Could not load menu from Google Sheet. Please check your Sheet ID, tab name, and publish settings. Try renaming your tab to 'Sheet1' and ensure it is published to the web."
                  : "មិនអាចទាញយកម៉ឺនុយពី Google Sheet។ សូមពិនិត្យ Sheet ID, ឈ្មោះ tab, និង publish settings។ សូមសាកល្បងប្ដូរឈ្មោះ tab ទៅជា 'Sheet1' និងបង្ហោះទៅ web។"}
              </p>
            </div>
          )}
        </div>
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

      {/* Add Install Prompt */}
      {/* <InstallPrompt language={language} isOpen={showInstallPrompt} onClose={() => setShowInstallPrompt(false)} /> */}

      {/* Add Safari Download Prompt */}
      {/* <SafariDownloadPrompt language={language} /> */}
    </div>
  )
}