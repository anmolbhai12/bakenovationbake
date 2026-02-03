# Complete Setup Guide - Free WhatsApp OTP System

## 📋 Overview

This guide will help you set up a **100% free WhatsApp OTP system** using:
1. **Baileys** - Free WhatsApp library
2. **Node.js Server** - Runs on your computer or Alwaysdata
3. **Google Apps Script** - Connects your website to the server

---

## Part 1: Install Node.js

### Step 1: Download Node.js

1. Go to: **https://nodejs.org**
2. Click **Download** for the **LTS version** (v18 or higher)
3. Run the installer
4. **IMPORTANT:** During installation, check "Add to PATH"
5. Click "Next" through all steps
6. Click "Install"

### Step 2: Verify Installation

1. Open **Command Prompt** (search "cmd" in Windows)
2. Type: `node --version`
3. You should see: `v18.x.x` or similar
4. Type: `npm --version`
5. You should see: `9.x.x` or similar

✅ **If you see version numbers, Node.js is installed!**

---

## Part 2: Set Up WhatsApp Bot (Local Testing)

### Step 1: Install Dependencies

1. Open **Command Prompt**
2. Navigate to the bot folder:
   ```
   cd c:\Users\DELL\Desktop\bakenovation\whatsapp-bot
   ```
3. Install packages:
   ```
   npm install
   ```
4. Wait for installation to complete (2-3 minutes)

### Step 2: Start the Bot

1. In the same Command Prompt, type:
   ```
   npm start
   ```
2. You'll see:
   ```
   🚀 Starting WhatsApp Bot...
   ✅ Server running on port 3000
   📱 SCAN THIS QR CODE WITH WHATSAPP:
   ```

### Step 3: Scan QR Code

1. **Option A (Terminal):** A QR code will appear in the terminal.
2. **Option B (Browser - Recommended):** Open your browser and go to: `http://localhost:3000/status`
   - This will show a clear QR code that is much easier to scan.
3. Open **WhatsApp** on your phone.
4. Go to: **Settings → Linked Devices → Link a Device**
5. Scan the QR code from the terminal or browser.
6. Wait for: `✅ WhatsApp Connected Successfully!`

### Step 4: Test Locally

1. Open your browser
2. Go to: `http://localhost:3000/status`
3. You should see:
   ```json
   {
     "status": "success",
     "connected": true
   }
   ```

4. Test sending a message:
   ```
   http://localhost:3000/send-otp?phone=YOUR_PHONE_NUMBER&message=Test%20OTP:%20123456
   ```
   Replace `YOUR_PHONE_NUMBER` with your number (e.g., `919876543210`)

5. Check your WhatsApp - you should receive the message!

✅ **If you received the message, the bot works!**

---

## Part 3: Deploy to Alwaysdata (Optional - For 24/7 Operation)

### Option A: Keep Running on Your Computer

**Pros:**
- ✅ Free
- ✅ Easy
- ✅ Works immediately

**Cons:**
- ❌ Computer must stay on 24/7
- ❌ Bot stops if computer restarts

**To use this option:**
- Just keep the Command Prompt window open
- Don't close it
- Bot will work as long as it's running

---

### Option B: Deploy to Alwaysdata (Recommended)

**Pros:**
- ✅ Runs 24/7
- ✅ No need to keep computer on
- ✅ More reliable

**Cons:**
- ⚠️ Requires some setup

### Step 1: Prepare Files for Upload

1. In the `whatsapp-bot` folder, you need to upload:
   - `server.js`
   - `whatsapp.js`
   - `package.json`
   - `.gitignore`

2. **DO NOT upload:**
   - `node_modules/` folder
   - `auth_info/` folder (will be created on server)

### Step 2: Upload to Alwaysdata

1. Go to: **https://www.alwaysdata.com**
2. Login to your account
3. Go to **SSH/FTP** section
4. Note your FTP credentials

5. Use an FTP client (like FileZilla) or SSH to upload files:
   - Host: `ssh-YOUR_USERNAME.alwaysdata.net`
   - Username: Your Alwaysdata username
   - Password: Your Alwaysdata password

6. Upload all files to a folder (e.g., `/whatsapp-bot/`)

### Step 3: Install Dependencies on Server

1. Connect via SSH:
   ```
   ssh YOUR_USERNAME@ssh-YOUR_USERNAME.alwaysdata.net
   ```

2. Navigate to your folder:
   ```
   cd whatsapp-bot
   ```

3. Install dependencies:
   ```
   npm install --production
   ```

### Step 4: Configure Node.js App in Alwaysdata

1. Go to Alwaysdata dashboard
2. Click **Web → Sites**
3. Click **Add a site**
4. Choose **Node.js**
5. Settings:
   - **Type:** Node.js
   - **Path:** `/whatsapp-bot`
   - **Command:** `node server.js`
   - **Port:** `3000`
6. Click **Save**
7. Start the application

### Step 5: Scan QR Code on Server

1. View the application logs in Alwaysdata dashboard
2. You'll see the QR code URL or ASCII QR code
3. Scan it with WhatsApp
4. Wait for connection confirmation

✅ **Your bot is now running 24/7 on Alwaysdata!**

---

## Part 4: Update Google Apps Script

### Step 1: Get Your Server URL

**If running locally:**
- URL: `http://localhost:3000`
- **Note:** This only works on your computer

**If running on Alwaysdata:**
- URL: `https://YOUR_USERNAME.alwaysdata.net`
- Replace `YOUR_USERNAME` with your actual Alwaysdata username

### Step 2: Update the Proxy Script

1. Open: `whatsapp_proxy_baileys.gs`
2. Find this line:
   ```javascript
   const BAILEYS_SERVER_URL = 'https://your-username.alwaysdata.net';
   ```
3. Replace with your actual URL:
   ```javascript
   const BAILEYS_SERVER_URL = 'https://YOUR_USERNAME.alwaysdata.net';
   ```
4. Save the file

### Step 3: Deploy to Google Apps Script

1. Go to: **https://script.google.com**
2. Open your existing WhatsApp proxy project (or create new one)
3. Delete all existing code
4. Copy all code from `whatsapp_proxy_baileys.gs`
5. Paste into Google Apps Script editor
6. Click **Save** (💾)

7. Click **Deploy → Manage deployments**
8. Click **Edit** (✏️) next to your deployment
9. Select **New version**
10. Click **Deploy**
11. Copy the deployment URL

### Step 4: Update Website (if needed)

If you created a NEW Google Apps Script project, update `main.js`:

1. Open: `c:\Users\DELL\Desktop\bakenovation\js\main.js`
2. Find line ~104:
   ```javascript
   const WHATSAPP_PROXY_URL = 'https://script.google.com/macros/s/...';
   ```
3. Replace with your new deployment URL
4. Save the file

---

## Part 5: Test Everything

### Step 1: Test the Full Flow

1. Open your Bakenovation website
2. Click **Login**
3. Click **"Login with WhatsApp instead"**
4. Enter your phone number
5. Click **"Send Code"**
6. Check your WhatsApp

✅ **You should receive the OTP message!**

### Step 2: Check Logs

**Bot Server Logs:**
- If local: Check Command Prompt window
- If Alwaysdata: Check application logs in dashboard

**Google Apps Script Logs:**
- Go to script.google.com
- Click **Executions** (⚡)
- View recent executions

**Browser Console:**
- Press F12
- Go to Console tab
- Look for success/error messages

---

## 🎉 You're Done!

Your **FREE WhatsApp OTP system** is now live!

### What You Have:
- ✅ Unlimited free WhatsApp OTP messages
- ✅ No monthly fees
- ✅ No API limits
- ✅ Runs 24/7 (if on Alwaysdata)

### Costs:
- **Baileys:** FREE
- **Node.js:** FREE
- **Alwaysdata:** FREE (100MB plan)
- **Google Apps Script:** FREE
- **Total:** **₹0 / $0 FOREVER**

---

## 🆘 Troubleshooting

### Bot Won't Start

**Error:** `npm: command not found`
- **Solution:** Install Node.js (Part 1)

**Error:** `Cannot find module`
- **Solution:** Run `npm install` again

### QR Code Not Showing

**Problem:** No QR code appears
- **Solution:** Delete `auth_info` folder and restart

### WhatsApp Not Connected

**Problem:** `/status` shows `connected: false`
- **Solution:** Scan QR code again

### OTP Not Received

**Problem:** No WhatsApp message
- **Solution:** 
  1. Check `/status` - is bot connected?
  2. Check phone number format
  3. Check server logs for errors

---

## 📞 Need Help?

1. Check server logs
2. Check Google Apps Script execution logs
3. Check browser console (F12)
4. Review the README.md in whatsapp-bot folder

---

**Enjoy your free WhatsApp OTP system!** 🚀
