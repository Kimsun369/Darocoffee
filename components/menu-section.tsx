"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Search, Heart, Plus, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

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
  category_description?: string 
  category_description_kh?: string
  options?: Record<string, Array<{ name: string; price: number }>>
  discount?: number
}

interface MenuSectionProps {
  products: Product[]
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
  language: "en" | "kh"
}

// Define your categories with both English and Khmer names
const categories = [
  { id: "all", name: { en: "All", kh: "ទាំងអស់" } },
  { id: "coffee", name: { en: "Coffee", kh: "កាហ្វេ" } },
  { id: "tea", name: { en: "Tea", kh: "តែ" } },
  { id: "dessert", name: { en: "Dessert", kh: "បង្អែម" } },
  { id: "bakery", name: { en: "Bakery", kh: "នំប៉័ង" } },
  { id: "rice", name: { en: "Rice", kh: "បាយ" } },
  { id: "noodle", name: { en: "Noodle", kh: "មី" } },
]

export function MenuSection({ products, onProductClick, onAddToCart, language }: MenuSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  const [categoriesFromSheet, setCategoriesFromSheet] = useState<any[]>([])

  // this useEffect to load categories from Google Sheets
  useEffect(() => {
    async function loadCategories() {
      try {
        const SHEET_ID = '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU';
        const url = `https://opensheet.elk.sh/${SHEET_ID}/Categories`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setCategoriesFromSheet(data);
          console.log('Categories loaded from sheet:', data);
        } else {
          console.error('Failed to load categories sheet');
        }
      } catch (error) {
        console.error('Error loading categories from sheet:', error);
      }
    }
    
    loadCategories();
  }, []);

  // Map Google Sheet categories to your predefined category IDs
  const mapCategoryToId = (categoryName: string): string => {
    const lowerCategory = categoryName.toLowerCase().trim();
    
    const categoryMap: Record<string, string> = {
      'coffee': 'coffee',
      'tea': 'tea',
      'dessert': 'dessert',
      'bakery': 'bakery',
      'rice': 'rice',
      'noodle': 'noodle',
    };

    return categoryMap[lowerCategory] || lowerCategory;
  };

  // Get image URL for a category - UPDATED to handle your sheet structure
  const getCategoryImage = (categoryId: string): string => {
    if (categoryId === "all") return "";
    
    // Find the category in the sheet data - match by ID
    const sheetCategory = categoriesFromSheet.find(
      cat => mapCategoryToId(cat.Category || cat.category) === categoryId
    );
    
    console.log('Looking for category:', categoryId, 'Found:', sheetCategory);
    
    // Use the correct column name from your sheet - "Image URL"
    return sheetCategory?.['Image URL'] || sheetCategory?.['image url'] || "";
  };

  const filteredProducts = useMemo(() => {
      let filtered = products

      if (searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.name_kh.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description_kh.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (selectedCategory !== "all") {
        filtered = filtered.filter((product) => 
          mapCategoryToId(product.category) === selectedCategory
        )
      }

      return filtered
    }, [products, searchQuery, selectedCategory])

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {}

    if (selectedCategory === "all") {
      filteredProducts.forEach((product) => {
        const categoryId = mapCategoryToId(product.category);
        if (!grouped[categoryId]) {
          grouped[categoryId] = []
        }
        grouped[categoryId].push(product)
      })
    } else {
      grouped[selectedCategory] = filteredProducts.filter((product) => 
        mapCategoryToId(product.category) === selectedCategory
      )
    }

    return grouped
  }, [filteredProducts, selectedCategory])

  // Get available categories from actual products (both mapped and unmapped)
  const availableCategories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach(product => {
      const mappedId = mapCategoryToId(product.category);
      uniqueCategories.add(mappedId);
    });
    return Array.from(uniqueCategories);
  }, [products]);

  // Create dynamic categories that include both predefined and Google Sheet categories
  const dynamicCategories = useMemo(() => {
    const dynamicCats = [...categories];
    
    // Add categories from available products that aren't in predefined list
    availableCategories.forEach(categoryId => {
      if (!dynamicCats.find(cat => cat.id === categoryId) && categoryId !== "all") {
        // Try to find this category in the sheet data
        const sheetCategory = categoriesFromSheet.find(
          cat => mapCategoryToId(cat.Category || cat.category) === categoryId
        );
        
        dynamicCats.push({
          id: categoryId,
          name: { 
            en: sheetCategory?.Category || sheetCategory?.category || 
                categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
            kh: sheetCategory?.category_kh || sheetCategory?.['Category_KH'] || 
                sheetCategory?.Category || sheetCategory?.category || categoryId
          }
        });
      }
    });
    
    return dynamicCats;
  }, [availableCategories, categoriesFromSheet]);

  // Filter categories to only show those that have products
  const visibleCategories = dynamicCategories.filter(cat => 
    cat.id === "all" || availableCategories.includes(cat.id)
  );

  const toggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const handleSeeMore = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  // Get display name for category (fallback to original if not found in predefined)
  const getCategoryDisplayName = (categoryId: string) => {
    // First check predefined categories
    const predefinedCategory = categories.find(cat => cat.id === categoryId);
    if (predefinedCategory) {
      return predefinedCategory.name[language];
    }
    
    // Then check sheet categories
    const sheetCategory = categoriesFromSheet.find(
      cat => mapCategoryToId(cat.Category || cat.category) === categoryId
    );
    
    if (sheetCategory) {
      return language === "kh" 
        ? sheetCategory.category_kh || sheetCategory['Category_KH'] || sheetCategory.Category || sheetCategory.category
        : sheetCategory.Category || sheetCategory.category;
    }
    
    // Fallback: capitalize the first letter for display
    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }

  return (
    <section className="py-4 px-2 bg-#F5F1E9">
      <div className="container mx-auto max-w-7xl">
        {/* Sticky header with filters and search */}
        <div className="sticky top-16 z-40 bg-gray-50 py-3 mb-4">
          {/* Improved category filter design - Larger and more visible */}
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 px-1">
              {visibleCategories.map((category) => {
                const imageUrl = getCategoryImage(category.id);
                
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`rounded-xl text-sm md:text-base font-semibold whitespace-nowrap flex-shrink-0 px-4 py-3 h-auto transition-all duration-200 border-2 relative overflow-hidden min-h-[60px] min-w-[100px] ${
                      selectedCategory === category.id
                        ? "border-amber-600 text-white shadow-lg"
                        : "border-amber-200 text-amber-800 bg-white hover:bg-amber-50 hover:border-amber-300 hover:shadow-md"
                    } ${language === "kh" ? "font-mono" : "font-sans"}`}
                    style={{
                      backgroundImage: imageUrl ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Category text with better visibility */}
                    <span className="relative z-10 drop-shadow-md text-center">
                      {category.name[language] || getCategoryDisplayName(category.id)}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full px-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={language === "en" ? "Search menus..." : "ស្វែងរកម្ហូបអាហារ..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border-gray-200 focus:border-amber-300 focus:ring-amber-200 rounded-xl bg-white focus:bg-white text-base ${language === "kh" ? "font-mono" : "font-sans"}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(productsByCategory).map(([categoryId, categoryProducts]) => {
            if (categoryProducts.length === 0) return null

            const categoryName = getCategoryDisplayName(categoryId);
            
            // Limit to 4 products per category when viewing "All"
            const displayProducts = selectedCategory === "all" 
              ? categoryProducts.slice(0, 4) 
              : categoryProducts
            const hasMoreProducts = selectedCategory === "all" && categoryProducts.length > 4

            return (
              <div key={categoryId} className="space-y-4">
                {/* Category header */}
                <div className="flex items-center justify-between px-2">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-2xl md:text-3xl text-gray-800 ${
                        language === "kh" ? "font-mono" : "font-serif"
                      }`}
                    >
                      {categoryName}
                    </h3>
                    <div className="w-12 h-1 bg-amber-500 rounded-full mt-1"></div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium ${
                        language === "kh" ? "font-mono" : "font-sans"
                      }`}
                    >
                      {categoryProducts.length} {language === "en" ? "items" : "ធាតុ"}
                    </div>
                  </div>
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {displayProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="group cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-100 bg-white rounded-xl overflow-hidden"
                      onClick={() => onProductClick(product)}
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          {product.discount && (
                            <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                              {product.discount}% OFF
                            </div>
                          )}

                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                          
                          {/* Favorite button */}
                          <button
                            onClick={(e) => toggleFavorite(product.id, e)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
                          >
                            <Heart
                              className={`h-4 w-4 ${favorites.has(product.id) ? "fill-amber-600 text-amber-600" : "text-gray-400"}`}
                            />
                          </button>
                          
                          {/* Plus button for adding to cart directly */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddToCart(product)
                            }}
                            className="absolute bottom-2 right-2 w-9 h-9 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                          >
                            <Plus className="h-5 w-5 text-white" />
                          </button>
                        </div>

                        <div className="p-3 space-y-2">
                          <h4
                            className={`font-semibold text-base text-gray-800 line-clamp-2 leading-tight ${language === "kh" ? "font-mono" : "font-sans"}`}
                          >
                            {language === "kh" ? product.name_kh : product.name}
                          </h4>
                          <p className={`text-sm text-gray-600 line-clamp-2 ${language === "kh" ? "font-mono" : "font-sans"}`}>
                            {language === "kh" ? product.description_kh : product.description}
                          </p>

                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-amber-700">${product.price.toFixed(2)}</span>
                            <span className="text-sm text-amber-600 font-medium">
                              KHR {(product.price * 4000).toLocaleString()}
                            </span>
                          </div>

                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              onAddToCart(product)
                            }}
                            className={`w-full mt-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 rounded-xl transition-colors duration-200 ${language === "kh" ? "font-mono" : "font-sans"}`}
                          >
                            {language === "en" ? "Add to Cart" : "បន្ថែមទៅកន្ត្រក"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* See More button for categories with more than 4 items */}
                {hasMoreProducts && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => handleSeeMore(categoryId)}
                      className={`border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700 rounded-xl px-6 py-3 text-sm ${
                        language === "kh" ? "font-mono" : "font-sans"
                      }`}
                    >
                      <span className="mr-1">
                        {language === "en" ? "See More" : "មើលបន្ថែម"}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {Object.keys(productsByCategory).length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-6 border border-gray-200 max-w-md mx-auto">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className={`text-gray-600 text-sm ${language === "kh" ? "font-mono" : "font-sans"}`}>
                {language === "en" ? "No items found matching your search." : "រកមិនឃើញអ្វីដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}