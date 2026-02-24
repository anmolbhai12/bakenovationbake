/**
 * Bakenovation Unified Manager - v1.7 (RESILIENT)
 * One script to handle everything.
 */

const SPREADSHEET_ID = '1sOmMpurKA-BAqEaMZK0DjltkM7XHfZLlhpCfEUAaMQI';
const ORDER_SHEET_NAME = 'Orders';
const SIGNUP_SHEET_NAME = 'Signups';
const WHATSAPP_BOT_URL = 'https://bakenovation-bot.alwaysdata.net';

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    let data = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        data = Object.assign(data, JSON.parse(e.postData.contents));
      } catch (f) {}
    }

    const action = data.action;
    if (action === 'diagnostic') return diagnosticCheck();
    if (!action) return jsonResponse({ status: 'error', message: 'No action specified' });

    // Internal Route Map
    if (action === 'create_order') return createOrder(data);
    if (action === 'list_orders') return listOrders();
    if (action === 'update_order') return updateOrder(data);
    if (action === 'sync_signup') return syncSignup(data);
    if (action === 'send_email_otp') return sendEmailOTP(data);
    if (action === 'send_whatsapp_otp') return sendWhatsAppOTP(data);
    if (action === 'debug') return jsonResponse({ status: 'success', info: 'Bakenovation Script v1.3 is Live!' });

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function createOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, ['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'Status']);
  const orderId = 'ORD' + Date.now();
  const details = {
    shape: data.shape || 'N/A',
    flavor: data.flavor || 'N/A',
    tiers: data.tiers || 'N/A',
    address: data.address || '',
    message: data.message || '',
    extra: data.extra_description || '',
    design: data.ordered_design || ''
  };
  sheet.appendRow([new Date().toISOString(), orderId, data.name || '', data.phone || '', data.email || '', JSON.stringify(details), '', '', 'Pending']);
  return jsonResponse({ status: 'success', orderId: orderId });
}

function listOrders() {
  const sheet = getSheet(ORDER_SHEET_NAME, ['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'Status']);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim());
  
  const orders = values.slice(1).map(row => {
    let obj = {};
    // Map normalized headers to script-friendly keys
    headers.forEach((h, i) => {
      let key = h.replace(/\s+/g, ''); // "Order ID" -> "orderid"
      if (key === 'orderid') obj['OrderID'] = row[i];
      else if (key === 'name') obj['Name'] = row[i];
      else if (key === 'phone') obj['Phone'] = row[i];
      else if (key === 'orderdetails') obj['OrderDetails'] = row[i];
      else if (key === 'status') obj['Status'] = row[i];
      else if (key === 'amount') obj['Amount'] = row[i];
      else if (key === 'timestamp') obj['Timestamp'] = row[i];
    });
    return obj;
  });
  return jsonResponse({ status: 'success', orders: orders });
}

function updateOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, ['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'Status']);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim().replace(/\s+/g, ''));
  
  const orderIdCol = headers.indexOf('orderid');
  const phoneCol = headers.indexOf('phone');
  const nameCol = headers.indexOf('name');
  const amountCol = headers.indexOf('amount');
  const dateCol = headers.indexOf('deliverydate');
  const statusCol = headers.indexOf('status');

  for (let i = 1; i < values.length; i++) {
    let match = false;
    // Resilient Matching
    if (orderIdCol !== -1 && data.orderId && values[i][orderIdCol].toString() === data.orderId.toString()) match = true;
    else if (phoneCol !== -1 && data.phone && values[i][phoneCol].toString() === data.phone.toString()) match = true;
    else if (nameCol !== -1 && data.name && values[i][nameCol].toString() === data.name.toString()) match = true;

    if (match) {
      if (data.amount && amountCol !== -1) sheet.getRange(i + 1, amountCol + 1).setValue(data.amount);
      if (data.deliveryDate && dateCol !== -1) sheet.getRange(i + 1, dateCol + 1).setValue(data.deliveryDate);
      if (data.status && statusCol !== -1) sheet.getRange(i + 1, statusCol + 1).setValue(data.status);
      return jsonResponse({ status: 'success' });
    }
  }
  return jsonResponse({ status: 'error', message: 'Order reference not found' });
}

function syncSignup(data) {
  const sheet = getSheet(SIGNUP_SHEET_NAME, ['timestamp', 'name', 'identifier', 'dob', 'method', 'type']);
  sheet.appendRow([new Date(), data.name || '', data.identifier || '', data.dob || '', data.method || '', data.type || 'Signup']);
  return jsonResponse({ status: 'success' });
}

function sendEmailOTP(data) {
  const to = data.to_email || data.email;
  const otp = data.otp_code || data.otp;
  if (!to || !otp) return jsonResponse({ status: 'error', message: 'Missing email/otp' });
  const html = `<div style="padding:20px; border:1px solid #d4af37; background:#0c0410; color:#fff;"><h1>Bakenovation</h1><p>Code: <b>${otp}</b></p></div>`;
  GmailApp.sendEmail(to, `🔐 Verification Code: ${otp}`, "", { htmlBody: html, name: "Bakenovation Studio" });
  return jsonResponse({ status: 'success' });
}

function sendWhatsAppOTP(data) {
  if (!data.phone || !data.message) return jsonResponse({ status: 'error', message: 'Missing phone/msg' });
  try {
    UrlFetchApp.fetch(WHATSAPP_BOT_URL + '/send-message', {
      method: 'post', contentType: 'application/json',
      payload: JSON.stringify({ phone: data.phone, message: data.message }),
      muteHttpExceptions: true
    });
    return jsonResponse({ status: 'success' });
  } catch (e) {
    return jsonResponse({ status: 'success', warning: 'Bot offline' });
  }
}

function getSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  
  // FALLBACK: If "Orders" tab is missing, take the first sheet (Legend Style)
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function diagnosticCheck() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = getSheet(ORDER_SHEET_NAME, []);
    const sheets = ss.getSheets().map(s => s.getName());
    const data = sheet.getDataRange().getValues();
    const headers = data[0] || [];
    const sample = data.slice(1, 3); // Get first 2 rows of data
    
    return jsonResponse({
      status: 'success',
      spreadsheetName: ss.getName(),
      tabsFound: sheets,
      activeTabUsed: sheet.getName(),
      headers: headers,
      sampleData: sample
    });
  } catch (e) {
    return jsonResponse({ status: 'error', message: e.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
