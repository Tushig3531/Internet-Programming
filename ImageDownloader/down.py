import os
import urllib.parse
import requests
import pandas as pd
from io import BytesIO
from PIL import Image
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

CSV_FILE = "Google_Image_Urls.csv"        
OUTPUT_FOLDER = "downloaded_images"       
COLUMN_NAME = "Google_Image_URL"          
GOOGLE_API_KEY = "API KEY"     
SEARCH_ENGINE_ID = "ID"   

def parse_query_from_url(google_url: str) -> str:
    
    parsed = urllib.parse.urlparse(google_url)
    params = urllib.parse.parse_qs(parsed.query)
    q_value = params.get("q", [""])[0]  
    return q_value.strip()

def get_first_image_url(query: str) -> str | None:
   
    try:
        service = build("customsearch", "v1", developerKey=GOOGLE_API_KEY)
        response = service.cse().list(
            q=query,
            cx=SEARCH_ENGINE_ID,
            searchType="image",
            num=1 
        ).execute()

        if "error" in response:
            err_msg = response["error"].get("message", "Unknown error from API.")
            raise Exception(f"Google API error: {err_msg}")

        items = response.get("items", [])
        if not items:
            return None

        return items[0].get("link")

    except HttpError as http_err:
        
        raise Exception(f"HTTP Error from API: {http_err}")
    except Exception as e:
        raise Exception(str(e))

def sanitize_filename(filename: str) -> str:
    
    invalid_chars = '<>:"/\\|?*'
    for c in invalid_chars:
        filename = filename.replace(c, "_")
    return filename

def download_image_as_png(img_url: str, save_path: str) -> bool:
    
    try:
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/85.0.4183.102 Safari/537.36"
            )
        }
        resp = requests.get(img_url, headers=headers, timeout=15)
        resp.raise_for_status()

        
        image = Image.open(BytesIO(resp.content))

        if image.mode in ("RGBA", "P"):
            image = image.convert("RGB")

        image.save(save_path, "PNG")
        return True

    except Exception as e:
        print(f"Failed to download/convert '{img_url}': {e}")
        return False

def main():
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    try:
        df = pd.read_csv(CSV_FILE)
    except FileNotFoundError:
        print(f"Error: File '{CSV_FILE}' not found.")
        return
    except Exception as e:
        print(f"Error reading '{CSV_FILE}': {e}")
        return
    
    if COLUMN_NAME not in df.columns:
        print(f"Error: CSV must have a column named '{COLUMN_NAME}'.")
        return

    for count, (idx, row) in enumerate(df.iterrows(), start=1):
        google_url = str(row[COLUMN_NAME]).strip()
        if not google_url:
            print(f"[Row {count}] Empty or invalid URL. Skipping.")
            continue

        query = parse_query_from_url(google_url)
        if not query:
            print(f"[Row {count}] No 'q' param found in URL. Skipping.")
            continue

        print(f"[{count}/{len(df)}] Searching for '{query}'...")

        try:
            image_url = get_first_image_url(query)
            if not image_url:
                print("   No image found from the API.")
                continue

            sanitized = sanitize_filename(query)
            filename = f"{sanitized}.png" 
            save_path = os.path.join(OUTPUT_FOLDER, filename)
            success = download_image_as_png(image_url, save_path)
            if success:
                print(f"   Downloaded -> {save_path}")
            else:
                print("   Download failed.")

        except Exception as e:
            err_str = str(e).lower()
            if "quota" in err_str or "exceed" in err_str or "limit" in err_str:
                print("\n***** API QUOTA/USAGE LIMIT REACHED *****")
                print(f"Details: {e}")
                print("Stopping script now.")
                break
            else:
                print(f"Error with '{query}': {e}")

    print("\nAll done!")

if __name__ == "__main__":
    main()
