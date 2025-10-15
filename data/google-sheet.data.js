// googleSheetData.js
// Free Google Sheets integration using JSON API

// =======================
// Configuration
// =======================
const SHEET_CONFIG = {
  ID: '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU',
  NAMES: {
    CATEGORIES: 'Categories',
    PRODUCTS: ['Sheet1', 'Products', 'Menu'],
    DISCOUNTS: 'Discount',
    EVENTS: 'Events'
  }
};

// =======================
// Fetch All Data
// =======================
export async function fetchAllDataFromGoogleSheet() {
  try {
    console.log('Starting to fetch all data from Google Sheets...');

    const [products, discounts, events] = await Promise.all([
      fetchProductsFromGoogleSheet(),
      fetchDiscountsFromGoogleSheet(),
      fetchEventsFromGoogleSheet()
    ]);

    console.log('All data fetched successfully:', {
      products: products.length,
      discounts: discounts.length,
      events: events.length
    });

    return { products, discounts, events };
  } catch (error) {
    console.error('Error fetching all data from Google Sheets:', error);
    return { products: [], discounts: [], events: [] };
  }
}

// =======================
// Fetch Events
// =======================
export async function fetchEventsFromGoogleSheet() {
  try {
    console.log('Fetching events from Google Sheet...');
    const data = await fetchSheetData(SHEET_CONFIG.ID, SHEET_CONFIG.NAMES.EVENTS);

    if (data && data.length > 0) {
      const processedEvents = processEventsData(data);
      console.log('Processed events:', processedEvents);
      return processedEvents;
    } else {
      console.warn('No events data found in Google Sheets.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching events from Google Sheets:', error);
    return [];
  }
}

// =======================
// Helper: Fetch Any Sheet
// =======================
async function fetchSheetData(sheetId, sheetName) {
  try {
    const url = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;
    console.log(`Fetching data from: ${url}`);

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} for sheet: ${sheetName}`);
      return [];
    }

    const data = await res.json();
    console.log(`Fetched ${data.length} rows from ${sheetName}`);
    return data || [];
  } catch (err) {
    console.error(`Error fetching sheet ${sheetName}:`, err);
    return [];
  }
}

// =======================
// Process Events
// =======================
function processEventsData(eventsData) {
  if (!eventsData || eventsData.length === 0) {
    console.log('No events data to process from Google Sheets');
    return [];
  }

  console.log('Processing events data from Google Sheets:', eventsData);

  const processedEvents = eventsData
    .map((row, index) => {
      if (row['Event ID'] === 'Event ID' || row['Event Name'] === 'Event Name') {
        console.log('Skipping header row');
        return null;
      }

      const eventName = row['Event Name']?.trim();
      const eventAbbreviation = row['Event Abbreviation']?.trim();
      const posterUrl = row['Poster Image URL']?.trim();

      if (!eventName) {
        console.warn('Skipping event - missing Event Name:', row);
        return null;
      }

      const event = {
        id: row['Event ID'] || (index + 1),
        name: eventName,
        abbreviation: eventAbbreviation || eventName,
        poster: posterUrl || '/placeholder.svg',
      };

      console.log('Processed event from Google Sheets:', event);
      return event;
    })
    .filter(Boolean);

  console.log('Final processed events from Google Sheets:', processedEvents);
  return processedEvents;
}

// =======================
// Fetch Products - FIXED VERSION WITH COLUMN I SUPPORT
// =======================
export async function fetchProductsFromGoogleSheet() {
  try {
    const categoriesData = await fetchSheetData(SHEET_CONFIG.ID, SHEET_CONFIG.NAMES.CATEGORIES);
    const categoriesMap = processCategoriesData(categoriesData);

    let productsFromSheet = [];

    for (const sheetName of SHEET_CONFIG.NAMES.PRODUCTS) {
      const data = await fetchSheetData(SHEET_CONFIG.ID, sheetName);
      if (data && data.length > 0) {
        productsFromSheet = processProductsData(data, categoriesMap);
        console.log(`Found products in sheet: ${sheetName}`);
        break;
      }
    }

    if (productsFromSheet.length === 0) {
      console.warn('No products found in any of the specified sheets');
    }

    return productsFromSheet;
  } catch (error) {
    console.error('Error fetching products from Google Sheets:', error);
    return [];
  }
}

// =======================
// Fetch Discounts - FIXED
// =======================
export async function fetchDiscountsFromGoogleSheet() {
  try {
    const discountData = await fetchSheetData(SHEET_CONFIG.ID, SHEET_CONFIG.NAMES.DISCOUNTS);
    console.log("📋 RAW DISCOUNT DATA FROM SHEET:", discountData);

    const processedDiscounts = processDiscountsData(discountData);

    if (processedDiscounts.length === 0) {
      console.warn('No discounts found in the Discount sheet');
    }

    return processedDiscounts;
  } catch (error) {
    console.error('Error fetching discounts from Google Sheets:', error);
    return [];
  }
}

// =======================
// Process Discounts - FIXED VERSION
// =======================
export function processDiscountsData(discountData) {
  if (!discountData || discountData.length === 0) {
    console.log('❌ No discount data to process');
    return [];
  }

  console.log("🔍 PROCESSING DISCOUNT DATA - TOTAL ROWS:", discountData.length);

  const processedDiscounts = discountData
    .map((item, index) => {
      if (!item || Object.keys(item).length === 0) return null;
      
      // Skip header rows
      if (item['Event'] === 'Event' || item['Discount ID'] === 'Discount ID' || item['Discount Name'] === 'Discount Name') {
        console.log('📝 Skipping header row');
        return null;
      }

      // Handle column names with or without trailing spaces
      const discountId = item['Discount ID'] || index + 1;
      const discountName = (item['Discount Name '] || item['Discount Name'] || '').trim();
      const duplicateCheck = (item['Duplicate Check'] || '').trim();
      const discountPercent = parseFloat(item['Discount %'] || item['Discount Percent'] || '0');
      const discountedPrice = parseFloat(item['Price'] || '0');
      const event = (item['Event'] || '').trim();

      const productName = discountName;

      console.log('🔍 Processing discount row:', {
        discountId,
        productName,
        duplicateCheck,
        discountPercent,
        discountedPrice,
        event
      });

      if (!productName || productName === '') {
        console.warn('❌ Skipping discount - missing Product Name:', item);
        return null;
      }

      // Validation: Must have OK duplicate check and valid discount
      const isValid = duplicateCheck.toUpperCase() === 'OK' && discountPercent > 0 && discountedPrice > 0;

      // Calculate original price from discounted price and discount percentage
      // Formula: originalPrice = discountedPrice / (1 - discountPercent/100)
      const originalPrice = discountedPrice / (1 - discountPercent / 100);

      const discount = {
        id: discountId,
        discountName: productName,
        productName: productName,
        duplicateCheck: duplicateCheck,
        discountPercent,
        originalPrice: Math.round(originalPrice * 100) / 100,
        discountedPrice: Math.round(discountedPrice * 100) / 100,
        isActive: isValid,
        event: event,
      };

      console.log(isValid ? '✅ Valid discount:' : '❌ Invalid discount:', discount);
      return discount;
    })
    .filter(Boolean);

  console.log("🎯 FINAL PROCESSED DISCOUNTS:", processedDiscounts);

  const activeDiscounts = processedDiscounts.filter(d => d.isActive);
  console.log(`🔥 ACTIVE DISCOUNTS: ${activeDiscounts.length} out of ${processedDiscounts.length} total`);
  activeDiscounts.forEach(d => {
    console.log(`   ✅ ${d.productName} - ${d.event} - ${d.discountPercent}% OFF - Original: ${d.originalPrice} → Discounted: ${d.discountedPrice}`);
  });

  return processedDiscounts;
}

// =======================
// Process Categories
// =======================
function processCategoriesData(categoriesData) {
  const map = {};
  if (!categoriesData) return map;

  categoriesData.forEach((item) => {
    const category = item.Category || '';
    if (!category) return;
    map[category.toLowerCase()] = {
      category_kh: item['Category_KH'] || category,
      displayOrder: parseInt(item['Display Order'] || '999'),
      description: item.Description || '',
      description_kh: item['Description_KH'] || '',
    };
  });

  return map;
}

// =======================
// Process Products - ENHANCED WITH COLUMN I SUPPORT
// =======================
function processProductsData(data, categoriesMap) {
  console.log("🔍 PROCESSING PRODUCTS DATA - TOTAL ROWS:", data.length);
  
  const productsMap = {};

  // First, let's examine the headers to understand the structure
  if (data.length > 0) {
    const firstRow = data[0];
    console.log("📋 ALL AVAILABLE COLUMNS:", Object.keys(firstRow));
    
    // Find all option-related columns
    const optionColumns = Object.keys(firstRow).filter(key => 
      key.toLowerCase().includes('option') || 
      key.toLowerCase().includes('choice') || 
      key.toLowerCase().includes('size') ||
      key.toLowerCase().includes('sugar') ||
      key.toLowerCase().includes('milk') ||
      key.toLowerCase().includes('topping')
    );
    console.log("🎯 OPTION-RELATED COLUMNS FOUND:", optionColumns);
  }

  data.forEach((item, index) => {
    // Log the first few items to see the actual data
    if (index < 3) {
      console.log(`📋 SAMPLE ROW ${index}:`, item);
    }

    const name = item.Name || item['Product Name'] || item.name || item['Product Name '] || item['Name '];
    if (!name || name.trim() === '') {
      console.warn(`❌ Skipping row ${index} - missing product name:`, item);
      return;
    }

    if (!productsMap[name]) {
      const category = item.Category || item.category || item['Category '] || 'Uncategorized';
      const catInfo = categoriesMap[category.toLowerCase()] || {};
      
      // Extract Khmer language fields
      const name_kh = item.name_kh || item['Name_KH'] || item['Product Name_KH'] || item['name_kh'] || item['Name KH'] || name;
      const description_kh = item.description_kh || item['Description_KH'] || item['description_kh'] || item['Description KH'] || '';
      
      // Extract English description
      const description = item.Description || item.description || item['Description '] || '';
      
      // Extract image
      const image = item.Image || item.image || item['Image URL'] || item['image_url'] || item['Image '] || '/via.placeholder.com/400x300';
      
      // Extract price
      const price = parseFloat(item.Price || item.price || item['Price '] || '0');

      const product = {
        id: index + 1,
        name: name.trim(),
        name_kh: name_kh.trim(),
        image: image,
        price: price,
        category: category,
        category_kh: catInfo.category_kh || category,
        description: description,
        description_kh: description_kh,
        displayOrder: catInfo.displayOrder || 999,
        options: {}, // This will be in the format: Record<string, Array<{ name: string; price: number }>>
      };

      console.log(`✅ Created product: ${product.name}`, {
        price: product.price,
        category: product.category
      });

      productsMap[name] = product;
    }

    // PROCESS OPTIONS - CHECK COLUMN I FIRST
    console.log(`🔍 Processing options for: ${name}`);
    
    // Method 1: Check for JSON options in Column I (index 8 in 0-based array)
    // Google Sheets columns: A=0, B=1, C=2, D=3, E=4, F=5, G=6, H=7, I=8
    const columnI = Object.values(item)[8]; // Column I data
    console.log(`📋 Column I data for ${name}:`, columnI);
    
    if (columnI && typeof columnI === 'string' && columnI.trim().startsWith('{')) {
      try {
        const parsedOptions = JSON.parse(columnI.trim());
        if (parsedOptions && typeof parsedOptions === 'object') {
          // Transform the format to be compatible with basket-modal.tsx
          const transformedOptions = transformOptionsToBasketFormat(parsedOptions);
          productsMap[name].options = transformedOptions;
          console.log(`✅ Added JSON options from Column I for ${name}:`, transformedOptions);
        }
      } catch (error) {
        console.warn(`❌ Failed to parse JSON options from Column I for ${name}:`, error, 'Raw data:', columnI);
      }
    }

    // Method 2: Check for JSON options column by name (backup method)
    const jsonOptions = item.Options || item.options || item['Options '];
    if (Object.keys(productsMap[name].options).length === 0 && jsonOptions && typeof jsonOptions === 'string' && jsonOptions.trim().startsWith('{')) {
      try {
        const parsedOptions = JSON.parse(jsonOptions.trim());
        if (parsedOptions && typeof parsedOptions === 'object') {
          const transformedOptions = transformOptionsToBasketFormat(parsedOptions);
          productsMap[name].options = transformedOptions;
          console.log(`✅ Added JSON options from Options column for ${name}:`, transformedOptions);
        }
      } catch (error) {
        console.warn(`❌ Failed to parse JSON options from Options column for ${name}:`, error);
      }
    }

    // Method 3: Process individual option columns with compatible format (only if no JSON options found)
    if (Object.keys(productsMap[name].options).length === 0) {
      // Common option patterns
      const optionPatterns = [
        // Size options
        { 
          name: 'size', 
          nameColumns: ['Size', 'size', 'Option 1 - Name', 'Option1 Name'],
          choicesColumns: ['Size Choices', 'size_choices', 'Option 1 - Choices', 'Option1 Choices'],
          pricesColumns: ['Size Prices', 'size_prices', 'Option 1 - Prices', 'Option1 Prices']
        },
        // Sugar level options
        { 
          name: 'sugar_level', 
          nameColumns: ['Sugar Level', 'sugar_level', 'sugar', 'Option 2 - Name', 'Option2 Name'],
          choicesColumns: ['Sugar Choices', 'sugar_choices', 'Option 2 - Choices', 'Option2 Choices'],
          pricesColumns: ['Sugar Prices', 'sugar_prices', 'Option 2 - Prices', 'Option2 Prices']
        },
        // Milk options
        { 
          name: 'milk', 
          nameColumns: ['Milk', 'milk', 'Milk Type', 'Option 3 - Name', 'Option3 Name'],
          choicesColumns: ['Milk Choices', 'milk_choices', 'Option 3 - Choices', 'Option3 Choices'],
          pricesColumns: ['Milk Prices', 'milk_prices', 'Option 3 - Prices', 'Option3 Prices']
        },
        // Toppings options
        { 
          name: 'toppings', 
          nameColumns: ['Toppings', 'toppings', 'Topping', 'Option 4 - Name', 'Option4 Name'],
          choicesColumns: ['Toppings Choices', 'toppings_choices', 'Option 4 - Choices', 'Option4 Choices'],
          pricesColumns: ['Toppings Prices', 'toppings_prices', 'Option 4 - Prices', 'Option4 Prices']
        },
        // Ice level options
        { 
          name: 'ice_level', 
          nameColumns: ['Ice Level', 'ice_level', 'ice', 'Option 5 - Name', 'Option5 Name'],
          choicesColumns: ['Ice Choices', 'ice_choices', 'Option 5 - Choices', 'Option5 Choices'],
          pricesColumns: ['Ice Prices', 'ice_prices', 'Option 5 - Prices', 'Option5 Prices']
        }
      ];

      optionPatterns.forEach(pattern => {
        let optionName = '';
        let choicesStr = '';
        let pricesStr = '';

        // Find option name
        for (const col of pattern.nameColumns) {
          if (item[col] && item[col].toString().trim()) {
            optionName = item[col].toString().trim();
            break;
          }
        }

        // Find choices
        for (const col of pattern.choicesColumns) {
          if (item[col] && item[col].toString().trim()) {
            choicesStr = item[col].toString().trim();
            break;
          }
        }

        // Find prices
        for (const col of pattern.pricesColumns) {
          if (item[col] && item[col].toString().trim()) {
            pricesStr = item[col].toString().trim();
            break;
          }
        }

        if (optionName && choicesStr) {
          const choices = choicesStr.split(',').map(v => v.trim()).filter(v => v);
          const prices = pricesStr
            .split(',')
            .map(p => parseFloat(p.trim()) || 0)
            .slice(0, choices.length);

          // Ensure we have the same number of prices as choices
          while (prices.length < choices.length) {
            prices.push(0);
          }

          const optionKey = pattern.name;
          
          // Format options for basket-modal compatibility
          productsMap[name].options[optionKey] = choices.map((c, idx) => ({
            name: c,
            price: prices[idx] || 0,
          }));

          console.log(`✅ Added option "${optionKey}" for ${name}:`, {
            choices: choices,
            prices: prices
          });
        }
      });

      // Method 4: Dynamic option detection for any remaining columns
      Object.keys(item).forEach(key => {
        if (key.toLowerCase().includes('option') && key.toLowerCase().includes('name')) {
          const optionName = item[key];
          if (optionName && typeof optionName === 'string') {
            // Try to find corresponding choices and prices
            const baseKey = key.replace('name', '').replace('Name', '');
            const choicesKey = key.replace('Name', 'Choices').replace('name', 'choices');
            const pricesKey = key.replace('Name', 'Prices').replace('name', 'prices');
            
            const choicesStr = item[choicesKey] || '';
            const pricesStr = item[pricesKey] || '';

            if (choicesStr) {
              const choices = choicesStr.split(',').map(v => v.trim()).filter(v => v);
              const prices = pricesStr
                .split(',')
                .map(p => parseFloat(p.trim()) || 0)
                .slice(0, choices.length);

              while (prices.length < choices.length) {
                prices.push(0);
              }

              const optionKey = optionName.toLowerCase().replace(/\s+/g, '_');
              
              // Format options for basket-modal compatibility
              productsMap[name].options[optionKey] = choices.map((c, idx) => ({
                name: c,
                price: prices[idx] || 0,
              }));

              console.log(`✅ Added dynamic option "${optionKey}" for ${name}`);
            }
          }
        }
      });
    }

    // Log final options for this product
    if (Object.keys(productsMap[name].options).length > 0) {
      console.log(`🎯 FINAL OPTIONS for ${name}:`, productsMap[name].options);
    } else {
      console.log(`❌ NO OPTIONS found for ${name}`);
    }
  });

  const finalProducts = Object.values(productsMap).sort((a, b) => a.displayOrder - b.displayOrder);
  
  // Summary
  const productsWithOptions = finalProducts.filter(p => Object.keys(p.options).length > 0);
  console.log(`🎯 FINAL PROCESSED PRODUCTS: ${finalProducts.length} total, ${productsWithOptions.length} with options`);
  
  // Log products with options
  productsWithOptions.forEach(product => {
    console.log(`📝 ${product.name} has options:`, Object.keys(product.options));
  });

  return finalProducts;
}

// =======================
// Helper function to transform options format for basket-modal compatibility
// =======================
function transformOptionsToBasketFormat(options) {
  const transformed = {};
  
  Object.entries(options).forEach(([key, value]) => {
    if (value && typeof value === 'object') {
      // Handle the format from google-sheets.ts: { values: string[], prices: number[] }
      if (Array.isArray(value.values) && Array.isArray(value.prices)) {
        transformed[key] = value.values.map((val, index) => ({
          name: val,
          price: value.prices[index] || 0
        }));
      } 
      // Handle the format that basket-modal expects: Array<{ name: string; price: number }>
      else if (Array.isArray(value)) {
        transformed[key] = value.map(item => ({
          name: item.name || item.value || '',
          price: item.price || 0
        }));
      }
      // Handle nested object format
      else if (typeof value === 'object') {
        // Try to extract options from nested object structure
        const optionArray = [];
        Object.entries(value).forEach(([optionKey, optionValue]) => {
          if (optionValue && typeof optionValue === 'object' && 'name' in optionValue) {
            optionArray.push({
              name: optionValue.name || optionKey,
              price: optionValue.price || 0
            });
          }
        });
        if (optionArray.length > 0) {
          transformed[key] = optionArray;
        }
      }
    }
  });
  
  return transformed;
}

// =======================
// Export helpers
// =======================
export {
  fetchSheetData,
  processEventsData,
  processCategoriesData,
  processProductsData,
  transformOptionsToBasketFormat
};