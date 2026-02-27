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
    if (action === 'debug') return jsonResponse({ status: 'success', info: 'Bakenovation Script v3.0 (SOVEREIGN) is Live!' });

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}


function createOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, HEADERS);
  const orderId = 'ORD' + Date.now();
  
  // Dynamic details based on product type
  const details = {
    product: data.title || 'Product',
    price: data.price || '0',
    weight: data.weight || 'N/A',
    qty: data.qty || '1',
    diet: data.diet || 'N/A',
    deliveryDate: data.date || 'N/A',
    deliveryTime: data.time || 'N/A',
    message: data.message || '',
    address: data.address || '',
    pincode: data.pincode || '',
    tiers: data.tiers || null,
    fakeTier: data.fakeTier || null,
    whichFake: data.whichFake || null,
    img: data.img || ''
  };

  const row = [
    new Date().toISOString(),
    orderId,
    data.name || '',
    data.phone || '',
    data.email || '',
    JSON.stringify(details),
    data.price || '', // Amount
    data.date || '', // DeliveryDate
    data.time || '', // DeliveryTime
    data.status || 'Pending', // Status
    'START' // BotState
  ];

  sheet.appendRow(row);

  // GMAIL NOTIFICATION (MODERN & RICH)
  try {
    const adminEmail = Session.getEffectiveUser().getEmail();
    const subject = `🎂 NEW ORDER: ${data.name} [${orderId}]`;
    
    let htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #630d21; border-bottom: 2px solid #630d21; padding-bottom: 10px;">New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}, ${data.pincode}</p>
        
        <div style="background: #fdf5f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #630d21;">Order Details:</h3>
          <p><strong>Product:</strong> ${details.product}</p>
          <p><strong>Quantity:</strong> ${details.qty}</p>
          <p><strong>Weight/Packets:</strong> ${details.weight}</p>
          <p><strong>Diet:</strong> ${details.diet}</p>
          ${details.tiers ? `<p><strong>Tiers:</strong> ${details.tiers}</p>` : ''}
          ${details.fakeTier === 'Yes' ? `<p><strong>Fake Tier:</strong> Yes (${details.whichFake})</p>` : ''}
          ${details.message ? `<p><strong>Message:</strong> "${details.message}"</p>` : ''}
          <p><strong>Delivery:</strong> ${details.deliveryDate} | ${details.deliveryTime}</p>
          <p style="font-size: 1.2rem; color: #630d21;"><strong>Total Amount: Rs. ${details.price}</strong></p>
        </div>

        ${details.img ? `
        <div style="text-align: center; margin-top: 20px;">
          <p><strong>Product Image:</strong></p>
          <img src="${details.img}" style="max-width: 100%; border-radius: 10px; border: 1px solid #ddd;" />
          <p style="font-size: 0.8rem;"><a href="${details.img}">Click here to view full image</a></p>
        </div>` : ''}
        
        <p style="margin-top: 30px; font-size: 0.9rem; color: #888;">Order placed via Bakenovation Direct Payment System.</p>
      </div>
    `;

    GmailApp.sendEmail(adminEmail, subject, "", {
      htmlBody: htmlBody,
      name: "Bakenovation Notifications"
    });
    
  } catch (e) {
    Logger.log("Email failed: " + e.toString());
  }

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
