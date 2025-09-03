// Free Google Sheets integration using JSON API
async function fetchProductsFromGoogleSheet() {
  try {
    // Use the correct Sheet ID from your edit URL
    const SHEET_ID = '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU';
    const SHEET_NAME = 'signature coffee';
    
    // Construct the JSON API URL
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // The API returns JSONP-like format, so we need to clean it up
    const jsonData = JSON.parse(text.substring(47).slice(0, -2));
    
    const rows = jsonData.table.rows;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in Google Sheet');
      return [];
    }

    // Process the data (skip header if needed)
    const productsFromSheet = rows.slice(1).map((row, index) => {
      const cellData = row.c.map((cell) => cell?.v || '');
      
      // Parse JSON options or use empty object
      let options = {};
      try {
        options = cellData[5] ? JSON.parse(cellData[5]) : {};
      } catch (e) {
        console.warn('Error parsing options JSON:', e);
      }
      
      return {
        id: index + 1,
        name: cellData[0] || '',
        image: cellData[1] || '/api/placeholder/300/200',
        price: parseFloat(cellData[2]) || 0,
        category: cellData[3] || '',
        description: cellData[4] || '',
        options: options
      };
    });

    return productsFromSheet;

  } catch (error) {
    console.error('Error fetching from Google Sheets (free method):', error);
    return [];
  }
}

module.exports = {
  fetchProductsFromGoogleSheet
};