import csv

INPUT_CSV = "Food.csv"           
OUTPUT_CSV = "Google_Image_Urls.csv" 


def generate_google_image_url(item_name):
    base_url = "https://www.google.com/search?tbm=isch&q="
    query = item_name.replace(" ", "+")  
    return base_url + query


def process_csv_and_export():
    try:
        with open(INPUT_CSV, mode="r", encoding="utf-8-sig") as infile, open(OUTPUT_CSV, mode="w", encoding="utf-8", newline="") as outfile:
            reader = csv.DictReader(infile)
            fieldnames = ["Google_Image_URL"]  
            writer = csv.DictWriter(outfile, fieldnames=fieldnames)
            writer.writeheader()

            for row in reader:
                item_name = row.get("Image_Name").strip()
                if item_name: 
                    google_url = generate_google_image_url(item_name)
                    writer.writerow({"Google_Image_URL": google_url})
                else: 
                    print(f"Skipping row with missing Title: {row}")

        print(f"Google Image URLs saved to {OUTPUT_CSV}")
    except Exception as e:
        print(f"Error processing CSV: {e}")

if __name__ == "__main__":
    process_csv_and_export()
