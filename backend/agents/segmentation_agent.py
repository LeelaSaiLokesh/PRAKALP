"""
Segmentation Agent - Performs K-means clustering on preprocessed data
"""

from sklearn.cluster import KMeans
import numpy as np
from backend.utils.context import Context
from backend.utils.cluster_naming import ClusterNaming


class SegmentationAgent:
    """
    ROLE: Perform clustering/segmentation on data
    INPUT: Preprocessed data, k value
    OUTPUT: Cluster assignments and model
    LOG: Clustering process and model details
    """
    
    def __init__(self):
        self.name = "Segmentation Agent"
    
    def execute(self, context: Context):
        """Perform segmentation"""
        
        try:
            data = context.get("data")
            k = context.get("k_value", 3)
            
            context.append_log(f"[{self.name}] Starting K-means clustering with k={k}")
            
            # Perform K-means
            kmeans = KMeans(
                n_clusters=k,
                random_state=42,
                n_init=10,
                max_iter=300
            )
            
            clusters = kmeans.fit_predict(data)
            
            # Store results
            context.set("model", kmeans)
            context.set("cluster_assignments", clusters)
            
            # Generate meaningful cluster names based on domain
            domain = context.get("domain", "E-commerce")
            cluster_names = ClusterNaming.get_cluster_names(domain, k)
            context.set("cluster_names", cluster_names)
            
            # Create clusters dictionary mapping cluster_id -> indices
            clusters_dict = {}
            for i in range(k):
                cluster_indices = np.where(clusters == i)[0].tolist()
                clusters_dict[str(i)] = cluster_indices
            
            context.set("clusters", clusters_dict)
            
            # Log cluster statistics with meaningful names
            cluster_sizes = {}
            for i in range(k):
                size = len(clusters_dict[str(i)])
                cluster_name = cluster_names.get(str(i), f"Cluster {i}")
                cluster_sizes[cluster_name] = int(size)
            
            context.append_log(f"[{self.name}] Cluster distribution: {cluster_sizes}")
            context.append_log(f"[{self.name}] Inertia: {kmeans.inertia_:.4f}")
            context.append_log(f"[{self.name}] ✓ Segmentation complete with {k} clusters")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
