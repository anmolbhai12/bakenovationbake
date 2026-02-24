import ftplib
import os
import shutil

# --- CONFIGURATION ---
FTP_HOST = "ftp-bakenovation-bot.alwaysdata.net"
FTP_USER = "bakenovation-bot"
FTP_PASS = "bakenovation"  # The password you provided
REMOTE_DIR = "/www/whatsapp-bot"

# Files and folders to upload
ITEMS_TO_UPLOAD = [
    "server.js",
    "whatsapp.js",
    "package.json",
    "auth_info"
]

def upload_directory(ftp, local_dir, remote_dir):
    try:
        ftp.mkd(remote_dir)
    except:
        pass # Directory might already exist
    
    for root, dirs, files in os.walk(local_dir):
        relative_path = os.path.relpath(root, local_dir)
        if relative_path == ".":
            dest_dir = remote_dir
        else:
            dest_dir = os.path.join(remote_dir, relative_path).replace("\\", "/")
            try:
                ftp.mkd(dest_dir)
            except:
                pass

        for file in files:
            local_file = os.path.join(root, file)
            remote_file = os.path.join(dest_dir, file).replace("\\", "/")
            with open(local_file, "rb") as f:
                print(f"Uploading {remote_file}...")
                ftp.storbinary(f"STOR {remote_file}", f)

def main():
    print("🚀 Starting deployment to Alwaysdata...")
    
    try:
        ftp = ftplib.FTP(FTP_HOST)
        ftp.login(FTP_USER, FTP_PASS)
        print("✅ Logged into Alwaysdata FTP successfully!")

        # Create remote directory
        try:
            ftp.mkd(REMOTE_DIR)
        except:
            pass

        for item in ITEMS_TO_UPLOAD:
            local_path = item
            if os.path.isdir(local_path):
                print(f"📁 Uploading folder: {item}...")
                upload_directory(ftp, local_path, os.path.join(REMOTE_DIR, item).replace("\\", "/"))
            else:
                print(f"📄 Uploading file: {item}...")
                with open(local_path, "rb") as f:
                    remote_path = os.path.join(REMOTE_DIR, item).replace('\\', '/')
                    ftp.storbinary(f"STOR {remote_path}", f)

        ftp.quit()
        print("\n✨ DEPLOYMENT COMPLETE!")
        print("Next step: Follow the instructions in ALWAYS_FINISH.md")

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
