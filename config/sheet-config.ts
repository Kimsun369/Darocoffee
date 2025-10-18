// Central configuration for Google Sheets
export const SHEET_CONFIG = {
  // Replace this with your Google Sheet ID
  ID: '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU',
  
  // Sheet names/tabs in your Google Sheet
  NAMES: {
    CATEGORIES: 'Categories',
    PRODUCTS: ['Sheet1', 'Products', 'Menu'],
    DISCOUNTS: 'Discount',
    EVENTS: 'Events'
  }
} as const;

// Type for the configuration
export type SheetConfig = typeof SHEET_CONFIG;