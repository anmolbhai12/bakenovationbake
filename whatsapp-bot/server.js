const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const QRCode = require('qrcode');
const WhatsAppBot = require('./whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - prevent spam
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
    message: {
        status: 'error',
        message: 'Too many requests. Please try again later.'
    }
});

app.use('/send-otp', limiter);

// Initialize WhatsApp bot
const bot = new WhatsAppBot();
let initializationPromise = null;

// Start bot initialization
console.log('🚀 Starting WhatsApp Bot...');
initializationPromise = bot.initialize().catch(err => {
    console.error('Failed to initialize bot:', err);
});

// Routes

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'Bakenovation WhatsApp OTP Bot',
        version: '1.0.0'
    });
});

// Get bot status and QR code
app.get('/status', async (req, res) => {
    const status = bot.getStatus();

    // If not connected and QR is available, show as HTML page
    if (!status.connected && status.qrCode) {
        try {
            const qrImage = await QRCode.toDataURL(status.qrCode);
            return res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>WhatsApp QR Code</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5; }
                        .card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
                        img { margin-top: 1rem; max-width: 100%; }
                        h1 { color: #128c7e; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h1>Bakenovation WhatsApp Bot</h1>
                        <p>Scan this QR code with WhatsApp to connect:</p>
                        <img src="${qrImage}" alt="QR Code" />
                        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">Settings > Linked Devices > Link a Device</p>
                    </div>
                    <script>
                        // Auto-reload to check if connected periodically
                        setTimeout(() => location.reload(), 5000);
                    </script>
                </body>
                </html>
            `);
        } catch (err) {
            console.error('Error generating QR image:', err);
        }
    }

    res.json({
        status: 'success',
        ...status,
        message: status.connected
            ? 'WhatsApp is connected'
            : status.qrCode
                ? 'Please scan QR code at this URL in a browser'
                : 'Connecting to WhatsApp...'
    });
});

// Send OTP message
app.post('/send-otp', async (req, res) => {
    try {
        const { phone, message } = req.body;

        // Validate input
        if (!phone || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: phone and message'
            });
        }

        // Check if bot is connected
        if (!bot.isConnected) {
            return res.status(503).json({
                status: 'error',
                message: 'WhatsApp not connected. Please scan QR code first.',
                hint: 'Visit /status to get QR code'
            });
        }

        // Send message
        const result = await bot.sendMessage(phone, message);

        res.json({
            status: 'success',
            data: result,
            phone: phone,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in /send-otp:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to send message',
            hint: 'Check if WhatsApp is connected and phone number is valid'
        });
    }
});

// GET endpoint for compatibility with Google Apps Script
app.get('/send-otp', async (req, res) => {
    try {
        const { phone, message } = req.query;

        if (!phone || !message) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required parameters: phone and message'
            });
        }

        if (!bot.isConnected) {
            return res.status(503).json({
                status: 'error',
                message: 'WhatsApp not connected. Please scan QR code first.',
                hint: 'Visit /status to get QR code'
            });
        }

        const result = await bot.sendMessage(phone, message);

        res.json({
            status: 'success',
            data: result,
            phone: phone,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error in /send-otp:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to send message'
        });
    }
});

// Disconnect endpoint (for maintenance)
app.post('/disconnect', async (req, res) => {
    try {
        await bot.disconnect();
        res.json({
            status: 'success',
            message: 'WhatsApp disconnected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error',
        stack: err.stack // Help us debug during development
    });
});

// Start server
const serverIP = process.env.IP || '0.0.0.0';
app.listen(PORT, serverIP, () => {
    console.log(`\n✅ Server running at http://${serverIP}:${PORT}`);
    console.log(`📡 API Endpoints:`);
    console.log(`   - GET  /         - Health check`);
    console.log(`   - GET  /status   - Bot status & QR code`);
    console.log(`   - POST /send-otp - Send OTP message`);
    console.log(`   - GET  /send-otp - Send OTP message (GET)`);
    console.log(`\n⏳ Waiting for WhatsApp connection...\n`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await bot.disconnect();
    process.exit(0);
});
