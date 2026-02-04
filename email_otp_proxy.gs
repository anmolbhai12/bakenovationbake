/**
 * Email OTP Proxy for Bakenovation
 * 
 * SETUP:
 * 1. Open script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Click 'Deploy' -> 'New Deployment'
 * 5. Select 'Web App'
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy the Web App URL and paste it into js/app.js as EMAIL_PROXY_URL
 */

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    let data = e.parameter || {};
    
    // Handle POST data if parameter is empty
    if (Object.keys(data).length === 0 && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (f) {
        // Fallback or ignore
      }
    }

    const to = data.to_email || data.email;
    const otp = data.otp_code || data.otp;
    const userName = data.user_name || "Valued Customer";

    if (!to || !otp) {
      return response("error: missing email or otp");
    }

    const subject = "Bakenovation - Verification Code";
    const body = `Hello ${userName}!\n\nYour security code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nThank you for choosing Bakenovation!`;
    
    // HTML version for a better look
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #d4af37; border-radius: 10px; background-color: #0c0410; color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
           <h1 style="color: #d4af37; margin: 0; font-family: 'Playfair Display', serif;">Bakenovation</h1>
           <p style="color: #d4af37; font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase;">Couture Cakes</p>
        </div>
        <p>Hello <strong>${userName}</strong>!</p>
        <p>To ensure your account security, please use the following verification code:</p>
        <div style="font-size: 32px; font-weight: bold; padding: 20px; background-color: rgba(212, 175, 55, 0.1); text-align: center; border: 1px dashed #d4af37; border-radius: 8px; color: #d4af37; margin: 25px 0;">
          ${otp}
        </div>
        <p style="font-size: 0.9rem; color: #aaaaaa;">This code is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 30px 0;">
        <div style="text-align: center; font-size: 0.8rem; color: #777777;">
          <p>© 2026 Bakenovation Studio. All rights reserved.</p>
        </div>
      </div>
    `;

    GmailApp.sendEmail(to, subject, body, {
      htmlBody: htmlBody,
      name: "Bakenovation Studio"
    });

    return response("success");
    
  } catch (error) {
    return response("error: " + error.toString());
  }
}

function response(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
