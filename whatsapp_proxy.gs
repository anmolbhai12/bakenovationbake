/**
 * WhatsApp OTP Proxy for Bakenovation
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone' (even anonymous)
 */

const ULTRAMSG_INSTANCE = 'instance160005'; 
const ULTRAMSG_TOKEN = 'aephty6m2y29lovb';        

function doPost(e) {
  try {
    let params;
    // Handle both JSON string and pre-parsed objects
    if (e.postData.type === 'application/json') {
      params = JSON.parse(e.postData.contents);
    } else {
      // Fallback for text/plain or other types from fetch()
      params = JSON.parse(e.postData.contents);
    }
    
    const { phone, message } = params;

    if (!phone || !message) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Missing phone or message'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const payload = {
      token: ULTRAMSG_TOKEN,
      to: phone,
      body: message
    };

    const options = {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded', 
      payload: payload,
      muteHttpExceptions: true // Capture errors instead of crashing
    };

    const response = UrlFetchApp.fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, options);
    const result = JSON.parse(response.getContentText());

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
