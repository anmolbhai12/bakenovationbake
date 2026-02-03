const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = true;

    try {
        console.log("🚀 Starting deployment to Alwaysdata...");

        await client.access({
            host: "ftp-bakenovation-bot.alwaysdata.net",
            user: "bakenovation-bot",
            password: "bakenovation",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("✅ Logged into Alwaysdata FTP successfully!");

        const remoteDir = "/www/whatsapp-bot";

        // Items to upload
        const items = ["server.js", "whatsapp.js", "package.json", "auth_info"];

        for (const item of items) {
            const localPath = path.join(__dirname, item);
            if (!fs.existsSync(localPath)) continue;

            const remotePath = `${remoteDir}/${item}`;

            if (fs.lstatSync(localPath).isDirectory()) {
                console.log(`📁 Uploading folder: ${item}...`);
                await client.ensureDir(remotePath);
                await client.uploadFromDir(localPath, remotePath);
            } else {
                console.log(`📄 Uploading file: ${item}...`);
                await client.uploadFrom(localPath, remotePath);
            }
        }

        console.log("\n✨ DEPLOYMENT COMPLETE!");
        console.log("Next step: Follow instructions in ALWAYS_FINISH.md");

    } catch (err) {
        console.error("\n❌ Error:", err);
    } finally {
        client.close();
    }
}

deploy();
