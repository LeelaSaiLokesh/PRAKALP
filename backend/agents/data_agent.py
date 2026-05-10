"""
Data Agent - Handles data preprocessing and preparation
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from backend.utils.context import Context


class DataAgent:
    """
    ROLE: Preprocess and prepare data for segmentation
    INPUT: Selected features, raw data
    OUTPUT: Preprocessed data ready for segmentation
    LOG: Preprocessing steps and transformations
    """
    
    def __init__(self):
        self.name = "Data Agent"
    
    def execute(self, context: Context):
        """Preprocess data"""
        
        try:
            data = context.get("data")
            features = context.get("features")
            
            # Select relevant features
            data_subset = data[features].copy()
            
            context.append_log(f"[{self.name}] Processing {len(features)} features")
            
            preprocessing_steps = []
            
            # Handle missing values
            missing_cols = data_subset.columns[data_subset.isnull().any()].tolist()
            if missing_cols:
                data_subset.fillna(data_subset.mean(numeric_only=True), inplace=True)
                preprocessing_steps.append(f"Filled missing values in {missing_cols}")
                context.append_log(f"[{self.name}] Filled missing values: {missing_cols}")
            
            # Encode categorical variables
            categorical_cols = data_subset.select_dtypes(include=['object']).columns.tolist()
            if categorical_cols:
                le_dict = {}
                for col in categorical_cols:
                    le = LabelEncoder()
                    data_subset[col] = le.fit_transform(data_subset[col].astype(str))
                    le_dict[col] = le
                preprocessing_steps.append(f"Encoded categorical variables: {categorical_cols}")
                context.append_log(f"[{self.name}] Encoded categorical variables: {categorical_cols}")
            
            # Handle outliers (optional - remove extreme outliers)
            numeric_cols = data_subset.select_dtypes(include=[np.number]).columns.tolist()
            outliers_removed = 0
            for col in numeric_cols:
                Q1 = data_subset[col].quantile(0.25)
                Q3 = data_subset[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 3 * IQR
                upper_bound = Q3 + 3 * IQR
                outliers = ((data_subset[col] < lower_bound) | (data_subset[col] > upper_bound)).sum()
                if outliers > 0:
                    outliers_removed += outliers
            
            if outliers_removed > 0:
                preprocessing_steps.append(f"Detected {outliers_removed} extreme outliers")
                context.append_log(f"[{self.name}] Detected {outliers_removed} extreme outliers")
            
            # Standardize features
            scaler = StandardScaler()
            data_scaled = scaler.fit_transform(data_subset)
            data_scaled = pd.DataFrame(data_scaled, columns=features)
            
            preprocessing_steps.append("Standardized all features")
            
            # Update context
            context.set("data", data_scaled)
            context.set("preprocessing_steps", preprocessing_steps)
            context.set("scaler", scaler)
            
            context.append_log(f"[{self.name}] Data shape: {data_scaled.shape}")
            context.append_log(f"[{self.name}] ✓ Data preprocessing complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
