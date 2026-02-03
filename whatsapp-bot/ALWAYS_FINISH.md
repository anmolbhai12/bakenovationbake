# 🏁 Final Step: Start Your Bot on Alwaysdata

You have uploaded the files. Now you just need to tell Alwaysdata to "turn it on".

### **1. Open the Alwaysdata Dashboard**
Go to: **Web > Sites** in the left menu.

### **2. Add a New Site**
Click the **"Add a site"** button.

### **3. Configure the Bot**
Fill it out exactly like this:
*   **Name**: `WhatsApp Bot`
*   **Domain**: (Leave as default: `bakenovation-bot.alwaysdata.net`)
*   **Type**: Select **"Node.js"** from the dropdown.
*   **Path**: (Keep as `/`)
*   **Command**: Type: `node www/whatsapp-bot/server.js`
*   **Environment**: Select **"Version 18"** (or 20).
*   **Port**: Type: `3000`

### **4. Save**
Click **"Save"** at the bottom.

---

### **✅ How to Verify**
Open this link in your browser:
**`https://bakenovation-bot.alwaysdata.net/status`**

If it says `{"status":"success","connected":true}`, **CONGRATULATIONS!** 🥳
Your bot is now running 24/7 in the cloud. You can turn off your computer now!

---

### **🔗 Last Thing: Update Google Script**
1. Copy the code from `whatsapp_proxy_baileys.gs` (in your main folder).
2. Go to your **Google Apps Script** project.
3. Paste the code.
4. Update the `BAILEYS_SERVER_URL` at the top to:
   `https://bakenovation-bot.alwaysdata.net`
5. **Deploy** it.

**YOU ARE DONE!** 🚀
