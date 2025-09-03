// Free Google Sheets integration using JSON API
async function fetchProductsFromGoogleSheet() {
  try {
    // Use the correct Sheet ID from your edit URL
    const SHEET_ID = '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU';
    const SHEET_NAME = 'signature coffee';
    
    // Use the more reliable opensheet proxy
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.log('No data found in Google Sheet');
      return [];
    }

    console.log('Raw data from Google Sheet:', data);

    // Process the data with flexible column mapping
    const productsFromSheet = data.map((item, index) => {
      // Handle different possible column names
      const name = item.Name || item.name || item['Product Name'] || '';
      const image = item.Image || item.image || item.Photo || item.Picture || '/api/placeholder/300/200';
      const price = parseFloat(item.Price || item.price || item.Cost || 0);
      const category = item.Category || item.category || item.Type || 'Uncategorized';
      const description = item.Description || item.description || item.Desc || '';
      
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
        image: image,
        price: price,
        category: category,
        description: description,
        options: options
      };
    });

    console.log('Processed products:', productsFromSheet);
    return productsFromSheet;

  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

module.exports = {
  fetchProductsFromGoogleSheet
};