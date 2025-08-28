"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  quantity: number
  options: Record<string, string>
  optionsPricing: Record<string, number>
}

interface BasketContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateItem: (id: string, updates: Partial<CartItem>) => void
  removeItem: (id: string) => void
  clearBasket: () => void
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

interface BasketProviderProps {
  children: ReactNode
}

export function BasketProvider({ children }: BasketProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (newItem: CartItem) => {
    setItems(prev => [...prev, newItem])
  }

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    )
  }

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const clearBasket = () => {
    setItems([])
  }

  return (
    <BasketContext.Provider value={{
      items,
      addItem,
      updateItem,
      removeItem,
      clearBasket
    }}>
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const context = useContext(BasketContext)
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider')
  }
  return context
}