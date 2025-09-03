// Free Google Sheets integration using JSON API
async function fetchProductsFromGoogleSheet() {
  try {
    // Use the correct Sheet ID from your edit URL
    const SHEET_ID = '1IxeuobNv6Qk7-EbGn4qzTxT4xRwoMqH_1hT2-pRSpPU';
    const SHEET_NAMES = ['signature coffee', 'signature_coffee', 'Sheet1']; // Try multiple tab names

    for (const SHEET_NAME of SHEET_NAMES) {
      const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
      console.log('Trying Google Sheet URL:', url);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`HTTP error! status: ${response.status} for tab "${SHEET_NAME}"`);
          continue;
        }

        const data = await response.json();
        if (!data || data.length === 0) {
          console.log(`No data found in tab "${SHEET_NAME}"`);
          continue;
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
        console.error(`Error fetching from tab "${SHEET_NAME}":`, error);
        continue;
      }
    }

    console.error('Failed to fetch data from all tried sheet tabs. Please check your Sheet ID, tab name, and publish settings.');
    return [];
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    return [];
  }
}

module.exports = {
  fetchProductsFromGoogleSheet
};