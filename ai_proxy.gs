function doGet(e) {
  try {
    var prompt = e.parameter.prompt;
    if (!prompt) {
      return ContentService.createTextOutput("Missing prompt parameter").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var timeBust = new Date().getTime() + Math.floor(Math.random() * 1000000);
    // Fetch from pollinations
    var targetUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(prompt) + '?width=1024&height=1024&nologo=true&seed=' + timeBust;
    
    var response = UrlFetchApp.fetch(targetUrl);
    var blob = response.getBlob();
    var base64Text = Utilities.base64Encode(blob.getBytes());
    
    // Return Base64 JSON safely
    var jsonMap = { "image_base64": base64Text };
    return ContentService.createTextOutput(JSON.stringify(jsonMap)).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"error": err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
