/**
 * Google Sheets Sync - Orders Spreadsheet
 * Paste this into a Google Apps Script project (script.google.com)
 * Deploy as a Web App with access 'Anyone'
 */

const SPREADSHEET_ID = 'YOUR_ORDERS_SPREADSHEET_ID'; // Replace with your new Spreadsheet ID
const SHEET_NAME = 'Orders'; 

function doGet(e) {
  return response({ status: 'success', message: 'Order Gateway Active' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
    const newRow = [];
    
    // Add Timestamp
    if (headers.indexOf('Timestamp') === -1) {
      sheet.getRange(1, 1).setValue('Timestamp');
      headers[0] = 'Timestamp';
    }
    
    const timestampIdx = headers.indexOf('Timestamp');
    newRow[timestampIdx] = new Date();
    
    // Map data to headers
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
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
