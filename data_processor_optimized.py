"""
Optimized data processing utilities - demonstrates efficiency improvements
"""
import time
import json
from collections import defaultdict
from typing import List, Dict, Any, Set

class OptimizedDataProcessor:
    def __init__(self):
        self.data = []
        self.cache = {}
        self._stats_cache = None
    
    def load_data_from_files(self, file_paths: List[str]) -> List[Dict]:
        """Load data from multiple files efficiently"""
        all_data = []
        
        for file_path in file_paths:
            with open(file_path, 'r') as f:
                data = json.load(f)
                all_data.append(data)
        
        for data in all_data:
            self.process_single_file_data_optimized(data)
        
        return all_data
    
    def process_single_file_data_optimized(self, data: List[Dict]) -> None:
        """Process data in single pass - OPTIMIZED"""
        import datetime
        
        for item in data:
            if 'id' in item:
                item['processed'] = True
            
            if 'timestamp' in item:
                dt = datetime.datetime.fromtimestamp(item['timestamp'])
                item['formatted_time'] = dt.strftime('%Y-%m-%d %H:%M:%S')
            
            if 'value' in item:
                item['normalized_value'] = self.normalize_value_cached(item['value'])
    
    def find_duplicates_optimized(self, items: List[Dict]) -> List[Dict]:
        """Find duplicate items using hash set - O(n) complexity - OPTIMIZED"""
        seen = set()
        duplicates = []
        
        for item in items:
            item_hash = hash(str(sorted(item.items())))
            
            if item_hash in seen:
                duplicates.append(item)
            else:
                seen.add(item_hash)
        
        return duplicates
    
    def sort_by_multiple_criteria_optimized(self, items: List[Dict]) -> List[Dict]:
        """Efficient sorting with compound key - OPTIMIZED"""
        return sorted(items, key=lambda x: (
            x.get('category', ''),
            x.get('timestamp', 0),
            x.get('priority', 0)
        ))
    
    def calculate_statistics_optimized(self, numbers: List[float]) -> Dict[str, float]:
        """Calculate stats efficiently with single pass - OPTIMIZED"""
        if not numbers:
            return {}
        
        sorted_nums = sorted(numbers)
        total = sum(numbers)
        n = len(numbers)
        
        stats = {
            'total': total,
            'mean': total / n,
            'min': sorted_nums[0],
            'max': sorted_nums[-1],
            'median': sorted_nums[n // 2] if n % 2 == 1 else (sorted_nums[n//2-1] + sorted_nums[n//2]) / 2
        }
        
        return stats
    
    def normalize_value_cached(self, value: float) -> float:
        """Normalize values with cached statistics - OPTIMIZED"""
        if self._stats_cache is None:
            self._calculate_stats_cache()
        
        return (value - self._stats_cache['mean']) / self._stats_cache['std_dev']
    
    def _calculate_stats_cache(self) -> None:
        """Calculate and cache statistics once - OPTIMIZED"""
        if not self.data:
            self._stats_cache = {'mean': 0, 'std_dev': 1}
            return
        
        values = [item.get('value', 0) for item in self.data]
        mean = sum(values) / len(values)
        variance = sum((v - mean) ** 2 for v in values) / len(values)
        
        import math
        self._stats_cache = {
            'mean': mean,
            'std_dev': math.sqrt(variance)
        }
    
    def search_items_optimized(self, query: str) -> List[Dict]:
        """Efficient search with pre-built index - OPTIMIZED"""
        if not hasattr(self, '_search_index'):
            self._build_search_index()
        
        query_lower = query.lower()
        results = []
        
        for item in self.data:
            item_id = id(item)
            if item_id in self._search_index:
                if query_lower in self._search_index[item_id]:
                    results.append(item)
        
        return results
    
    def _build_search_index(self) -> None:
        """Build search index for faster lookups - OPTIMIZED"""
        self._search_index = {}
        
        for item in self.data:
            item_text = str(item).lower()
            self._search_index[id(item)] = item_text
    
    def generate_report_optimized(self, data: List[Dict]) -> str:
        """Generate report efficiently using list join - OPTIMIZED"""
        report_parts = [
            "Data Processing Report",
            "=" * 50,
            ""
        ]
        
        for item in data:
            report_parts.extend([
                f"Item ID: {item.get('id', 'N/A')}",
                f"Value: {item.get('value', 'N/A')}",
                f"Status: {item.get('status', 'N/A')}",
                "-" * 30
            ])
        
        return "\n".join(report_parts)

def performance_comparison_demo():
    """Demonstrate performance improvements"""
    import random
    import time
    from data_processor import DataProcessor
    
    original = DataProcessor()
    optimized = OptimizedDataProcessor()
    
    test_items = [
        {'id': i, 'value': random.randint(1, 100), 'category': f'cat_{i%5}'}
        for i in range(1000)
    ]
    
    print("Performance Comparison Demo")
    print("=" * 40)
    
    start = time.time()
    original_duplicates = original.find_duplicates(test_items[:100])
    original_time = time.time() - start
    
    start = time.time()
    optimized_duplicates = optimized.find_duplicates_optimized(test_items[:100])
    optimized_time = time.time() - start
    
    print(f"Duplicate Detection (100 items):")
    print(f"  Original: {original_time:.4f}s")
    print(f"  Optimized: {optimized_time:.4f}s")
    print(f"  Improvement: {original_time/optimized_time:.1f}x faster")
    print()
    
    numbers = [random.random() * 100 for _ in range(1000)]
    
    start = time.time()
    original_stats = original.calculate_statistics(numbers)
    original_time = time.time() - start
    
    start = time.time()
    optimized_stats = optimized.calculate_statistics_optimized(numbers)
    optimized_time = time.time() - start
    
    print(f"Statistics Calculation (1000 numbers):")
    print(f"  Original: {original_time:.4f}s")
    print(f"  Optimized: {optimized_time:.4f}s")
    print(f"  Improvement: {original_time/optimized_time:.1f}x faster")

if __name__ == "__main__":
    performance_comparison_demo()
