// Free Google Sheets integration using JSON API
async function fetchProductsFromGoogleSheet() {
  try {
    const SHEET_ID = '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU';
    
    // First, fetch categories from the 'Categories' sheet
    const categoriesData = await fetchSheetData(SHEET_ID, 'Categories');
    const categoriesMap = processCategoriesData(categoriesData);
    
    // Then, fetch products from the main sheet (try multiple possible names)
    const SHEET_NAMES = ['Sheet1', 'Products', 'Menu'];
    let productsFromSheet = [];
    
    for (const SHEET_NAME of SHEET_NAMES) {
      const data = await fetchSheetData(SHEET_ID, SHEET_NAME);
      if (data && data.length > 0) {
        productsFromSheet = processProductsData(data, categoriesMap);
        break;
      }
    }

    console.log('Processed products with categories:', productsFromSheet);
    return productsFromSheet;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

// Helper function to fetch data from any sheet
async function fetchSheetData(sheetId, sheetName) {
  try {
    const url = `https://opensheet.elk.sh/${sheetId}/${sheetName}`;
    console.log('Fetching from URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status} for sheet "${sheetName}"`);
      return null;
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      console.log(`No data found in sheet "${sheetName}"`);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Error fetching from sheet "${sheetName}":`, error);
    return null;
  }
}

// Process categories data and create a mapping object
function processCategoriesData(categoriesData) {
  if (!categoriesData) return {};
  
  const categoriesMap = {};
  
  categoriesData.forEach(item => {
    const category = item.Category || item.category || '';
    const category_kh = item.category_kh || item['Category_KH'] || category;
    const displayOrder = parseInt(item['Display Order'] || item.display_order || item.order || '0');
    const description = item.Description || item.description || '';
    const description_kh = item.description_kh || item['Description_KH'] || description;
    
    if (category) {
      categoriesMap[category.toLowerCase()] = {
        category_kh,
        displayOrder,
        description,
        description_kh
      };
    }
  });
  
  console.log('Categories map:', categoriesMap);
  return categoriesMap;
}

// Process products data with categories information
function processProductsData(data, categoriesMap) {
  console.log('Raw data from Google Sheets:', data);
  
  // Group rows by product name to combine multiple option rows
  const productsMap = {};
  
  data.forEach((item, index) => {
    console.log('Processing row:', item);
    
    const name = item.Name || item.name || item['Product Name'] || '';
    if (!name) {
      console.log('Skipping row without product name');
      return;
    }
    
    if (!productsMap[name]) {
      // Handle different possible column names
      const name_kh = item['Name_KH'] || item.name_kh || item['Khmer Name'] || name;
      const image = item.Image || item.image || item.Photo || item.Picture || '/api/placeholder/300/200';
      const price = parseFloat(item.Price || item.price || item.Cost || 0);
      const category = item.Category || item.category || item.Type || 'Uncategorized';
      const description = item.Description || item.description || item.Desc || '';
      const description_kh = item['Description_KH'] || item.description_kh || item['Khmer Description'] || description;
      
      // Get category info from categories map
      const categoryInfo = categoriesMap[category.toLowerCase()] || {};
      
      productsMap[name] = {
        id: index + 1,
        name: name,
        name_kh: name_kh,
        image: image,
        price: price,
        category: category,
        category_kh: categoryInfo.category_kh || category,
        description: description,
        description_kh: categoryInfo.description_kh || description_kh || description,
        displayOrder: categoryInfo.displayOrder || 999,
        options: {}
      };
      
      console.log('Created new product:', productsMap[name]);
    }
    
    // Process options from the new columns - check ALL possible column name formats
    for (let i = 1; i <= 10; i++) {
    // Try multiple column name formats
      const optionName = item[`Option ${i} - Name`] || item[`Option ${i} Name`] || item[`option${i}_name`] || item[`Option_${i}_Name`] || '';
      const choicesStr = item[`Option ${i} - Choices`] || item[`Option ${i} Choices`] || item[`option${i}_choices`] || item[`Option_${i}_Choices`] || '';
      const pricesStr = item[`Option ${i} - Prices`] || item[`Option ${i} Prices`] || item[`option${i}_prices`] || item[`Option_${i}_Prices`] || '';
      
      console.log(`Option ${i} data:`, { optionName, choicesStr, pricesStr });
      
      if (optionName && choicesStr) {
        try {
          // Parse choices and prices
          const choices = choicesStr.split(',').map(v => v.trim()).filter(v => v !== '');
          const prices = pricesStr.split(',').map(p => {
            const trimmed = p.trim();
            return trimmed === '' ? 0 : parseFloat(trimmed) || 0;
          });
          
          // Ensure we have the same number of prices as choices
          while (prices.length < choices.length) {
            prices.push(0);
          }
          while (prices.length > choices.length) {
            prices.pop();
          }
          
          // FIX: Create the correct structure expected by the modal
          const optionValues = choices.map((choice, idx) => ({
            name: choice,
            price: prices[idx] || 0
          }));
          
          // FIX: Use the correct structure - array directly, not nested object
          productsMap[name].options[optionName.toLowerCase()] = optionValues;
          
          console.log(`Added option "${optionName}":`, optionValues);
        } catch (error) {
          console.error('Error parsing options:', error, {optionName, choicesStr, pricesStr});
        }
      }
    }


  });
  
  const result = Object.values(productsMap).sort((a, b) => a.displayOrder - b.displayOrder);
  console.log('Final processed products:', result);
  return result;
}

module.exports = {
  fetchProductsFromGoogleSheet
};