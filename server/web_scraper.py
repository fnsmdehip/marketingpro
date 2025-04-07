import trafilatura
import sys
import requests
from urllib.parse import urlparse
import random
import time
import re

# List of user agents to rotate through
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 17_0_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0"
]

# Custom referrers to make requests look more natural
REFERRERS = [
    "https://www.google.com/",
    "https://www.bing.com/",
    "https://www.linkedin.com/",
    "https://twitter.com/",
    "https://www.facebook.com/",
    "https://www.reddit.com/"
]

def get_website_text_content(url: str) -> str:
    """
    This function takes a url and returns the main text content of the website.
    Uses multiple strategies to handle various anti-scraping measures.
    
    Args:
        url: The URL of the website to scrape
        
    Returns:
        String containing the main text content of the website
        
    Some common website to crawl information from:
    - News sites: CNN, BBC, Reuters
    - Blogs: Medium, WordPress sites
    - Documentation: GitHub READMEs, technical docs
    """
    # Parse the domain for customized behavior
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.lower()
    
    # Select random user agent and referrer
    user_agent = random.choice(USER_AGENTS)
    referrer = random.choice(REFERRERS)
    
    # Create session with custom headers
    session = requests.Session()
    session.headers.update({
        "User-Agent": user_agent,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": referrer,
        "DNT": "1",
        "Upgrade-Insecure-Requests": "1",
        "Connection": "keep-alive"
    })
    
    # Add a slight delay to appear more human-like
    time.sleep(random.uniform(0.5, 1.5))
    
    downloaded = None
    text = None
    
    # Strategy 1: Use requests with full headers
    try:
        print(f"Attempting to scrape {url} with custom session...")
        response = session.get(url, timeout=15)
        downloaded = response.text
        
        # Try to extract content
        text = trafilatura.extract(downloaded)
        if text and len(text.strip()) > 100:  # Check if we got meaningful content
            return text
    except Exception as e:
        print(f"Error with session request: {str(e)}", file=sys.stderr)
    
    # Strategy 2: Use trafilatura's built-in downloader (different set of headers)
    try:
        print(f"Attempting to scrape {url} with trafilatura...")
        downloaded = trafilatura.fetch_url(url)
        text = trafilatura.extract(downloaded)
        if text and len(text.strip()) > 100:
            return text
    except Exception as e:
        print(f"Error with trafilatura: {str(e)}", file=sys.stderr)
    
    # Strategy 3: Site-specific handlers for difficult sites
    if "amazon" in domain:
        try:
            print("Using Amazon-specific scraping strategy...")
            # For Amazon, focus on product descriptions if present
            if downloaded:
                # Extract product title
                title_match = re.search(r'<span id="productTitle"[^>]*>(.*?)</span>', downloaded)
                title = title_match.group(1).strip() if title_match else "Product Title Not Found"
                
                # Extract product description
                desc_match = re.search(r'<div id="productDescription"[^>]*>(.*?)</div>', downloaded, re.DOTALL)
                description = desc_match.group(1) if desc_match else ""
                
                # Clean HTML tags
                description = re.sub(r'<[^>]*>', ' ', description)
                description = re.sub(r'\s+', ' ', description).strip()
                
                if len(description) > 50:
                    return f"{title}\n\n{description}"
        except Exception as e:
            print(f"Error with Amazon-specific strategy: {str(e)}", file=sys.stderr)
    
    # If we got some text but it's limited, return what we have
    if text and len(text.strip()) > 0:
        return text
    
    # If all strategies failed
    if downloaded:
        # As a last resort, try to extract any text from the HTML
        try:
            # Simple HTML tag removal - not ideal but better than nothing
            text_content = re.sub(r'<[^>]*>', ' ', downloaded)
            text_content = re.sub(r'\s+', ' ', text_content).strip()
            
            if len(text_content) > 200:  # Only if we have something meaningful
                return "Limited content extracted: " + text_content[:5000]  # Limit to reasonable size
        except Exception:
            pass
            
    return "Failed to extract meaningful content from this URL. The site may use anti-scraping measures."


if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
        try:
            text_content = get_website_text_content(url)
            print(text_content)
        except Exception as e:
            print(f"Error scraping website: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        print("Error: URL is required", file=sys.stderr)
        sys.exit(1)