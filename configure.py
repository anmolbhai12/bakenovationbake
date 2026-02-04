#!/usr/bin/env python3
"""
Auto-Configuration Script for Bakenovation Order System
This script automatically configures all URLs after GAS deployment
"""

import json
import re
import sys

def update_file(filepath, pattern, replacement):
    """Update a file with regex pattern replacement"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated_content = re.sub(pattern, replacement, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        
        print(f"✅ Updated: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error updating {filepath}: {e}")
        return False

def main():
    print("🔧 Bakenovation Order System - Auto Configuration")
    print("=" * 60)
    
    # Get GAS URL from user
    print("\n📋 Step 1: Deploy order_manager.gs to Google Apps Script")
    print("   1. Open order_manager.gs")
    print("   2. Go to script.google.com and paste the code")
    print("   3. Deploy as Web App (Execute as: Me, Access: Anyone)")
    print("   4. Copy the deployment URL\n")
    
    gas_url = input("Enter your Google Apps Script URL: ").strip()
    
    if not gas_url:
        print("❌ No URL provided. Exiting.")
        sys.exit(1)
    
    print(f"\n🎯 Configuring system with URL: {gas_url}\n")
    
    # Update index.html
    update_file(
        'index.html',
        r'action="YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"',
        f'action="{gas_url}"'
    )
    
    # Update admin dashboard
    update_file(
        'admin/index.html',
        r"const GAS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';",
        f"const GAS_URL = '{gas_url}';"
    )
    
    print("\n✅ Configuration complete!")
    print("\n🚀 Next Steps:")
    print("1. Generate payment QR: cd whatsapp-bot && node generate_qr.js")
    print("2. Deploy bot: python whatsapp-bot/deploy.py")
    print("3. Push to GitHub: git add . && git commit -m 'Configure order system' && git push")
    print("\n🎉 Your order system is ready to use!")

if __name__ == '__main__':
    main()
