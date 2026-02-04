/**
 * Email OTP Proxy for Bakenovation (Signature Edition Redesign)
 */

function doGet(e) { return handleRequest(e); }
function doPost(e) { return handleRequest(e); }

function handleRequest(e) {
  try {
    let data = e.parameter || {};
    
    // Handle POST data if parameter is empty (Power-Sync v3 Compatibility)
    if (Object.keys(data).length === 0 && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (f) {}
    }

    const to = data.to_email || data.email;
    const otp = data.otp_code || data.otp;
    const userName = data.user_name || "Guest";

    if (!to || !otp) {
      return response("error: missing email or otp");
    }

    // FIX: Professional Subject Line
    const subject = `🔐 Bakenovation | Your Secure Code: ${otp}`;
    
    // REDESIGN: Ultra-Premium Luxury Template
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 0; background-color: #0c0410; border: 1px solid #332244; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1a0b1f 0%, #0c0410 100%); padding: 40px 20px; text-align: center; border-bottom: 1px solid #332244;">
           <div style="color: #d4af37; font-size: 28px; font-weight: 300; letter-spacing: 6px; text-transform: uppercase;">
             BAKENOVATION
           </div>
           <div style="color: rgba(212, 175, 55, 0.6); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px;">
             Couture Cakes & Patisserie
           </div>
        </div>

        <!-- Content Area -->
        <div style="padding: 40px 30px; color: #ffffff;">
          <h2 style="font-weight: 400; font-size: 18px; margin-bottom: 20px; color: #d4af37;">Hello ${userName},</h2>
          
          <p style="font-size: 15px; line-height: 1.6; color: rgba(255, 255, 255, 0.8);">
            To verify your identity and access your Bakenovation account, please enter the secure code below.
          </p>

          <!-- OTP Box -->
          <div style="margin: 35px 0; padding: 25px; background: rgba(212, 175, 55, 0.05); border: 1px dashed rgba(212, 175, 55, 0.3); border-radius: 4px; text-align: center;">
            <div style="color: rgba(255, 255, 255, 0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px;">Verification Code</div>
            <div style="font-size: 42px; font-weight: 700; color: #d4af37; letter-spacing: 8px; font-family: Courier, monospace;">
              ${otp}
            </div>
          </div>

          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); line-height: 1.5;">
            * This code will expire in 10 minutes for your security.<br>
            * If you did not initiate this request, please disregard this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #08020a; padding: 25px 20px; text-align: center; font-size: 11px; color: rgba(255, 255, 255, 0.3);">
          <div style="margin-bottom: 10px;">
            <a href="#" style="color: #d4af37; text-decoration: none; margin: 0 10px;">Gallery</a>
            <a href="#" style="color: #d4af37; text-decoration: none; margin: 0 10px;">Atelier</a>
            <a href="#" style="color: #d4af37; text-decoration: none; margin: 0 10px;">Contact</a>
          </div>
          <p>© 2026 Bakenovation Studio. All rights reserved.</p>
          <p style="font-size: 9px; margin-top: 5px;">This is an automated security message. Please do not reply.</p>
        </div>

      </div>
    `;

    // Plain text version as fallback
    const body = `Hello ${userName}!\n\nYour Bakenovation verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nThank you for choosing Bakenovation!`;

    // FIX: Explicitly set the 'name' parameter for the inbox display
    GmailApp.sendEmail(to, subject, body, {
      htmlBody: htmlBody,
      name: "Bakenovation"
    });

    return response("success");
    
  } catch (error) {
    return response("error: " + error.toString());
  }
}

function response(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}
