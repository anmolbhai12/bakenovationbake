/**
 * WhatsApp OTP Proxy for Bakenovation
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone' (even anonymous)
 * 
 * IMPORTANT: After updating, redeploy as Web App with:
 * - Execute as: Me
 * - Who has access: Anyone
 */

const BOT_URL = 'https://bakenovation-bot.alwaysdata.net/send-otp';

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const startTime = new Date();
  
  try {
    // Extract parameters from GET or POST
    let phone = e.parameter.phone || (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).phone : null);
    let message = e.parameter.message || (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).message : null);

    // Validate parameters
    if (!phone || !message) {
      return response({ status: 'error', message: 'Missing phone or message' });
    }

    // Sanitize phone number (remove non-digits)
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
    
    // Prepare API call to our Alwaysdata Bot
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({
        phone: cleanPhone,
        message: message
      }),
      muteHttpExceptions: true
    };
    
    // Send to Alwaysdata
    const res = UrlFetchApp.fetch(BOT_URL, options);
    const result = JSON.parse(res.getContentText());
    
    return response({ 
      status: result.status, 
      message: result.message,
      phone: cleanPhone,
      timestamp: startTime.toISOString()
    });

  } catch (error) {
    return response({ status: 'error', message: error.toString() });
  }
}

function response(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return output.setHeader('Access-Control-Allow-Origin', '*');
}
