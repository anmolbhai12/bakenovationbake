const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

class WhatsAppBot {
    constructor() {
        this.sock = null;
        this.qr = null;
        this.isConnected = false;
        this.authFolder = path.join(__dirname, 'auth_info');
    }

    async initialize() {
        try {
            // Create auth folder if it doesn't exist
            if (!fs.existsSync(this.authFolder)) {
                fs.mkdirSync(this.authFolder, { recursive: true });
            }

            // Load auth state
            const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);

            // Get latest Baileys version
            const { version } = await fetchLatestBaileysVersion();

            // Create socket
            this.sock = makeWASocket({
                version,
                auth: state,
                printQRInTerminal: false, // We'll handle QR ourselves
                logger: pino({ level: 'silent' }), // Reduce logs
                browser: ['Bakenovation OTP', 'Chrome', '1.0.0']
            });

            // Handle connection updates
            this.sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    this.qr = qr;
                    console.log('\n📱 SCAN THIS QR CODE WITH WHATSAPP:\n');
                    qrcode.generate(qr, { small: true });
                    console.log('\n✅ QR Code generated! Scan with WhatsApp to connect.\n');
                }

                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                    console.log('❌ Connection closed. Reconnecting:', shouldReconnect);

                    if (shouldReconnect) {
                        setTimeout(() => this.initialize(), 3000);
                    } else {
                        console.log('🔴 Logged out. Please delete auth_info folder and restart.');
                        this.isConnected = false;
                    }
                } else if (connection === 'open') {
                    console.log('✅ WhatsApp Connected Successfully!');
                    this.isConnected = true;
                    this.qr = null;
                }
            });

            // Save credentials when updated
            this.sock.ev.on('creds.update', saveCreds);

        } catch (error) {
            console.error('❌ Error initializing WhatsApp:', error);
            throw error;
        }
    }

    async sendMessage(phoneNumber, message) {
        try {
            if (!this.isConnected) {
                throw new Error('WhatsApp not connected. Please scan QR code first.');
            }

            // Format phone number (ensure it has @s.whatsapp.net)
            const formattedNumber = phoneNumber.includes('@s.whatsapp.net')
                ? phoneNumber
                : `${phoneNumber}@s.whatsapp.net`;

            // Send message
            const result = await this.sock.sendMessage(formattedNumber, {
                text: message
            });

            console.log(`✅ Message sent to ${phoneNumber}`);
            return {
                success: true,
                messageId: result.key.id,
                timestamp: result.messageTimestamp
            };

        } catch (error) {
            console.error('❌ Error sending message:', error);
            throw error;
        }
    }

    getStatus() {
        return {
            connected: this.isConnected,
            qrCode: this.qr,
            needsQR: !this.isConnected && !this.qr
        };
    }

    async disconnect() {
        if (this.sock) {
            await this.sock.logout();
            this.isConnected = false;
        }
    }
}

module.exports = WhatsAppBot;
