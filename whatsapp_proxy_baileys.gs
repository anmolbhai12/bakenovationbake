/**
 * WhatsApp OTP Proxy for Bakenovation (Baileys Version)
 * This connects to your self-hosted Baileys WhatsApp bot
 * 
 * SETUP:
 * 1. Deploy your WhatsApp bot to Alwaysdata
 * 2. Update BAILEYS_SERVER_URL below with your server URL
 * 3. Deploy this script as Web App
 */

// UPDATE THIS with your Alwaysdata server URL
const BAILEYS_SERVER_URL = 'https://bakenovation-bot.alwaysdata.net'; 

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
    Logger.log('=== WHATSAPP PROXY REQUEST (BAILEYS) ===');
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

    // Validate and sanitize phone number
    let cleanPhone = phone.replace(/\D/g, ''); // Remove all non-digits
    
    // Remove leading 0 if present
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Add country code if it's a 10-digit number (assuming India)
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    
    // Validate final phone number format
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      Logger.log('ERROR: Invalid phone format after sanitization - ' + cleanPhone);
      return response({ 
        status: 'error', 
        message: 'Invalid phone number format. Expected 10-15 digits, got: ' + phone,
        sanitized: cleanPhone,
        timestamp: startTime.toISOString()
      });
    }
    
    Logger.log('Phone sanitized: ' + phone + ' -> ' + cleanPhone);
    phone = cleanPhone;

    // Prepare request to Baileys server
    const url = `${BAILEYS_SERVER_URL}/send-otp?phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}`;
    
    Logger.log('Calling Baileys server...');
    Logger.log('URL: ' + url);
    
    const options = {
      method: 'get',
      muteHttpExceptions: true,
      followRedirects: true
    };
    
    // Make API call to Baileys server
    const res = UrlFetchApp.fetch(url, options);
    const responseCode = res.getResponseCode();
    const responseText = res.getContentText();
    
    Logger.log('Baileys Response Code: ' + responseCode);
    Logger.log('Baileys Response: ' + responseText);
    
    // Parse response
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      Logger.log('ERROR: Failed to parse Baileys response');
      return response({ 
        status: 'error', 
        message: 'Invalid response from WhatsApp server',
        details: responseText,
        timestamp: startTime.toISOString()
      });
    }

    // Check if Baileys returned an error
    if (responseCode !== 200) {
      Logger.log('ERROR: Baileys server HTTP error - Code: ' + responseCode);
      return response({ 
        status: 'error', 
        message: 'WhatsApp server returned HTTP error ' + responseCode,
        details: result,
        responseCode: responseCode,
        timestamp: startTime.toISOString()
      });
    }
    
    // Check for Baileys-specific errors
    if (result.status === 'error') {
      const errorMsg = result.message || 'Unknown server error';
      Logger.log('ERROR: Baileys server error - ' + errorMsg);
      Logger.log('Full response: ' + JSON.stringify(result));
      
      return response({ 
        status: 'error', 
        message: errorMsg,
        details: result,
        hint: result.hint || 'Check if WhatsApp is connected on the server',
        responseCode: responseCode,
        timestamp: startTime.toISOString()
      });
    }

    // Success
    const endTime = new Date();
    Logger.log('SUCCESS: Message sent in ' + (endTime - startTime) + 'ms');
    
    return response({ 
      status: 'success', 
      data: result.data,
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
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
