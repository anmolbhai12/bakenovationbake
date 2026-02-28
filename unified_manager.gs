/**
 * Bakenovation Unified Manager - v2.0 (NEW ACCOUNT)
 * Account: bakenovationbake@gmail.com
 * Sheets:
 *   - "Orders"          → All cake order details
 *   - "Email Logins"    → Users who sign up/login via Email OTP
 *   - "WhatsApp Logins" → Users who sign up/login via WhatsApp OTP
 */

const SPREADSHEET_ID = '1kjEagCxbujXzdl00btRD87I8qpJlZiGeoBNPpWol1W8';
const ORDER_SHEET_NAME = 'Orders';
const EMAIL_LOGIN_SHEET_NAME = 'Email Logins';
const WHATSAPP_LOGIN_SHEET_NAME = 'WhatsApp Logins';
const WHATSAPP_BOT_URL = 'https://bakenovation-bot.alwaysdata.net';

const ORDER_HEADERS = ['Timestamp', 'OrderID', 'Name', 'Phone', 'Email', 'OrderDetails', 'Amount', 'DeliveryDate', 'DeliveryTime', 'Status', 'BotState'];
const EMAIL_LOGIN_HEADERS = ['Timestamp', 'Name', 'Email', 'DOB', 'Type'];
const WHATSAPP_LOGIN_HEADERS = ['Timestamp', 'Name', 'WhatsApp', 'DOB', 'Type'];

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    let data = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try { data = Object.assign(data, JSON.parse(e.postData.contents)); } catch (f) {}
    }

    const action = data.action;
    if (action === 'diagnostic') return diagnosticCheck();
    if (!action) return jsonResponse({ status: 'error', message: 'No action specified' });

    if (action === 'create_order') return createOrder(data);
    if (action === 'list_orders') return listOrders();
    if (action === 'update_order') return updateOrder(data);
    if (action === 'get_order') return getOrder(data);
    if (action === 'sync_signup') return syncSignup(data);
    if (action === 'send_email_otp') return sendEmailOTP(data);
    if (action === 'send_whatsapp_otp') return sendWhatsAppOTP(data);
    if (action === 'debug') return jsonResponse({ status: 'success', info: 'Bakenovation Script v2.0 (NEW ACCOUNT) is Live!' });

    return jsonResponse({ status: 'error', message: 'Unknown action: ' + action });
  } catch (error) {
    return jsonResponse({ status: 'error', message: error.toString() });
  }
}

// ─── ORDERS ───────────────────────────────────────────────────────────────────

function createOrder(data) {
  const sheet = getSheet(ORDER_SHEET_NAME, ORDER_HEADERS);
  const orderId = 'ORD' + Date.now();

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

  sheet.appendRow([
    new Date().toISOString(), orderId,
    data.name || '', data.phone || '', data.email || '',
    JSON.stringify(details), data.price || '',
    data.date || '', data.time || '',
    data.status || 'Pending', 'START'
  ]);

  // Send admin notification email
  try {
    const adminEmail = Session.getEffectiveUser().getEmail();
    const subject = `🎂 NEW ORDER: ${data.name} [${orderId}]`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #630d21; border-bottom: 2px solid #630d21; padding-bottom: 10px;">New Order Received!</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Address:</strong> ${data.address}, ${data.pincode}</p>
        <div style="background: #fdf5f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #630d21;">Order Details:</h3>
          <p><strong>Product:</strong> ${details.product}</p>
          <p><strong>Quantity:</strong> ${details.qty}</p>
          <p><strong>Diet:</strong> ${details.diet}</p>
          ${details.message ? `<p><strong>Message:</strong> "${details.message}"</p>` : ''}
          <p><strong>Delivery:</strong> ${details.deliveryDate} | ${details.deliveryTime}</p>
          <p style="font-size: 1.2rem; color: #630d21;"><strong>Total Amount: Rs. ${details.price}</strong></p>
        </div>
        ${details.img ? `<div style="text-align:center;"><img src="${details.img}" style="max-width:100%;border-radius:10px;" /></div>` : ''}
      </div>`;
    GmailApp.sendEmail(adminEmail, subject, "", { htmlBody: htmlBody, name: "Bakenovation Notifications" });
  } catch (e) { Logger.log("Admin email failed: " + e.toString()); }

  return jsonResponse({ status: 'success', orderId: orderId });
}

function listOrders() {
  const sheet = getSheet(ORDER_SHEET_NAME, ORDER_HEADERS);
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
  const sheet = getSheet(ORDER_SHEET_NAME, ORDER_HEADERS);
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
  const sheet = getSheet(ORDER_SHEET_NAME, ORDER_HEADERS);
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

// ─── SIGNUPS / LOGINS ─────────────────────────────────────────────────────────

function syncSignup(data) {
  const method = data.method || 'email';
  if (method === 'whatsapp') {
    recordUniqueLogin(WHATSAPP_LOGIN_SHEET_NAME, WHATSAPP_LOGIN_HEADERS, data.name, data.identifier, data.dob, data.type || 'Signup');
  } else {
    recordUniqueLogin(EMAIL_LOGIN_SHEET_NAME, EMAIL_LOGIN_HEADERS, data.name, data.identifier, data.dob, data.type || 'Signup');
  }
  return jsonResponse({ status: 'success' });
}

// ─── OTP SENDERS ──────────────────────────────────────────────────────────────

function sendEmailOTP(data) {
  const to = data.to_email || data.email;
  const otp = data.otp_code || data.otp;
  const userName = data.user_name || "Valued Customer";

  if (!to || !otp) return jsonResponse({ status: 'error', message: 'Missing email/otp' });

  // Log to Email Logins sheet only if new user
  recordUniqueLogin(EMAIL_LOGIN_SHEET_NAME, EMAIL_LOGIN_HEADERS, userName, to, '', 'OTP Sent');

  const subject = `🔐 Bakenovation Studio | Secure Verification Code: ${otp}`;
  const htmlBody = `
    <!DOCTYPE html><html>
    <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#0c0410;">
      <div style="font-family:'Garamond',Georgia,serif;max-width:600px;margin:40px auto;background-color:#0c0410;border:1px solid #2d1b33;overflow:hidden;">
        <div style="padding:60px 40px;text-align:center;background:linear-gradient(180deg,#15081a 0%,#0c0410 100%);">
          <h1 style="color:#d4af37;font-size:32px;font-weight:300;letter-spacing:8px;text-transform:uppercase;margin:0;">Bakenovation</h1>
          <div style="color:rgba(212,175,55,0.6);font-size:11px;letter-spacing:4px;text-transform:uppercase;margin-top:15px;">Official Signature Verification</div>
        </div>
        <div style="padding:50px 40px;background-color:#0c0410;color:#ffffff;border-top:1px solid #2d1b33;">
          <p style="font-size:18px;color:#d4af37;margin-bottom:30px;">Dear ${userName},</p>
          <p style="font-size:16px;line-height:1.8;color:#d1ced1;margin-bottom:40px;font-family:'Verdana',sans-serif;">
            For your account security, please use the following unique verification code to complete your access to the Atelier.
          </p>
          <div style="margin:40px 0;padding:40px 20px;background:rgba(212,175,55,0.03);border:1px solid rgba(212,175,55,0.2);border-radius:2px;text-align:center;">
            <div style="color:rgba(212,175,55,0.5);font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;">Your Secure Code</div>
            <div style="font-size:48px;font-weight:700;color:#d4af37;letter-spacing:12px;font-family:'Courier New',Courier,monospace;">${otp}</div>
          </div>
          <p style="font-size:13px;color:#5c5561;line-height:1.6;font-style:italic;margin-top:40px;font-family:'Verdana',sans-serif;">
            This code will expire in 10 minutes. If you did not request this, please ignore this communication.
          </p>
        </div>
        <div style="padding:40px;background-color:#08020a;text-align:center;border-top:1px solid #1a0b1f;">
          <p style="color:#443c4a;font-size:11px;letter-spacing:1px;margin:0;">© 2026 BAKENOVATION STUDIO. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </body></html>`;

  try {
    GmailApp.sendEmail(to, subject, "", { htmlBody: htmlBody, name: "Bakenovation Studio" });
    return jsonResponse({ status: 'success' });
  } catch (e) {
    return jsonResponse({ status: 'error', message: "Email failed: " + e.toString() });
  }
}

function sendWhatsAppOTP(data) {
  const phone = data.phone;
  const message = data.message;
  const userName = data.user_name || '';
  if (!phone || !message) return jsonResponse({ status: 'error', message: 'Missing phone/msg' });

  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
  if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

  // Log to WhatsApp Logins sheet only if new user
  recordUniqueLogin(WHATSAPP_LOGIN_SHEET_NAME, WHATSAPP_LOGIN_HEADERS, userName, cleanPhone, '', 'OTP Sent');

  try {
    const response = UrlFetchApp.fetch(WHATSAPP_BOT_URL + '/send-otp', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ phone: cleanPhone, message: message }),
      muteHttpExceptions: true
    });
    const result = JSON.parse(response.getContentText());
    return result.status === 'success'
      ? jsonResponse({ status: 'success' })
      : jsonResponse({ status: 'error', message: result.message || 'Bot error' });
  } catch (e) {
    return jsonResponse({ status: 'error', message: 'Connection to bot failed' });
  }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function recordUniqueLogin(sheetName, headers, name, identifier, dob, type) {
  try {
    const sheet = getSheet(sheetName, headers);
    const data = sheet.getDataRange().getValues();
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        // Identifier (Email/Phone) is always the 3rd column (index 2)
        if (data[i][2] && data[i][2].toString().toLowerCase().trim() === identifier.toString().toLowerCase().trim()) {
          return; // User already exists! Do not record a duplicate.
        }
      }
    }
    // New user, append them
    sheet.appendRow([new Date(), name || '', identifier || '', dob || '', type || '']);
  } catch(e) {}
}

function getSheet(name, headers) {
  let ss = null;
  try {
    if (SPREADSHEET_ID) ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (e) {}
  if (!ss) {
    try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  }
  if (!ss) throw new Error("No Spreadsheet found. Open via Extensions > Apps Script from your Google Sheet.");

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
    const sheets = ss.getSheets().map(s => s.getName());
    return jsonResponse({ status: 'success', spreadsheetName: ss.getName(), sheets: sheets });
  } catch (e) {
    return jsonResponse({ status: 'error', message: e.toString() });
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
