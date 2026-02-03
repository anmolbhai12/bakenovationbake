# Bakenovation WhatsApp OTP Bot

## 🎉 100% FREE WhatsApp OTP System

This bot uses **Baileys** (open-source WhatsApp Web library) to send OTP messages for free, forever!

---

## 📋 Prerequisites

Before you start, you need to install **Node.js**:

### Install Node.js

1. **Download Node.js**
   - Go to: https://nodejs.org
   - Download the **LTS version** (v18 or higher)
   - Run the installer
   - Click "Next" through all steps
   - **Important:** Check "Add to PATH" during installation

2. **Verify Installation**
   - Open Command Prompt (cmd)
   - Type: `node --version`
   - You should see: `v18.x.x` or higher
   - Type: `npm --version`
   - You should see: `9.x.x` or higher

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd c:\Users\DELL\Desktop\bakenovation\whatsapp-bot
npm install
```

This will install:
- Baileys (WhatsApp library)
- Express (Web server)
- Other required packages

### Step 2: Start the Bot

```bash
npm start
```

### Step 3: Scan QR Code

1. **Option A (Terminal):** The terminal will show a QR code.
2. **Option B (Browser - Better!):** Open your browser and go to: `http://localhost:3000/status`
   - This will show a clean, scan-ready QR code in your browser.
3. Open WhatsApp on your phone.
4. Go to: **Settings → Linked Devices → Link a Device**
5. Scan the QR code shown.
6. Wait for "✅ WhatsApp Connected Successfully!"

### Step 4: Test It

Open your browser and go to:
```
http://localhost:3000/status
```

You should see:
```json
{
  "status": "success",
  "connected": true,
  "message": "WhatsApp is connected"
}
```

---

## 📡 API Endpoints

### 1. Health Check
```
GET http://localhost:3000/
```

### 2. Get Status & QR Code
```
GET http://localhost:3000/status
```

### 3. Send OTP (POST)
```
POST http://localhost:3000/send-otp
Content-Type: application/json

{
  "phone": "919876543210",
  "message": "Your OTP is: 123456"
}
```

### 4. Send OTP (GET)
```
GET http://localhost:3000/send-otp?phone=919876543210&message=Your%20OTP%20is%20123456
```

---

## 🌐 Deploy to Alwaysdata

### Step 1: Upload Files

1. Connect to Alwaysdata via FTP/SSH
2. Upload all files to your account
3. Install dependencies on server:
   ```bash
   npm install --production
   ```

### Step 2: Configure Node.js App

1. Go to Alwaysdata dashboard
2. Create a new **Node.js** application
3. Set entry point: `server.js`
4. Set port: `3000`
5. Start the application

### Step 3: Scan QR Code on Server

1. View server logs
2. Copy the QR code URL or use SSH to see QR
3. Scan with WhatsApp
4. Bot is now live!

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
NODE_ENV=production
```

### Rate Limiting

Default: 10 messages per minute per IP

To change, edit `server.js`:
```javascript
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10  // Change this number
});
```

---

## 🐛 Troubleshooting

### QR Code Not Showing

**Problem:** No QR code appears

**Solution:**
- Make sure WhatsApp is not already linked on 4 devices (max limit)
- Delete `auth_info` folder and restart
- Check internet connection

### "WhatsApp not connected"

**Problem:** API returns error

**Solution:**
- Check `/status` endpoint
- Scan QR code if needed
- Restart the server

### Connection Keeps Dropping

**Problem:** Bot disconnects frequently

**Solution:**
- Check internet stability
- Don't use WhatsApp Web on browser simultaneously
- Keep server running 24/7

### "Too many requests"

**Problem:** Rate limit exceeded

**Solution:**
- Wait 1 minute
- Reduce OTP sending frequency
- Increase rate limit in `server.js`

---

## 📁 Project Structure

```
whatsapp-bot/
├── server.js          # Express API server
├── whatsapp.js        # Baileys WhatsApp handler
├── package.json       # Dependencies
├── .gitignore         # Ignore sensitive files
├── auth_info/         # WhatsApp session (auto-created)
└── README.md          # This file
```

---

## 🔒 Security

### Important Notes

- **Never share `auth_info` folder** - Contains your WhatsApp session
- **Never commit to GitHub** - Already in `.gitignore`
- **Use rate limiting** - Prevents spam and bans
- **Monitor usage** - Check logs regularly

### WhatsApp Ban Risk

**Low risk if you:**
- ✅ Send < 100 messages per day
- ✅ Use rate limiting
- ✅ Don't spam
- ✅ Use for legitimate OTP only

**High risk if you:**
- ❌ Send 1000+ messages per day
- ❌ Send to random numbers
- ❌ Send spam/marketing messages

---

## 💰 Cost

| Item | Cost |
|------|------|
| Baileys Library | FREE |
| Node.js | FREE |
| Alwaysdata Hosting | FREE (100MB plan) |
| WhatsApp Number | FREE (your number) |
| **TOTAL** | **₹0 / $0 FOREVER** ✅ |

---

## 📞 Support

If you need help:
1. Check the troubleshooting section
2. View server logs for errors
3. Check Baileys documentation: https://github.com/WhiskeySockets/Baileys

---

## ⚖️ Legal

- This uses WhatsApp Web, which is technically against WhatsApp's ToS for automation
- Use at your own risk
- For personal/small business use only
- Not recommended for large-scale operations

---

## 🎉 You're All Set!

Your free WhatsApp OTP system is ready to use!

**Next Steps:**
1. Install Node.js (if not installed)
2. Run `npm install`
3. Run `npm start`
4. Scan QR code
5. Test with `/send-otp` endpoint
6. Deploy to Alwaysdata
7. Update Google Apps Script
8. Enjoy unlimited free OTP! 🚀
