import sys
from web_scraper import get_website_text_content

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python web_scraper_test.py <url>")
        sys.exit(1)
    
    url = sys.argv[1]
    try:
        text = get_website_text_content(url)
        print(f"Successfully scraped content from {url}")
        print("First 500 characters of content:")
        print(text[:500] + "..." if len(text) > 500 else text)
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        sys.exit(1)