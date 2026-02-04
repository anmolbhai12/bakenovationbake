/**
 * Email OTP Proxy for Bakenovation (ULTRA-SIGNATURE EDITION V2)
 * 
 * DESIGN FEATURES:
 * - Fixed Subject: "🔐 Bakenovation Studio | Secure Verification Code"
 * - Fixed Sender: "Bakenovation Studio"
 * - Custom Luxury Header & Typography
 */

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    let data = e.parameter || {};
    
    // Support for Power-Sync (Form/Iframe POST)
    if (Object.keys(data).length === 0 && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (f) {
        // Continue with parameter-based data if JSON fails
      }
    }

    const to = data.to_email || data.email;
    const otp = data.otp_code || data.otp;
    const userName = data.user_name || "Valued Customer";

    if (!to || !otp) {
      return response("error: missing email or otp");
    }

    // 1. PROFESSIONAL SUBJECT (No placeholders)
    const subject = `🔐 Bakenovation Studio | Secure Verification Code: ${otp}`;
    
    // 2. ULTRA-PREMIUM REDESIGN
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0c0410;">
        <div style="font-family: 'Garamond', Georgia, serif; max-width: 600px; margin: 40px auto; background-color: #0c0410; border: 1px solid #2d1b33; overflow: hidden;">
          
          <!-- BRAND HEADER -->
          <div style="padding: 60px 40px; text-align: center; background: linear-gradient(180deg, #15081a 0%, #0c0410 100%);">
            <h1 style="color: #d4af37; font-size: 32px; font-weight: 300; letter-spacing: 8px; text-transform: uppercase; margin: 0; padding: 0;">Bakenovation</h1>
            <div style="color: rgba(212, 175, 55, 0.6); font-size: 11px; letter-spacing: 4px; text-transform: uppercase; margin-top: 15px;">Official Signature Verification</div>
          </div>

          <!-- MAIN CONTENT -->
          <div style="padding: 50px 40px; background-color: #0c0410; color: #ffffff; border-top: 1px solid #2d1b33;">
            <p style="font-size: 18px; color: #d4af37; margin-bottom: 30px;">Dear ${userName},</p>
            
            <p style="font-size: 16px; line-height: 1.8; color: #d1ced1; margin-bottom: 40px; font-family: 'Verdana', sans-serif;">
              For your account security, please use the following unique verification code to complete your access to the Atelier.
            </p>

            <!-- OTP DISPLAY -->
            <div style="margin: 40px 0; padding: 40px 20px; background: rgba(212, 175, 55, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 2px; text-align: center;">
              <div style="color: rgba(212, 175, 55, 0.5); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 20px;">Your Secure Code</div>
              <div style="font-size: 48px; font-weight: 700; color: #d4af37; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace;">
                ${otp}
              </div>
            </div>

            <p style="font-size: 13px; color: #5c5561; line-height: 1.6; font-style: italic; margin-top: 40px; font-family: 'Verdana', sans-serif;">
              This code will expire in 10 minutes. If you did not request this, please ignore this communication or contact Bakenovation Studio.
            </p>
          </div>

          <!-- LUXURY FOOTER -->
          <div style="padding: 40px; background-color: #08020a; text-align: center; border-top: 1px solid #1a0b1f;">
            <div style="margin-bottom: 25px;">
              <a href="https://bakenovation.com" style="color: #d4af37; text-decoration: none; margin: 0 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Atelier</a>
              <a href="#" style="color: #d4af37; text-decoration: none; margin: 0 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Gallery</a>
              <a href="#" style="color: #d4af37; text-decoration: none; margin: 0 15px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Support</a>
            </div>
            
            <p style="color: #443c4a; font-size: 11px; letter-spacing: 1px; margin: 0;">© 2026 BAKENOVATION STUDIO. ALL RIGHTS RESERVED.</p>
            <p style="color: #332b38; font-size: 9px; margin-top: 10px; text-transform: uppercase;">Handcrafted with precision and passion.</p>
          </div>

        </div>
      </body>
      </html>
    `;

    // 3. SEND EMAIL WITH AUTHENTIC SENDER NAME
    GmailApp.sendEmail(to, subject, "", {
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
