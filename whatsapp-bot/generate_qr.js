const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Your UPI payment details
const UPI_ID = 'japindersinghbhasin@paytm'; // Replace with your actual UPI ID
const MERCHANT_NAME = 'Bakenovation Studio';
const AMOUNT = ''; // Leave empty for variable amount

// Generate UPI payment string
const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}${AMOUNT ? '&am=' + AMOUNT : ''}`;

console.log('🎨 Generating Payment QR Code...');
console.log('UPI String:', upiString);

// Generate QR code and save as image
const outputPath = path.join(__dirname, 'payment_qr.png');

QRCode.toFile(outputPath, upiString, {
    width: 512,
    margin: 2,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    }
}, (err) => {
    if (err) {
        console.error('❌ Error generating QR code:', err);
        process.exit(1);
    }

    console.log('✅ Payment QR Code generated successfully!');
    console.log('📁 Saved to:', outputPath);
    console.log('\n🎯 Next Steps:');
    console.log('1. The QR code is ready to use');
    console.log('2. Deploy the bot with: python deploy.py');
    console.log('3. The bot will automatically use this QR code');
});
