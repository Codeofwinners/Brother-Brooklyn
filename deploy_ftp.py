import ftplib
import os

FTP_HOST = "ftp.litcannabisseo.com"
FTP_USER = "jesus@bayareaweb.design"
FTP_PASS = "Ssgoku1988!"

DIRS_TO_CREATE = [
    "brother-brooklyn",
    "brother-brooklyn/onboarding",
]

FILES_TO_UPLOAD = [
    ("onboarding.html", "brother-brooklyn/onboarding/index.html"),
    ("submit.php", "brother-brooklyn/onboarding/submit.php"),
]

def upload_files():
    print(f"Connecting to {FTP_HOST}...")
    try:
        ftps = ftplib.FTP_TLS(FTP_HOST)
        ftps.login(FTP_USER, FTP_PASS)
        ftps.prot_p()
        print("Logged in and secured.")

        # Create directories
        for d in DIRS_TO_CREATE:
            try:
                ftps.mkd(d)
                print(f"Created directory: {d}")
            except:
                print(f"Directory {d} already exists.")

        # Remove old onboarding.html from wrong location
        try:
            ftps.delete("brother-brooklyn/onboarding.html")
            print("Removed old brother-brooklyn/onboarding.html")
        except:
            pass
        try:
            ftps.delete("brother-brooklyn/submit.php")
            print("Removed old brother-brooklyn/submit.php")
        except:
            pass

        for local_path, remote_path in FILES_TO_UPLOAD:
            full_local = os.path.join(os.path.dirname(os.path.abspath(__file__)), local_path)
            if not os.path.exists(full_local):
                print(f"Skipping missing file: {full_local}")
                continue

            print(f"Uploading {local_path} -> /{remote_path}...")
            with open(full_local, 'rb') as fp:
                ftps.storbinary(f'STOR {remote_path}', fp)
            print(f"  Uploaded successfully.")

        print("\nAll uploads complete!")
        print(f"Live at: https://bayareaweb.design/brother-brooklyn/onboarding/")
        ftps.quit()

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    upload_files()
