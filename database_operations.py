"""
Database operations with efficiency issues
"""
import sqlite3
import time
from typing import List, Dict, Any

class DatabaseManager:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.connection = None
    
    def connect(self):
        """Connect to database"""
        self.connection = sqlite3.connect(self.db_path)
        self.connection.row_factory = sqlite3.Row
    
    def disconnect(self):
        """Disconnect from database"""
        if self.connection:
            self.connection.close()
    
    def insert_users_inefficiently(self, users: List[Dict[str, Any]]):
        """Insert users with individual queries - very inefficient"""
        self.connect()
        cursor = self.connection.cursor()
        
        for user in users:
            cursor.execute("""
                INSERT INTO users (name, email, age, department)
                VALUES (?, ?, ?, ?)
            """, (user['name'], user['email'], user['age'], user['department']))
            
            self.connection.commit()
        
        self.disconnect()
    
    def get_user_reports_inefficiently(self, user_ids: List[int]):
        """Get user reports with N+1 query problem"""
        self.connect()
        cursor = self.connection.cursor()
        
        reports = []
        
        for user_id in user_ids:
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            user = cursor.fetchone()
            
            if user:
                cursor.execute("SELECT * FROM orders WHERE user_id = ?", (user_id,))
                orders = cursor.fetchall()
                
                cursor.execute("SELECT * FROM profiles WHERE user_id = ?", (user_id,))
                profile = cursor.fetchone()
                
                cursor.execute("SELECT * FROM preferences WHERE user_id = ?", (user_id,))
                preferences = cursor.fetchall()
                
                reports.append({
                    'user': dict(user),
                    'orders': [dict(order) for order in orders],
                    'profile': dict(profile) if profile else None,
                    'preferences': [dict(pref) for pref in preferences]
                })
        
        self.disconnect()
        return reports
    
    def search_products_inefficiently(self, search_term: str):
        """Search products without proper indexing"""
        self.connect()
        cursor = self.connection.cursor()
        
        cursor.execute("""
            SELECT * FROM products 
            WHERE LOWER(name) LIKE LOWER(?)
        """, (f'%{search_term}%',))
        name_matches = cursor.fetchall()
        
        cursor.execute("""
            SELECT * FROM products 
            WHERE LOWER(description) LIKE LOWER(?)
        """, (f'%{search_term}%',))
        desc_matches = cursor.fetchall()
        
        cursor.execute("""
            SELECT p.* FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE LOWER(c.name) LIKE LOWER(?)
        """, (f'%{search_term}%',))
        category_matches = cursor.fetchall()
        
        all_matches = []
        seen_ids = set()
        
        for match_list in [name_matches, desc_matches, category_matches]:
            for product in match_list:
                if product['id'] not in seen_ids:
                    all_matches.append(dict(product))
                    seen_ids.add(product['id'])
        
        self.disconnect()
        return all_matches
    
    def update_inventory_inefficiently(self, updates: List[Dict[str, Any]]):
        """Update inventory with inefficient queries"""
        self.connect()
        cursor = self.connection.cursor()
        
        for update in updates:
            product_id = update['product_id']
            quantity_change = update['quantity_change']
            
            cursor.execute("SELECT quantity FROM inventory WHERE product_id = ?", (product_id,))
            current_quantity = cursor.fetchone()
            
            if current_quantity:
                new_quantity = current_quantity['quantity'] + quantity_change
                
                cursor.execute("""
                    UPDATE inventory 
                    SET quantity = ?, last_updated = datetime('now')
                    WHERE product_id = ?
                """, (new_quantity, product_id))
                
                self.connection.commit()
                
                cursor.execute("SELECT quantity FROM inventory WHERE product_id = ?", (product_id,))
                updated_quantity = cursor.fetchone()
                print(f"Updated product {product_id}: {updated_quantity['quantity']}")
        
        self.disconnect()
    
    def generate_sales_report_inefficiently(self, start_date: str, end_date: str):
        """Generate sales report with multiple inefficient queries"""
        self.connect()
        cursor = self.connection.cursor()
        
        report = {}
        
        cursor.execute("""
            SELECT SUM(total_amount) as total_sales
            FROM orders
            WHERE order_date BETWEEN ? AND ?
        """, (start_date, end_date))
        report['total_sales'] = cursor.fetchone()['total_sales'] or 0
        
        cursor.execute("""
            SELECT COUNT(*) as order_count
            FROM orders
            WHERE order_date BETWEEN ? AND ?
        """, (start_date, end_date))
        report['order_count'] = cursor.fetchone()['order_count']
        
        cursor.execute("""
            SELECT AVG(total_amount) as avg_order_value
            FROM orders
            WHERE order_date BETWEEN ? AND ?
        """, (start_date, end_date))
        report['avg_order_value'] = cursor.fetchone()['avg_order_value'] or 0
        
        cursor.execute("""
            SELECT p.name, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.order_date BETWEEN ? AND ?
            GROUP BY p.id, p.name
            ORDER BY total_sold DESC
            LIMIT 10
        """, (start_date, end_date))
        report['top_products'] = [dict(row) for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT DATE(order_date) as sale_date, 
                   SUM(total_amount) as daily_sales,
                   COUNT(*) as daily_orders
            FROM orders
            WHERE order_date BETWEEN ? AND ?
            GROUP BY DATE(order_date)
            ORDER BY sale_date
        """, (start_date, end_date))
        report['daily_sales'] = [dict(row) for row in cursor.fetchall()]
        
        self.disconnect()
        return report
    
    def cleanup_old_data_inefficiently(self, days_old: int):
        """Clean up old data inefficiently"""
        self.connect()
        cursor = self.connection.cursor()
        
        cursor.execute("""
            SELECT id FROM logs 
            WHERE created_at < datetime('now', '-{} days')
        """.format(days_old))
        
        old_log_ids = [row['id'] for row in cursor.fetchall()]
        
        for log_id in old_log_ids:
            cursor.execute("DELETE FROM logs WHERE id = ?", (log_id,))
            self.connection.commit()
        
        cursor.execute("""
            SELECT id FROM user_sessions 
            WHERE last_activity < datetime('now', '-{} days')
        """.format(days_old))
        
        old_session_ids = [row['id'] for row in cursor.fetchall()]
        
        for session_id in old_session_ids:
            cursor.execute("DELETE FROM user_sessions WHERE id = ?", (session_id,))
            self.connection.commit()
        
        cursor.execute("VACUUM")
        
        self.disconnect()
        
        return len(old_log_ids) + len(old_session_ids)
