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

    // Direct URL-based trigger for Ultramsg (Most reliable method)
    const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat?token=${ULTRAMSG_TOKEN}&to=${phone}&body=${encodeURIComponent(message)}`;
    
    const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
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
