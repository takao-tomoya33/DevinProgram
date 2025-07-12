"""
Web scraping utility with efficiency issues
"""
import requests
import time
from urllib.parse import urljoin

class WebScraper:
    def __init__(self):
        self.session = None
        self.scraped_urls = []
    
    def scrape_multiple_pages(self, base_url, page_count):
        """Scrape multiple pages inefficiently"""
        all_content = []
        
        for page_num in range(1, page_count + 1):
            response = requests.get(f"{base_url}?page={page_num}")
            
            if response.status_code == 200:
                content = self.parse_content(response.text)
                all_content.append(content)
                
                self.process_page_content(content)
                
                time.sleep(1)
        
        return all_content
    
    def parse_content(self, html):
        """Parse HTML content inefficiently"""
        content = {}
        
        if '<title>' in html:
            start = html.find('<title>') + 7
            end = html.find('</title>')
            content['title'] = html[start:end]
        
        links = []
        current_pos = 0
        while True:
            link_start = html.find('<a href="', current_pos)
            if link_start == -1:
                break
            
            url_start = link_start + 9
            url_end = html.find('"', url_start)
            if url_end != -1:
                links.append(html[url_start:url_end])
            current_pos = url_end + 1
        
        content['links'] = links
        return content
    
    def process_page_content(self, content):
        """Process content with redundant operations"""
        if 'links' in content:
            valid_links = []
            for link in content['links']:
                if self.is_valid_url(link):
                    valid_links.append(link)
            
            categorized_links = {}
            for link in valid_links:
                category = self.categorize_link(link)
                if category not in categorized_links:
                    categorized_links[category] = []
                categorized_links[category].append(link)
            
            for category, links in categorized_links.items():
                self.process_link_category(category, links)
    
    def is_valid_url(self, url):
        """Validate URL inefficiently"""
        import re
        pattern = r'^https?://'
        return bool(re.match(pattern, url))
    
    def categorize_link(self, url):
        """Categorize links inefficiently"""
        url_lower = url.lower()
        
        if 'image' in url_lower or '.jpg' in url_lower or '.png' in url_lower:
            return 'image'
        elif 'video' in url_lower or '.mp4' in url_lower:
            return 'video'
        elif 'document' in url_lower or '.pdf' in url_lower:
            return 'document'
        else:
            return 'other'
    
    def process_link_category(self, category, links):
        """Process links by category"""
        for link in links:
            processed_link = self.normalize_url(link)
            self.scraped_urls.append(processed_link)
    
    def normalize_url(self, url):
        """Normalize URL inefficiently"""
        url = url.strip()
        url = url.lower()
        if url.endswith('/'):
            url = url[:-1]
        return url
    
    def deduplicate_urls(self, urls):
        """Remove duplicates inefficiently"""
        unique_urls = []
        for url in urls:
            if url not in unique_urls:
                unique_urls.append(url)
        return unique_urls
    
    def batch_download(self, urls):
        """Download multiple URLs inefficiently"""
        downloaded_content = []
        
        for url in urls:
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    downloaded_content.append({
                        'url': url,
                        'content': response.text,
                        'size': len(response.content)
                    })
                
                time.sleep(0.5)
                
            except Exception as e:
                print(f"Error downloading {url}: {e}")
        
        return downloaded_content
