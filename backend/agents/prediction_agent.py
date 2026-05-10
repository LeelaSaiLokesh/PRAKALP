"""
Prediction Agent - Predicts cluster assignment for new data points
"""

import pandas as pd
import numpy as np
from backend.utils.context import Context


class PredictionAgent:
    """
    ROLE: Predict cluster assignment and label new data points
    INPUT: Trained model, new data, features, scaler
    OUTPUT: Cluster assignment with explanation
    LOG: Prediction process and results
    """
    
    def __init__(self):
        self.name = "Prediction Agent"
    
    def execute(self, context: Context):
        """Prepare prediction capability"""
        
        try:
            context.set("prediction_ready", True)
            context.append_log(f"[{self.name}] ✓ Prediction module initialized")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
    
    def predict(self, context: Context, new_data_dict: dict) -> dict:
        """Predict cluster for new data point"""
        
        try:
            context.append_log(f"[{self.name}] Predicting for new data point")
            
            # Get required components
            model = context.get("model")
            scaler = context.get("scaler")
            features = context.get("features")
            domain = context.get("domain")
            cluster_assignments = context.get("cluster_assignments")
            cluster_names = context.get("cluster_names", {})
            
            # Validate required components
            if model is None:
                raise ValueError("Model not available. Run analysis first.")
            if scaler is None:
                raise ValueError("Scaler not available. Run analysis first.")
            if not features or len(features) == 0:
                raise ValueError("Features not available. Run analysis first.")
            if cluster_assignments is None:
                raise ValueError("Cluster assignments not available. Run analysis first.")
            
            # Prepare new data with only required features
            new_df = pd.DataFrame([new_data_dict])
            
            # Filter to only features that exist in both new_data and training data
            available_features = [f for f in features if f in new_df.columns]
            
            if not available_features:
                raise ValueError(f"None of the required features {features} found in input data")
            
            new_df = new_df[available_features]
            
            # Apply the same preprocessing (scaling)
            new_df_scaled = scaler.transform(new_df)
            
            # Predict cluster
            cluster_pred = model.predict(new_df_scaled)[0]
            
            # Calculate distance to cluster center
            distance = np.linalg.norm(new_df_scaled[0] - model.cluster_centers_[cluster_pred])
            
            # Generate explanation with meaningful cluster name
            cluster_size = np.sum(cluster_assignments == cluster_pred)
            cluster_percentage = (cluster_size / len(cluster_assignments)) * 100
            
            # Get meaningful cluster name
            cluster_name = cluster_names.get(str(cluster_pred), f"Cluster {cluster_pred}")
            
            result = {
                "cluster": int(cluster_pred),
                "cluster_name": cluster_name,
                "confidence": float(1 / (1 + distance)),  # Simple confidence metric
                "distance_to_center": float(distance),
                "cluster_size": int(cluster_size),
                "cluster_percentage": float(cluster_percentage),
                "domain": domain if domain else "Unknown",
                "explanation": f"Data point assigned to {cluster_name} ({cluster_percentage:.1f}% of population) at distance {distance:.4f} from center"
            }
            
            context.append_log(f"[{self.name}] Prediction: {cluster_name} (confidence: {result['confidence']:.4f})")
            
            return result
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Prediction error: {str(e)}")
            raise
