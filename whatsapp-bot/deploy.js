const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

async function deploy() {
    const client = new ftp.Client();
    client.ftp.verbose = false; // Hide messy logs, we will show our own

    try {
        console.log("🚀 Starting STABLE deployment to Alwaysdata...");

        await client.access({
            host: "ftp-bakenovation-bot.alwaysdata.net",
            user: "bakenovation-bot",
            password: "bakenovation",
            secure: true,
            secureOptions: { rejectUnauthorized: false }
        });

        console.log("✅ Connection established!");

        const remoteDir = "/www/whatsapp-bot";
        await client.ensureDir(remoteDir);

        // QUICK FIX: Only upload code files
        const items = ["server.js", "whatsapp.js", "package.json"];

        for (const item of items) {
            const localPath = path.join(__dirname, item);
            if (!fs.existsSync(localPath)) continue;

            const remotePath = `${remoteDir}/${item}`;
            let retries = 3;

            while (retries > 0) {
                try {
                    if (fs.lstatSync(localPath).isDirectory()) {
                        console.log(`📁 Uploading folder: ${item}...`);
                        await client.uploadFromDir(localPath, remotePath);
                    } else {
                        console.log(`📄 Uploading file: ${item}...`);
                        await client.uploadFrom(localPath, remotePath);
                    }
                    console.log(`✔️  ${item} uploaded!`);
                    break; // Success!
                } catch (err) {
                    retries--;
                    console.log(`⚠️  Retry ${3 - retries}/3 for ${item}...`);
                    if (retries === 0) throw err;
                    await new Promise(r => setTimeout(r, 2000)); // Wait 2s
                }
            }
        }

        console.log("\n✨ EVERYTHING UPLOADED SUCCESSFULLY!");
        console.log("Now go to https://bakenovation-bot.alwaysdata.net/status");

    } catch (err) {
        console.error("\n❌ Fatal Error:", err.message);
        console.log("💡 Tip: If it still fails, just try running the command again!");
    } finally {
        client.close();
    }
}

deploy();
