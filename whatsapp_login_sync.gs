// --- THE SELF-HEALING LEGEND SCRIPT (WHATSAPP LOGINS) ---
const SPREADSHEET_ID = '1PYdM-e_UqY2FEse4pCj2cOUNqeOEprNjjpE1GPCCJpU'; 

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    // SELF-HEALING: Use the FIRST tab in the sheet
    const sheet = ss.getSheets()[0]; 
    
    let data = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try { data = Object.assign(data, JSON.parse(e.postData.contents)); } catch (f) {}
    }

    if (Object.keys(data).length === 0) return response("error: no data");

    // DYNAMIC HEADERS
    let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    if (headers[0] === "" || headers.indexOf('timestamp') === -1) {
       sheet.getRange(1, 1).setValue('timestamp');
       headers[0] = 'timestamp';
    }

    const newRow = new Array(headers.length).fill("");
    for (let key in data) {
      let colIdx = headers.indexOf(key);
      if (colIdx === -1) {
        colIdx = headers.length;
        headers.push(key);
        sheet.getRange(1, colIdx + 1).setValue(key);
      }
      newRow[colIdx] = data[key];
    }
    
    sheet.appendRow(newRow);
    return response("success");
    
  } catch (error) {
    return response("error: " + error.toString());
  }
}

function response(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

