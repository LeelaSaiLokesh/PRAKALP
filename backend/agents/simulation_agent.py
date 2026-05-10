"""
Simulation Agent - Simulates what-if scenarios by modifying data and re-segmenting
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from backend.utils.context import Context


class SimulationAgent:
    """
    ROLE: Run what-if scenarios by modifying dataset and re-segmenting
    INPUT: Original data, scenario parameters
    OUTPUT: Simulated clusters and comparison
    LOG: Simulation parameters and results
    """
    
    def __init__(self):
        self.name = "Simulation Agent"
    
    def execute(self, context: Context):
        """Prepare simulation capability"""
        
        try:
            # Store original model and data for later simulations
            context.set("simulation_ready", True)
            context.append_log(f"[{self.name}] ✓ Simulation module initialized")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
    
    def run_simulation(self, context: Context, scenario: dict) -> dict:
        """Run a what-if scenario"""
        
        try:
            context.append_log(f"[{self.name}] Running simulation with scenario: {scenario}")
            
            # Get original data
            original_data = context.get("data")
            cluster_assignments = context.get("cluster_assignments")
            model = context.get("model")
            scaler = context.get("scaler")
            features = context.get("features")
            k = context.get("k_value")
            
            # Validate required data
            if original_data is None or cluster_assignments is None or model is None or k is None:
                raise ValueError("Missing required data for simulation. Ensure analysis was run successfully.")
            
            # Select only required features
            if features:
                data_working = original_data[features].copy()
            else:
                data_working = original_data.copy()
            
            # Apply scenario modifications to original data
            if "feature_adjustments" in scenario:
                for feature, adjustment in scenario["feature_adjustments"].items():
                    if feature in data_working.columns:
                        data_working[feature] = data_working[feature] * (1 + adjustment / 100.0)
            
            # Scale the modified data using the same scaler
            if scaler:
                data_simulated_scaled = scaler.transform(data_working)
            else:
                data_simulated_scaled = data_working.values
            
            # Re-run segmentation on simulated data
            kmeans_sim = KMeans(
                n_clusters=k,
                random_state=42,
                n_init=10,
                max_iter=300
            )
            
            clusters_sim = kmeans_sim.fit_predict(data_simulated_scaled)
            
            # Get original inertia
            original_inertia = model.inertia_ if hasattr(model, 'inertia_') else None
            
            # Compare results
            comparison = {
                "original_clusters": cluster_assignments.tolist() if hasattr(cluster_assignments, 'tolist') else list(cluster_assignments),
                "simulated_clusters": clusters_sim.tolist(),
                "original_silhouette": context.get("score"),
                "original_inertia": original_inertia,
                "simulated_inertia": kmeans_sim.inertia_,
                "scenario": scenario
            }
            
            log_msg = f"[{self.name}] Simulation complete"
            if original_inertia is not None:
                log_msg += f" - Inertia: Original={original_inertia:.4f}, Simulated={kmeans_sim.inertia_:.4f}"
            context.append_log(log_msg)
            
            return comparison
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Simulation error: {str(e)}")
            raise
