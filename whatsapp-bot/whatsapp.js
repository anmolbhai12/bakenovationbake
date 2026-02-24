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

            // Load config
            const configPath = path.join(__dirname, 'config.json');
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

            // Listen for incoming messages (for customer negotiation)
            this.sock.ev.on('messages.upsert', async ({ messages }) => {
                for (const msg of messages) {
                    if (!msg.message || msg.key.fromMe) continue;

                    const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').toLowerCase().trim();
                    const sender = msg.key.remoteJid;
                    const phone = sender.split('@')[0];

                    console.log(`📩 Message from ${sender}: ${text}`);

                    // 1. Handle Global "Help" Command
                    if (text === 'help') {
                        await this.sock.sendMessage(sender, {
                            text: `🆘 *Support Center*\n\nIf you need any assistance or have an urgent request, please contact us at:\n📞 ${config.HELP_NUMBER}`
                        });
                        continue;
                    }

                    // 2. Fetch Order Context from GAS
                    try {
                        const gasRes = await fetch(`${config.GAS_URL}?action=get_order&phone=${phone}`);
                        const gasData = await gasRes.json();

                        if (gasData.status !== 'success' || !gasData.order) continue;

                        const order = gasData.order;
                        const currentState = order.botstate || 'START';

                        // 3. State Machine Logic

                        // Action: CONFIRM
                        if (['confirm', 'yes', 'correct'].includes(text) && currentState === 'AWAITING_CONFIRMATION') {
                            const nextMsg = `✅ *Details Confirmed!*\n\n` +
                                `📅 *Delivery Date:* ${order.deliverydate}\n` +
                                `⏰ *Delivery Time:* ${order.deliverytime}\n` +
                                `💰 *Total Amount:* ₹${order.amount}\n\n` +
                                `Reply *Continue* to see payment options and finalize your order.`;

                            await this.updateGAS(config.GAS_URL, { action: 'update_order', phone, botState: 'AWAITING_PAYMENT' });
                            await this.sock.sendMessage(sender, { text: nextMsg });
                        }

                        // Action: CONTINUE
                        else if (['continue', 'pay', 'proceed'].includes(text) && currentState === 'AWAITING_PAYMENT') {
                            const paymentMsg = `💳 *Payment Instructions* 💳\n\n` +
                                `Please scan the QR code below to pay ₹${order.amount}.\n\n` +
                                `⚠️ *Important:* After paying, please send a *screenshot* of the success screen here for verification.\n\n` +
                                `Once verified, we will start preparing your masterpiece! 🎂`;

                            await this.updateGAS(config.GAS_URL, { action: 'update_order', phone, botState: 'PAYMENT_PENDING' });
                            await this.sock.sendMessage(sender, { text: paymentMsg });

                            const qrImagePath = path.join(__dirname, 'payment_qr.png');
                            if (fs.existsSync(qrImagePath)) {
                                await this.sock.sendMessage(sender, {
                                    image: fs.readFileSync(qrImagePath),
                                    caption: 'Scan to Pay - Bakenovation Studio'
                                });
                            }

                            // Notify Admin
                            if (config.ADMIN_NUMBER && config.ADMIN_NUMBER !== '+91XXXXXXXXXX') {
                                const adminMsg = `🔔 *ORDER UPDATE*\n\nClient ${order.name} (${phone}) has moved to *Payment* for order ${order.orderid}.`;
                                await this.sendMessage(config.ADMIN_NUMBER, adminMsg);
                            }
                        }

                        // Interaction: SCREENSHOT DETECTED
                        else if (msg.message.imageMessage && currentState === 'PAYMENT_PENDING') {
                            await this.sock.sendMessage(sender, { text: `✅ *Image Received!*\n\nWe are verifying your payment now. You will receive a final confirmation shortly! ✨` });

                            if (config.ADMIN_NUMBER && config.ADMIN_NUMBER !== '+91XXXXXXXXXX') {
                                const adminMsg = `💰 *PAYMENT SCREENSHOT RECEIVED*\n\nOrder ID: ${order.orderid}\nClient: ${order.name}\n\nPlease check your bank and mark as *Paid* in the Console.`;
                                await this.sendMessage(config.ADMIN_NUMBER, adminMsg);
                            }
                        }

                    } catch (e) {
                        console.error('Bot Intelligence Failure:', e);
                    }
                }
            });


        } catch (error) {
            console.error('❌ Error initializing WhatsApp:', error);
            throw error;
        }
    }

    async updateGAS(url, payload) {
        try {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            console.log(`📡 GAS Updated: ${payload.action} for ${payload.phone}`);
        } catch (error) {
            console.error('❌ GAS Sync Error:', error);
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
