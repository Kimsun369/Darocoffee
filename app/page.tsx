"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { DiscountBanner } from "@/components/discount-banner"
import { MenuSection } from "@/components/menu-section"
import { ProductModal } from "@/components/product-modal"
import { CartSidebar } from "@/components/cart-sidebar"
import { Footer } from "@/components/footer"
import { InstallPrompt } from "@/components/install-prompt"
import { SafariDownloadPrompt } from "@/components/safari-download-prompt"
import { BottomNavigation } from "@/components/bottom-navigation"

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

  const handleScrollToSection = (section: string) => {
    setCurrentSection(section)
    
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (section === "menu") {
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
    } else if (section === "contact") {
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
    } else if (section === "favorites") {
      // For now, just scroll to menu section as favorites isn't implemented
      const menuSection = document.getElementById("menu-section");
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: "smooth" });
      }
      alert(language === "en" ? "Favorites feature coming soon!" : "មុខងារចូលចិត្តនឹងមកដល់ឆាប់ៗ!");
    } else if (section === "account") {
      // For now, just scroll to footer as account isn't implemented
      const footer = document.querySelector("footer");
      if (footer) {
        footer.scrollIntoView({ behavior: "smooth" });
      }
      alert(language === "en" ? "Account feature coming soon!" : "មុខងារគណនីនឹងមកដល់ឆាប់ៗ!");
    }
  };

  const handleInstallPrompt = () => {
    setShowInstallPrompt(true);
  }
  // Track scroll position to update current section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const menuSection = document.getElementById("menu-section");
      const footer = document.querySelector("footer");
      
      if (footer && scrollPosition + window.innerHeight >= document.body.scrollHeight - 100) {
        setCurrentSection("contact");
      } else if (menuSection && scrollPosition >= menuSection.offsetTop - 100) {
        setCurrentSection("menu");
      } else if (scrollPosition < 100) {
        setCurrentSection("top");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        
        console.log('Loaded products:', products)
        console.log('Categories found:', [...new Set(products.map(p => p.category))])
        console.log('Sample images:', products.slice(0, 3).map(p => ({ name: p.name, image: p.image })))
        
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
      optionsPricing: {}
    };
    
    setCartItems((prev) => [...prev, cartItem]);
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50 pb-16 lg:pb-0">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
        onScrollToSection={handleScrollToSection}
      />

      <main>
        <DiscountBanner />

        {/* Menu Section with ID for scrolling */}
        <div id="menu-section">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
              <p className="text-amber-800">
                {language === "en" ? "Loading menu..." : "កំពុងដំណើរការ menu..."}
              </p>
            </div>
          ) : productsData.length > 0 ? (
            <MenuSection
              products={productsData.map((product) => ({
                ...product,
                options: product.options
                  ? Object.fromEntries(
                      Object.entries(product.options).filter(([_, v]) => Array.isArray(v))
                    )
                  : undefined,
              }))}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCartFromMenu}
              language={language}
            />
          ) : (
            <div className="text-center py-20">
              <div className="text-amber-600 text-6xl mb-4">☕</div>
              <h3 className="text-amber-800 text-xl font-semibold mb-2">
                {language === "en" ? "Menu Not Available" : "Menu មិនអាចប្រើបាន"}
              </h3>
              <p className="text-amber-700">
                {language === "en" 
                  ? "Could not load menu from Google Sheet. Please check your Sheet ID, tab name, and publish settings. Try renaming your tab to 'Sheet1' and ensure it is published to the web."
                  : "មិនអាចទាញយកម៉ឺនុយពី Google Sheet។ សូមពិនិត្យ Sheet ID, ឈ្មោះ tab, និង publish settings។ �សូមសាកល្បងប្ដូរឈ្មោះ tab ទៅជា 'Sheet1' និងបង្ហោះទៅ web។"
                }
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

      {/* Bottom Navigation for Mobile */}
      
      {/* <BottomNavigation
        cartItemCount={cartItemCount}
        currentSection={currentSection}
        onNavigate={handleScrollToSection}
        onCartClick={() => setIsCartOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
        onInstallPrompt={handleInstallPrompt}
      /> */}

      {/* Add Install Prompt */}
      <InstallPrompt 
        language={language} 
        isOpen={showInstallPrompt}
        onClose={() => setShowInstallPrompt(false)}
      />
      
      {/* Add Safari Download Prompt */}
      <SafariDownloadPrompt language={language} />      
    </div>
  )
}