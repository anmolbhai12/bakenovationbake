# Bakenovation Migration Guide (Account Switch)

Follow these steps to migrate your website infrastructure from `japindersinghbhasin@gmail.com` to `bakenovationbake@gmail.com`.

## 1. Transfer the Spreadsheet
1.  Log in to **japindersinghbhasin@gmail.com**.
2.  Find the Google Sheet that contains the tabs **"Orders"** and **"Signups"**. It is likely named something like `Bakenovation Store` or `Orders Spreadsheet`.
    - *Technical Note*: The current sheet ID is `1sOmMpurKA-BAqEaMZK0DjltkM7XHfZLlhpCfEUAaMQI`.
3.  Open the sheet, go to **File** > **Make a copy**.
4.  In the "Sharing" settings of the new copy, click **Share** and add **bakenovationbake@gmail.com** as an **Editor**.
5.  Now, log in to **bakenovationbake@gmail.com**.
6.  Open the shared copy and copy its **new Spreadsheet ID** from the URL.
    *Example: `https://docs.google.com/spreadsheets/d/NEW_ID_HERE/edit`*

## 2. Set Up the Script
1.  In your new Google Sheet, go to **Extensions** > **Apps Script**.
2.  Delete any existing code in the editor (`Code.gs`).
3.  Open the file [unified_manager.gs](file:///c:/Users/DELL/Desktop/bakenovation/unified_manager.gs) on your computer.
4.  Copy the entire content of that file and paste it into the Apps Script editor.
5.  **Critical**: Update the `SPREADSHEET_ID` on line 6 with your new ID from Step 1.
6.  Click the **Save (disk icon)** and name the project `Bakenovation Unified Manager`.

## 3. Deploy the Web App
1.  Click **Deploy** > **New Deployment**.
2.  Select type: **Web App**.
3.  **Description**: `Bakenovation Production V1`
4.  **Execute as**: `Me` (should be bakenovationbake@gmail.com).
5.  **Who has access**: `Anyone`.
6.  Click **Deploy**.
7.  Click **Authorize Access** and follow the prompts (click "Advanced" and "Go to Bakenovation Unified Manager (unsafe)" if needed).
8.  **COPY the Web App URL**. It will look like `https://script.google.com/macros/s/.../exec`.

## 4. Update the Codebase
Once you have the new URL:
1.  Update the `UNIFIED_GAS_URL` in [main.js](file:///c:/Users/DELL/Desktop/bakenovation/sovereign-v36/main.js).
2.  Update the `GAS_URL` in [config.json](file:///c:/Users/DELL/Desktop/bakenovation/whatsapp-bot/config.json).

## 5. Reconnect WhatsApp
1.  Visit [https://bakenovation-bot.alwaysdata.net/status](https://bakenovation-bot.alwaysdata.net/status).
2.  Scan the QR code with your WhatsApp to link the bot.
