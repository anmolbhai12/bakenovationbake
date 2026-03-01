function doGet(e) {
  try {
    var prompt = e.parameter.prompt;
    if (!prompt) {
      return ContentService.createTextOutput(JSON.stringify({"error": "Missing prompt parameter"})).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Aggressive Browser Spoofing Headers to bypass Cloudflare/Bot-Protection on the backend
    var headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1'
    };

    var engines = [
      'https://api.airforce/v1/imagine2?model=flux&prompt=',
      'https://image.pollinations.ai/prompt/'
    ];

    var lastError = "No engines attempted";

    for (var i = 0; i < engines.length; i++) {
        try {
            var timeBust = new Date().getTime() + Math.random().toString().substring(2,8);
            var targetUrl = engines[i] + encodeURIComponent(prompt) + (i === 1 ? ('?width=1024&height=1024&nologo=true&seed=' + timeBust) : '');
            
            var options = {
                'method': 'get',
                'headers': headers,
                'muteHttpExceptions': true,
                'followRedirects': true,
                'validateHttpsCertificates': false
            };
            
            var response = UrlFetchApp.fetch(targetUrl, options);
            var code = response.getResponseCode();
            
            if (code >= 200 && code < 400) {
                var blob = response.getBlob();
                var contentType = blob.getContentType();
                
                // If it successfully returns an image blob
                if (contentType && contentType.indexOf('image') !== -1) {
                     var base64Text = Utilities.base64Encode(blob.getBytes());
                     return ContentService.createTextOutput(JSON.stringify({ 
                         "image_base64": base64Text, 
                         "engine": "engine_" + i + "_success",
                         "status": code,
                         "resolved_url": targetUrl
                     })).setMimeType(ContentService.MimeType.JSON);
                } else {
                     lastError = "Engine " + i + " returned HTML/JSON instead of Image (Code " + code + "): " + response.getContentText().substring(0, 100);
                }
            } else {
                lastError = "Engine " + i + " blocked with Code " + code + ". Content: " + response.getContentText().substring(0, 50);
            }
        } catch(e) {
            lastError = "Engine " + i + " threw exception: " + e.toString();
        }
    }
    
    // If we reach here, all engines failed. Return the detailed debug logs
    return ContentService.createTextOutput(JSON.stringify({
        "error": "All Proxy Backend Engines Failed",
        "debug_log": lastError
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({"error": "Global execution error: " + err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
