"""
Context Understanding Agent - Analyzes dataset structure and goal
"""

import pandas as pd
from backend.utils.context import Context


class ContextUnderstandingAgent:
    """
    ROLE: Analyze dataset structure and document context
    INPUT: Raw CSV data path and goal
    OUTPUT: Updated context with data loaded, columns documented, basic stats
    LOG: Data profiling information
    """
    
    def __init__(self):
        self.name = "Context Understanding Agent"
    
    def execute(self, context: Context):
        """Analyze dataset context"""
        
        try:
            # Load data
            csv_path = context.get("csv_path")
            if csv_path:
                data = pd.read_csv(csv_path)
                context.set("data", data)
            else:
                raise ValueError("CSV path not provided")
            
            # Extract basic information
            columns = list(data.columns)
            context.set("columns", columns)
            
            # Log information
            log_msg = f"[{self.name}] Dataset loaded: {data.shape[0]} rows, {len(columns)} columns"
            context.append_log(log_msg)
            
            # Log column types
            dtypes_msg = f"[{self.name}] Column types: {data.dtypes.to_dict()}"
            context.append_log(dtypes_msg)
            
            # Log missing values
            missing = data.isnull().sum()
            if missing.sum() > 0:
                missing_msg = f"[{self.name}] Missing values: {missing[missing > 0].to_dict()}"
                context.append_log(missing_msg)
            
            context.append_log(f"[{self.name}] ✓ Context understanding complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
