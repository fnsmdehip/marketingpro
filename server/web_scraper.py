import trafilatura
import sys


def get_website_text_content(url: str) -> str:
    """
    This function takes a url and returns the main text content of the website.
    The text content is extracted using trafilatura and easier to understand.
    The results is not directly readable, better to be summarized by LLM before consume
    by the user.

    Some common website to crawl information from:
    MLB scores: https://www.mlb.com/scores/YYYY-MM-DD
    """
    # Send a request to the website
    downloaded = trafilatura.fetch_url(url)
    text = trafilatura.extract(downloaded)
    return text


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