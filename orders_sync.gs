// --- THE SELF-HEALING LEGEND SCRIPT (ORDERS) ---
const SPREADSHEET_ID = '1sOmMpurKA-BAqEaMZK0DjltkM7XHfZLlhpCfEUAaMQI'; 

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    // SELF-HEALING: Use the FIRST tab in the sheet, regardless of its name
    const sheet = ss.getSheets()[0]; 
    
    let data = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try { data = Object.assign(data, JSON.parse(e.postData.contents)); } catch (f) {}
    }

    if (Object.keys(data).length === 0) return response("error: no data");

    // 2. Manage Headers (Dynamic & Zero-Fail)
    let headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    
    // If sheet is totally blank, start properly
    if (headers.length === 1 && headers[0] === "") {
      headers = ['timestamp'];
      sheet.getRange(1, 1).setValue('timestamp');
    }

    let timestampCol = headers.indexOf('timestamp');
    if (timestampCol === -1) {
       timestampCol = headers.length;
       headers.push('timestamp');
       sheet.getRange(1, timestampCol + 1).setValue('timestamp');
    }

    const newRow = new Array(headers.length).fill("");
    newRow[timestampCol] = new Date();
    
    // 3. Map all other data
    for (let key in data) {
      if (key === 'timestamp') continue;
      let colIdx = headers.indexOf(key);
      if (colIdx === -1) {
        colIdx = headers.length;
        headers.push(key);
        sheet.getRange(1, colIdx + 1).setValue(key);
        newRow.push(data[key]);
      } else {
        newRow[colIdx] = data[key];
      }
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

