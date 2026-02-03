/**
 * WhatsApp OTP Proxy for Bakenovation
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone' (even anonymous)
 * 
 * IMPORTANT: After updating, redeploy as Web App with:
 * - Execute as: Me
 * - Who has access: Anyone
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
  const startTime = new Date();
  
  try {
    // Extract parameters
    let phone = e.parameter.phone || (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).phone : null);
    let message = e.parameter.message || (e.postData && e.postData.contents ? JSON.parse(e.postData.contents).message : null);

    // Log incoming request
    Logger.log('=== WHATSAPP PROXY REQUEST ===');
    Logger.log('Phone: ' + phone);
    Logger.log('Message Length: ' + (message ? message.length : 0));
    Logger.log('Request Time: ' + startTime.toISOString());

    // Validate parameters
    if (!phone || !message) {
      Logger.log('ERROR: Missing parameters');
      return response({ 
        status: 'error', 
        message: 'Missing required parameters (phone or message)',
        timestamp: startTime.toISOString()
      });
    }

    // Validate phone number format
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      Logger.log('ERROR: Invalid phone format - ' + phone);
      return response({ 
        status: 'error', 
        message: 'Invalid phone number format. Expected 10-15 digits, got: ' + phone,
        timestamp: startTime.toISOString()
      });
    }

    // Prepare Ultramsg API call
    const url = `https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`;
    const payload = {
      token: ULTRAMSG_TOKEN,
      to: phone,
      body: message
    };
    
    Logger.log('Calling Ultramsg API...');
    Logger.log('URL: ' + url);
    Logger.log('To: ' + phone);
    
    const options = {
      method: 'post',
      contentType: 'application/x-www-form-urlencoded',
      payload: payload,
      muteHttpExceptions: true
    };
    
    // Make API call
    const res = UrlFetchApp.fetch(url, options);
    const responseCode = res.getResponseCode();
    const responseText = res.getContentText();
    
    Logger.log('Ultramsg Response Code: ' + responseCode);
    Logger.log('Ultramsg Response: ' + responseText);
    
    // Parse response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      Logger.log('ERROR: Failed to parse Ultramsg response');
      return response({ 
        status: 'error', 
        message: 'Invalid response from WhatsApp API',
        details: responseText,
        timestamp: startTime.toISOString()
      });
    }

    // Check if Ultramsg returned an error
    if (responseCode !== 200 || result.error) {
      Logger.log('ERROR: Ultramsg API error - ' + JSON.stringify(result));
      return response({ 
        status: 'error', 
        message: result.error || 'WhatsApp API returned an error',
        details: result,
        responseCode: responseCode,
        timestamp: startTime.toISOString()
      });
    }

    // Success
    const endTime = new Date();
    Logger.log('SUCCESS: Message sent in ' + (endTime - startTime) + 'ms');
    
    return response({ 
      status: 'success', 
      data: result,
      phone: phone,
      duration: (endTime - startTime),
      timestamp: startTime.toISOString()
    });

  } catch (error) {
    Logger.log('CRITICAL ERROR: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    
    return response({ 
      status: 'error', 
      message: error.toString(),
      stack: error.stack,
      timestamp: startTime.toISOString()
    });
  }
}

function response(obj) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers to allow browser to read response
  return output;
}
