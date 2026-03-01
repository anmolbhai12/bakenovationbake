function doGet(e) {
  try {
    var prompt = e.parameter.prompt;
    if (!prompt) {
      return ContentService.createTextOutput(JSON.stringify({"error": "Missing prompt parameter"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Fallback Engine List
    // 1. api.airforce (Highly reliable FLUX model, allows Google IPs)
    // 2. image.pollinations.ai (Currently throwing 530 Cloudflare errors from Google IPs, but kept as backup)
    var engines = [
      'https://api.airforce/v1/imagine2?model=flux&prompt=',
      'https://image.pollinations.ai/prompt/'
    ];

    for (var i = 0; i < engines.length; i++) {
        try {
            var timeBust = new Date().getTime() + Math.random().toString().substring(2,8);
            var targetUrl = engines[i] + encodeURIComponent(prompt) + (i === 1 ? ('?width=1024&height=1024&nologo=true&seed=' + timeBust) : '');
            
            var options = {
                'muteHttpExceptions': true,
                'followRedirects': true
            };
            
            var response = UrlFetchApp.fetch(targetUrl, options);
            var code = response.getResponseCode();
            
            if (code === 200 || code === 301 || code === 302 || code === 308) {
                var blob = response.getBlob();
                
                // Validate that we actually got an image back, not an HTML error page
                var contentType = blob.getContentType();
                if (contentType && contentType.indexOf('image') !== -1) {
                     var base64Text = Utilities.base64Encode(blob.getBytes());
                     return ContentService.createTextOutput(JSON.stringify({ 
                         "image_base64": base64Text, 
                         "engine": i 
                     })).setMimeType(ContentService.MimeType.JSON);
                }
            }
        } catch(e) {
            // Move to next engine silently
        }
    }
    
    return ContentService.createTextOutput(JSON.stringify({"error": "All Proxy Backend Engines Failed"})).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"error": err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
