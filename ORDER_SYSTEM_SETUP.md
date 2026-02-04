# Order Negotiation System - Setup Guide

## 📋 Overview
This system allows you to:
1. Receive orders from your website into a Google Sheet
2. View and manage orders in an admin dashboard
3. Send quotes (price + delivery date) to customers via WhatsApp
4. Automatically send payment QR code when customer confirms
5. Track order status (Pending → Quoted → Paid)

---

## 🚀 Setup Steps

### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new sheet named **"Bakenovation Orders"**
3. Add these headers in Row 1:
   ```
   Timestamp | OrderID | Name | Phone | Email | OrderDetails | Amount | DeliveryDate | Status
   ```

### Step 2: Deploy Google Apps Script
1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Copy the entire content from `order_manager.gs` and paste it
4. Click **Deploy → New deployment**
5. Settings:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and authorize the app
7. **COPY THE DEPLOYMENT URL** - you'll need this!

### Step 3: Update Website Files
1. Open `index.html`
2. Find line 302: `action="YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"`
3. Replace with your actual GAS deployment URL

### Step 4: Update Admin Dashboard
1. Open `admin/index.html`
2. Find line 74: `const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';`
3. Replace with your actual GAS deployment URL

### Step 5: Prepare Payment QR Code
You have two options:

**Option A: Upload QR to Bot Server (Recommended)**
1. Save your payment QR code as `payment_qr.jpg`
2. Upload it to your Alwaysdata server in the `whatsapp-bot` folder
3. Open `whatsapp-bot/whatsapp.js`
4. Find line 98 (the commented section)
5. Uncomment Option 1 and comment out Option 2

**Option B: Use Image URL**
1. Upload your QR code to any image hosting service (Imgur, Google Drive, etc.)
2. Get the direct image URL
3. Open `whatsapp-bot/whatsapp.js`
4. Find line 106: `image: { url: 'YOUR_PAYMENT_QR_IMAGE_URL_HERE' }`
5. Replace with your actual image URL

### Step 6: Deploy Updated Bot
1. Open terminal in `whatsapp-bot` folder
2. Run the deployment script:
   ```bash
   python deploy.py
   ```
   OR if you have Node.js deploy script:
   ```bash
   node deploy.js
   ```
3. Verify deployment at: https://bakenovation-bot.alwaysdata.net/status

### Step 7: Push to GitHub
1. Open terminal in `bakenovation` folder
2. Run:
   ```bash
   git add .
   git commit -m "Implement Order Negotiation & Payment System"
   git push
   ```

---

## 🎯 How to Use

### For Customers:
1. Customer places order on website
2. Receives "Order received!" message with Order ID
3. Waits for your quote via WhatsApp
4. Replies "Yes" to confirm
5. Receives payment QR code automatically
6. Makes payment and sends screenshot

### For You (Admin):
1. Open `admin/index.html` in your browser
2. You'll see all pending orders
3. For each order:
   - Enter the **Amount** (₹)
   - Select **Delivery Date**
   - Click **"Send Quote via WhatsApp"**
4. Customer receives quote on WhatsApp
5. When they reply "Yes", payment QR is sent automatically
6. After receiving payment, click **"Mark as Paid"**

---

## 🔐 Security Note
The admin dashboard (`admin/index.html`) is currently unprotected. To secure it:
1. Don't share the URL publicly
2. Consider adding password protection
3. Or host it on a private server

---

## 🐛 Troubleshooting

**Orders not appearing in Sheet?**
- Check if GAS URL is correct in `index.html`
- Check browser console for errors
- Verify GAS deployment is active

**WhatsApp messages not sending?**
- Check bot status: https://bakenovation-bot.alwaysdata.net/status
- Ensure WhatsApp is connected (scan QR if needed)
- Check bot logs on Alwaysdata

**Payment QR not sending?**
- Verify image URL/path in `whatsapp.js`
- Check if image is publicly accessible
- Review bot console logs

---

## 📞 Support
If you encounter issues, check:
1. Browser console (F12)
2. Google Apps Script logs (View → Logs)
3. Alwaysdata bot logs

---

**System Created**: February 2026
**Version**: 1.0
