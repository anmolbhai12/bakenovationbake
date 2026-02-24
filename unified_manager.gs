/**
 * Bakenovation Unified Manager - v1.7 (RESILIENT)
 * One script to handle everything.
 */

const SPREADSHEET_ID = '1sOmMpurKA-BAqEaMZK0DjltkM7XHfZLlhpCfEUAaMQI';
const ORDER_SHEET_NAME = 'Orders';
const SIGNUP_SHEET_NAME = 'Signups';
const WHATSAPP_BOT_URL = 'https://bakenovation-bot.alwaysdata.net';

const HEADERS = ['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'DeliveryTime', 'Status', 'BotState'];

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
    if (action === 'get_order') return getOrder(data);
    if (action === 'sync_signup') return syncSignup(data);
    if (action === 'send_email_otp') return sendEmailOTP(data);
    if (action === 'send_whatsapp_otp') return sendWhatsAppOTP(data);
    if (action === 'debug') return jsonResponse({ status: 'success', info: 'Bakenovation Script v2.0 is Live!' });

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

function createOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, HEADERS);
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
  sheet.appendRow([
    new Date().toISOString(), 
    orderId, 
    data.name || '', 
    data.phone || '', 
    data.email || '', 
    JSON.stringify(details), 
    '', // Amount
    '', // DeliveryDate
    '', // DeliveryTime
    'Pending', // Status
    'START' // BotState
  ]);
  return jsonResponse({ status: 'success', orderId: orderId });
}

function listOrders() {
  const sheet = getSheet(ORDER_SHEET_NAME, HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim());
  
  const orders = values.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => {
      let key = h.replace(/\s+/g, '');
      if (key === 'orderid') obj['OrderID'] = row[i];
      else if (key === 'name') obj['Name'] = row[i];
      else if (key === 'phone') obj['Phone'] = row[i];
      else if (key === 'orderdetails') obj['OrderDetails'] = row[i];
      else if (key === 'status') obj['Status'] = row[i];
      else if (key === 'amount') obj['Amount'] = row[i];
      else if (key === 'deliverydate') obj['DeliveryDate'] = row[i];
      else if (key === 'deliverytime') obj['DeliveryTime'] = row[i];
      else if (key === 'botstate') obj['BotState'] = row[i];
      else if (key === 'timestamp') obj['Timestamp'] = row[i];
    });
    return obj;
  });
  return jsonResponse({ status: 'success', orders: orders });
}

function getOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim().replace(/\s+/g, ''));
  const orderIdCol = headers.indexOf('orderid');
  const phoneCol = headers.indexOf('phone');

  for (let i = 1; i < values.length; i++) {
    if ((data.orderId && values[i][orderIdCol] == data.orderId) || (data.phone && values[i][phoneCol] == data.phone)) {
      let obj = {};
      headers.forEach((h, idx) => { obj[h] = values[i][idx]; });
      return jsonResponse({ status: 'success', order: obj });
    }
  }
  return jsonResponse({ status: 'error', message: 'Order not found' });
}

function updateOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => h.toString().toLowerCase().trim().replace(/\s+/g, ''));
  
  const orderIdCol = headers.indexOf('orderid');
  const phoneCol = headers.indexOf('phone');
  const amountCol = headers.indexOf('amount');
  const dateCol = headers.indexOf('deliverydate');
  const timeCol = headers.indexOf('deliverytime');
  const statusCol = headers.indexOf('status');
  const botStateCol = headers.indexOf('botstate');

  for (let i = 1; i < values.length; i++) {
    let match = false;
    if (orderIdCol !== -1 && data.orderId && values[i][orderIdCol].toString() === data.orderId.toString()) match = true;
    else if (phoneCol !== -1 && data.phone && values[i][phoneCol].toString() === data.phone.toString()) match = true;

    if (match) {
      if (data.amount !== undefined && amountCol !== -1) sheet.getRange(i + 1, amountCol + 1).setValue(data.amount);
      if (data.deliveryDate !== undefined && dateCol !== -1) sheet.getRange(i + 1, dateCol + 1).setValue(data.deliveryDate);
      if (data.deliveryTime !== undefined && timeCol !== -1) sheet.getRange(i + 1, timeCol + 1).setValue(data.deliveryTime);
      if (data.status !== undefined && statusCol !== -1) sheet.getRange(i + 1, statusCol + 1).setValue(data.status);
      if (data.botState !== undefined && botStateCol !== -1) sheet.getRange(i + 1, botStateCol + 1).setValue(data.botState);
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
  let ss = null;
  
  // Method 1: Try ID (Hardcoded)
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID !== 'YOUR_ID_HERE') {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }
  } catch (e) {}

  // Method 2: Try Active (If bound)
  if (!ss) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {}
  }

  // Method 3: Try finding ANY accessible spreadsheet (Last Resort)
  if (!ss) {
    try {
      const files = DriveApp.getFilesByType(MimeType.GOOGLE_SHEETS);
      if (files.hasNext()) {
        ss = SpreadsheetApp.open(files.next());
      }
    } catch (e) {}
  }

  if (!ss) {
    throw new Error("CRITICAL: No Spreadsheet Found. Please open your Google Sheet, go to Extensions > Apps Script, and paste the code there.");
  }

  let sheet = ss.getSheetByName(name);
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
