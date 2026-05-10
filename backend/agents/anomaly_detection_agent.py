"""
Anomaly Detection Agent - Detects anomalies in clusters
"""

import numpy as np
from backend.utils.context import Context


class AnomalyDetectionAgent:
    """
    ROLE: Detect and identify anomalies within clusters
    INPUT: Clusters, clustered data, model
    OUTPUT: Anomaly indices and details
    LOG: Anomaly detection results
    """
    
    def __init__(self):
        self.name = "Anomaly Detection Agent"
    
    def execute(self, context: Context):
        """Detect anomalies"""
        
        try:
            data = context.get("data")
            cluster_assignments = context.get("cluster_assignments")  # Use cluster assignments
            model = context.get("model")
            
            if data is None or cluster_assignments is None:
                context.append_log(f"[{self.name}] No data available for anomaly detection")
                context.set("anomalies", [])
                return
            
            # Calculate distances to cluster centers
            distances = np.linalg.norm(data.values - model.cluster_centers_[cluster_assignments], axis=1)
            
            # Identify anomalies as points in top 5% of distances
            threshold = np.percentile(distances, 95)
            anomaly_indices = np.where(distances > threshold)[0]
            
            context.set("anomalies", {
                "indices": anomaly_indices.tolist(),
                "count": len(anomaly_indices),
                "threshold": float(threshold),
                "distances": distances.tolist()
            })
            
            context.append_log(f"[{self.name}] Anomalies detected: {len(anomaly_indices)} out of {len(data)} records")
            context.append_log(f"[{self.name}] Anomaly threshold (distance): {threshold:.4f}")
            context.append_log(f"[{self.name}] ✓ Anomaly detection complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
