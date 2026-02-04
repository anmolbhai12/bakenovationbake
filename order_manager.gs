/**
 * Bakenovation Order Manager - Google Apps Script
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "Bakenovation Orders"
 * 2. Add headers: Timestamp | OrderID | Name | Phone | Email | OrderDetails | Amount | DeliveryDate | Status
 * 3. Paste this code into script.google.com
 * 4. Deploy as Web App:
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and use it in your website
 */

const SHEET_NAME = 'Orders';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const action = e.parameter.action || (e.postData && JSON.parse(e.postData.contents).action);
    
    switch(action) {
      case 'create':
        return createOrder(e);
      case 'list':
        return listOrders(e);
      case 'update':
        return updateOrder(e);
      default:
        return jsonResponse({ status: 'error', message: 'Invalid action' });
    }
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// CREATE: Add new order from website
function createOrder(e) {
  try {
    let data = e.parameter;
    
    // Support POST JSON
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    const sheet = getSheet();
    const orderId = 'ORD' + Date.now();
    const timestamp = new Date().toISOString();
    
    // Prepare order details from form data
    const orderDetails = {
      shape: data.shape || 'N/A',
      flavor: data.flavor || 'N/A',
      tiers: data.tiers || 'N/A',
      address: data.address || '',
      message: data.message || '',
      extra: data.extra_description || '',
      design: data.ordered_design || ''
    };
    
    const detailsText = JSON.stringify(orderDetails);
    
    // Append to sheet
    sheet.appendRow([
      timestamp,
      orderId,
      data.name || '',
      data.phone || '',
      data.email || '',
      detailsText,
      '', // Amount (to be filled by admin)
      '', // DeliveryDate (to be filled by admin)
      'Pending' // Status
    ]);
    
    return jsonResponse({
      status: 'success',
      orderId: orderId,
      message: 'Order received successfully'
    });
    
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// LIST: Get all orders (for admin dashboard)
function listOrders(e) {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const orders = rows.map(row => {
      let order = {};
      headers.forEach((header, index) => {
        order[header] = row[index];
      });
      return order;
    });
    
    return jsonResponse({
      status: 'success',
      orders: orders
    });
    
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// UPDATE: Admin sets Amount/Date/Status
function updateOrder(e) {
  try {
    let data = e.parameter;
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    const orderId = data.orderId;
    const amount = data.amount;
    const deliveryDate = data.deliveryDate;
    const status = data.status;
    
    const sheet = getSheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Find the order row
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === orderId) { // Column B = OrderID
        if (amount) sheet.getRange(i + 1, 7).setValue(amount); // Column G = Amount
        if (deliveryDate) sheet.getRange(i + 1, 8).setValue(deliveryDate); // Column H = DeliveryDate
        if (status) sheet.getRange(i + 1, 9).setValue(status); // Column I = Status
        
        return jsonResponse({
          status: 'success',
          message: 'Order updated successfully'
        });
      }
    }
    
    return jsonResponse({ status: 'error', message: 'Order not found' });
    
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// Helper: Get or create sheet
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'Status']);
  }
  
  return sheet;
}

// Helper: JSON response
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
