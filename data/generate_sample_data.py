"""
Generate example dataset for testing the multi-agent system
"""

import pandas as pd
import numpy as np
import os

def create_ecommerce_dataset():
    """Create a realistic e-commerce customer dataset"""
    
    np.random.seed(42)
    n_samples = 500
    
    # Create sample data
    data = {
        'customer_id': range(1, n_samples + 1),
        'age': np.random.randint(18, 70, n_samples),
        'annual_income': np.random.randint(20000, 150000, n_samples),
        'purchase_frequency': np.random.randint(1, 50, n_samples),
        'avg_order_value': np.random.uniform(10, 500, n_samples),
        'product_category': np.random.choice(['Electronics', 'Clothing', 'Home', 'Sports', 'Books'], n_samples),
        'customer_lifetime_value': np.random.uniform(100, 10000, n_samples),
        'account_age_months': np.random.randint(1, 60, n_samples),
        'reviews_count': np.random.randint(0, 50, n_samples),
        'return_rate': np.random.uniform(0, 0.3, n_samples),
        'email_engagement': np.random.choice(['High', 'Medium', 'Low'], n_samples)
    }
    
    df = pd.DataFrame(data)
    
    # Save to CSV
    output_path = os.path.join(os.path.dirname(__file__), 'ecommerce_data.csv')
    df.to_csv(output_path, index=False)
    
    print(f"Sample dataset created: {output_path}")
    print(f"Shape: {df.shape}")
    print(f"\nFirst few rows:\n{df.head()}")
    
    return output_path


if __name__ == "__main__":
    create_ecommerce_dataset()
