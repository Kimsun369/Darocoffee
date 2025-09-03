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
  return data.map((item, index) => {
    // Handle different possible column names
    const name = item.Name || item.name || item['Product Name'] || '';
    const name_kh = item['Name_KH'] || item.name_kh || item['Khmer Name'] || name;
    const image = item.Image || item.image || item.Photo || item.Picture || '/api/placeholder/300/200';
    const price = parseFloat(item.Price || item.price || item.Cost || 0);
    const category = item.Category || item.category || item.Type || 'Uncategorized';
    const description = item.Description || item.description || item.Desc || '';
    const description_kh = item['Description_KH'] || item.description_kh || item['Khmer Description'] || description;
    
    // Get category info from categories map
    const categoryInfo = categoriesMap[category.toLowerCase()] || {};
    
    // Parse JSON options or use empty object
    let options = {};
    try {
      const optionsData = item.Options || item.options || item.Customizations || item['Options (JSON)'] || '';
      options = optionsData ? JSON.parse(optionsData) : {};
    } catch (e) {
      console.warn('Error parsing options JSON:', e);
    }
    
    return {
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
      options: options
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder); // Sort by display order
}

module.exports = {
  fetchProductsFromGoogleSheet
};