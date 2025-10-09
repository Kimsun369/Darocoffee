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
// Fetch Products - FIXED VERSION
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
// Process Products - FIXED VERSION WITH KHMER LANGUAGE SUPPORT
// =======================
function processProductsData(data, categoriesMap) {
  console.log("🔍 PROCESSING PRODUCTS DATA - TOTAL ROWS:", data.length);
  
  const productsMap = {};

  data.forEach((item, index) => {
    // Log the first item to see the actual field names
    if (index === 0) {
      console.log("📋 SAMPLE PRODUCT ROW FIELDS:", Object.keys(item));
      console.log("📋 SAMPLE PRODUCT ROW DATA:", item);
    }

    const name = item.Name || item['Product Name'] || item.name;
    if (!name) {
      console.warn(`❌ Skipping row ${index} - missing product name:`, item);
      return;
    }

    if (!productsMap[name]) {
      const category = item.Category || item.category || 'Uncategorized';
      const catInfo = categoriesMap[category.toLowerCase()] || {};
      
      // Extract Khmer language fields with multiple possible column names
      const name_kh = item.name_kh || item['Name_KH'] || item['Product Name_KH'] || item['name_kh'] || name;
      const description_kh = item.description_kh || item['Description_KH'] || item['description_kh'] || '';
      
      // Extract English description with multiple possible column names
      const description = item.Description || item.description || '';
      
      // Extract image with multiple possible column names
      const image = item.Image || item.image || item['Image URL'] || item['image_url'] || '/via.placeholder.com/400x300';
      
      // Extract price with multiple possible column names
      const price = parseFloat(item.Price || item.price || '0');

      const product = {
        id: index + 1,
        name: name,
        name_kh: name_kh,
        image: image,
        price: price,
        category: category,
        category_kh: catInfo.category_kh || category,
        description: description,
        description_kh: description_kh,
        displayOrder: catInfo.displayOrder || 999,
        options: {},
      };

      console.log(`✅ Processed product: ${name}`, {
        name_kh: product.name_kh,
        description_kh: product.description_kh,
        category: product.category
      });

      productsMap[name] = product;
    }

    // Process options
    for (let i = 1; i <= 10; i++) {
      const optionName = item[`Option ${i} - Name`] || '';
      const choicesStr = item[`Option ${i} - Choices`] || '';
      const pricesStr = item[`Option ${i} - Prices`] || '';

      if (!optionName || !choicesStr) continue;

      const choices = choicesStr.split(',').map(v => v.trim());
      const prices = pricesStr
        .split(',')
        .map(p => parseFloat(p.trim()) || 0)
        .slice(0, choices.length);

      productsMap[name].options[optionName.toLowerCase()] = choices.map((c, idx) => ({
        name: c,
        price: prices[idx] || 0,
      }));
    }
  });

  const finalProducts = Object.values(productsMap).sort((a, b) => a.displayOrder - b.displayOrder);
  console.log(`🎯 FINAL PROCESSED PRODUCTS: ${finalProducts.length} products`);
  
  // Log a few products to verify Khmer data
  finalProducts.slice(0, 3).forEach(product => {
    console.log(`📝 Sample product - EN: ${product.name}, KH: ${product.name_kh}, Desc KH: ${product.description_kh}`);
  });

  return finalProducts;
}

// =======================
// Export helpers
// =======================
export {
  fetchSheetData,
  processEventsData,
  processCategoriesData,
  processProductsData
};