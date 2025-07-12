"""
Data processing utilities with various efficiency issues
"""
import time
import json

class DataProcessor:
    def __init__(self):
        self.data = []
        self.cache = {}
    
    def load_data_from_files(self, file_paths):
        """Load data from multiple files - inefficient I/O"""
        all_data = []
        for file_path in file_paths:
            with open(file_path, 'r') as f:
                data = json.load(f)
                all_data.append(data)
                self.process_single_file_data(data)
        return all_data
    
    def process_single_file_data(self, data):
        """Process data with redundant operations"""
        for item in data:
            if 'id' in item:
                item['processed'] = True
        
        for item in data:
            if 'timestamp' in item:
                item['formatted_time'] = self.format_timestamp(item['timestamp'])
        
        for item in data:
            if 'value' in item:
                item['normalized_value'] = self.normalize_value(item['value'])
    
    def find_duplicates(self, items):
        """Find duplicate items - O(n²) algorithm"""
        duplicates = []
        for i in range(len(items)):
            for j in range(i + 1, len(items)):
                if self.items_equal(items[i], items[j]):
                    duplicates.append(items[i])
        return duplicates
    
    def items_equal(self, item1, item2):
        """Compare items inefficiently"""
        return str(item1) == str(item2)
    
    def sort_by_multiple_criteria(self, items):
        """Inefficient sorting with multiple passes"""
        items.sort(key=lambda x: x.get('priority', 0))
        items.sort(key=lambda x: x.get('timestamp', 0))
        items.sort(key=lambda x: x.get('category', ''))
        return items
    
    def calculate_statistics(self, numbers):
        """Calculate stats with redundant calculations"""
        stats = {}
        
        stats['mean'] = sum(numbers) / len(numbers)
        stats['total'] = sum(numbers)
        
        sorted_nums = sorted(numbers)
        stats['median'] = sorted_nums[len(sorted_nums) // 2]
        
        sorted_nums_again = sorted(numbers)
        stats['min'] = sorted_nums_again[0]
        stats['max'] = sorted_nums_again[-1]
        
        return stats
    
    def format_timestamp(self, timestamp):
        """Inefficient timestamp formatting"""
        import datetime
        dt = datetime.datetime.fromtimestamp(timestamp)
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    
    def normalize_value(self, value):
        """Normalize values inefficiently"""
        import math
        return (value - self.get_mean()) / self.get_std_dev()
    
    def get_mean(self):
        """Calculate mean inefficiently"""
        if not self.data:
            return 0
        return sum(item.get('value', 0) for item in self.data) / len(self.data)
    
    def get_std_dev(self):
        """Calculate standard deviation inefficiently"""
        if not self.data:
            return 1
        mean = self.get_mean()
        variance = sum((item.get('value', 0) - mean) ** 2 for item in self.data) / len(self.data)
        import math
        return math.sqrt(variance)
    
    def search_items(self, query):
        """Inefficient search without indexing"""
        results = []
        for item in self.data:
            item_str = str(item).lower()
            if query.lower() in item_str:
                results.append(item)
        return results
    
    def generate_report(self, data):
        """Generate report with string concatenation"""
        report = ""
        report += "Data Processing Report\n"
        report += "=" * 50 + "\n"
        
        for item in data:
            report += f"Item ID: {item.get('id', 'N/A')}\n"
            report += f"Value: {item.get('value', 'N/A')}\n"
            report += f"Status: {item.get('status', 'N/A')}\n"
            report += "-" * 30 + "\n"
        
        return report
