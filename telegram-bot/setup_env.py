"""
Script to create .env file
"""

import sys
from pathlib import Path

# Fix Windows encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

env_content = """BOT_TOKEN=8553648447:AAF96eTpR9UqQatdkLO5PFRKfpsDR3J1Tl8
ADMIN_IDS=

API_HOST=0.0.0.0
API_PORT=3000
API_BASE_URL=http://localhost:3000

WEB_APP_URL=http://localhost:4200

DATABASE_URL=sqlite+aiosqlite:///./brawlstars.db

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

BRAWL_STARS_API_KEY=
"""

def main():
    env_file = Path(".env")
    
    if env_file.exists():
        print("WARNING: .env file already exists!")
        response = input("Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Cancelled")
            return
    
    try:
        env_file.write_text(env_content, encoding='utf-8')
        print("SUCCESS: .env file created!")
        print("\nContent:")
        print("-" * 50)
        print(env_content)
        print("-" * 50)
        print("\nNow you can run: python run_all.py")
    except Exception as e:
        print(f"ERROR creating file: {e}")

if __name__ == "__main__":
    main()
