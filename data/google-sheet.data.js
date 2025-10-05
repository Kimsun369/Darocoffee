// Free Google Sheets integration using JSON API

// Configuration
const SHEET_CONFIG = {
  ID: '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU',
  NAMES: {
    CATEGORIES: 'Categories',
    PRODUCTS: ['Sheet1', 'Products', 'Menu'],
    DISCOUNTS: 'Discount',
    EVENTS: 'Events'
  }
};

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

// Helper function to fetch data from any sheet
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

// Process events data
function processEventsData(eventsData) {
  if (!eventsData || eventsData.length === 0) {
    console.log('No events data to process from Google Sheets');
    return [];
  }

  console.log('Processing events data from Google Sheets:', eventsData);

  const processedEvents = eventsData
    .map((row, index) => {
      // Skip header row
      if (row['Event ID'] === 'Event ID' || row['Event Name'] === 'Event Name') {
        console.log('Skipping header row');
        return null;
      }

      // Validate required fields
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

// Rest of your existing functions remain the same
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

export async function fetchDiscountsFromGoogleSheet() {
  try {
    const discountData = await fetchSheetData(SHEET_CONFIG.ID, SHEET_CONFIG.NAMES.DISCOUNTS);
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

export function processDiscountsData(discountData) {
  if (!discountData || discountData.length === 0) return [];

  return discountData
    .map((item, index) => {
      const discountId = item['Discount ID'] || index + 1;
      const discountName = item['Discount Name'] || '';
      const duplicateCheck = item['Duplicate Check'] || '';
      const discountPercent = parseFloat(item['Discount %'] || '0');
      const price = parseFloat(item.Price || '0');
      const isActive = (item['Is Active'] || '').toLowerCase() === 'active';
      const productName = item['Product Name'] || '';
      const event = item['Event'] || '';

      if (!discountName && !productName) return null;

      return {
        id: discountId,
        discountName,
        productName,
        duplicateCheck,
        discountPercent,
        originalPrice: price,
        calculatedPrice:
          duplicateCheck === 'DUPLICATE' ? 'DUPLICATE' : price - price * (discountPercent / 100),
        isActive,
        event,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.id - b.id);
}

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

function processProductsData(data, categoriesMap) {
  const productsMap = {};

  data.forEach((item, index) => {
    const name = item.Name || item['Product Name'];
    if (!name) return;

    if (!productsMap[name]) {
      const category = item.Category || 'Uncategorized';
      const catInfo = categoriesMap[category.toLowerCase()] || {};
      productsMap[name] = {
        id: index + 1,
        name,
        image: item.Image || '/via.placeholder.com/400x300',
        price: parseFloat(item.Price || '0'),
        category,
        category_kh: catInfo.category_kh || category,
        description: item.Description || '',
        description_kh: catInfo.description_kh || item.Description || '',
        displayOrder: catInfo.displayOrder || 999,
        options: {},
      };
    }

    for (let i = 1; i <= 10; i++) {
      const optionName = item[`Option ${i} - Name`] || '';
      const choicesStr = item[`Option ${i} - Choices`] || '';
      const pricesStr = item[`Option ${i} - Prices`] || '';

      if (!optionName || !choicesStr) continue;

      const choices = choicesStr.split(',').map((v) => v.trim());
      const prices = pricesStr
        .split(',')
        .map((p) => parseFloat(p.trim()) || 0)
        .slice(0, choices.length);

      productsMap[name].options[optionName.toLowerCase()] = choices.map((c, idx) => ({
        name: c,
        price: prices[idx] || 0,
      }));
    }
  });

  return Object.values(productsMap).sort((a, b) => a.displayOrder - b.displayOrder);
}

export {
  fetchSheetData,
  processEventsData,
  processCategoriesData,
  processProductsData
};