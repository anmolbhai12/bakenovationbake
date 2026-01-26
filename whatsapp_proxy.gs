/**
 * WhatsApp OTP Proxy for Bakenovation
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone' (even anonymous)
 */

const ULTRAMSG_INSTANCE = 'instance160005'; 
const ULTRAMSG_TOKEN = 'aephty6m2y29lovb';        

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let phone, message;
    
    // 1. Parse parameters from GET (query string) or POST (body)
    if (e.parameter && e.parameter.phone) {
      phone = e.parameter.phone;
      message = e.parameter.message;
    } else if (e.postData) {
      const body = JSON.parse(e.postData.contents);
      phone = body.phone;
      message = body.message;
    }

    if (!phone || !message) {
      return response({ status: 'error', message: 'Missing phone or message parameters' });
    }

    // 2. Prepare payload for Ultramsg
    const payload = {
      token: ULTRAMSG_TOKEN,
      to: phone,
      body: message
    };

    const options = {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded', 
      payload: payload,
      muteHttpExceptions: true
    };

    // 3. Call Ultramsg API
    const res = UrlFetchApp.fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, options);
    const result = JSON.parse(res.getContentText());

    return response({ status: 'success', data: result });

  } catch (error) {
    return response({ status: 'error', message: error.toString() });
  }
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
