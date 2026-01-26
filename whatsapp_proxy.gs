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
    let phone = e.parameter.phone || (e.postData ? JSON.parse(e.postData.contents).phone : null);
    let message = e.parameter.message || (e.postData ? JSON.parse(e.postData.contents).message : null);

    if (!phone || !message) {
      return response({ status: 'error', message: 'Missing parameters' });
    }

    // Direct API call to Ultramsg (Ensuring POST for their API)
    const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`;
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
    
    const res = UrlFetchApp.fetch(url, options);
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
