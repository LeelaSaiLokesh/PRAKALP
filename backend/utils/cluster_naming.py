"""
Cluster Naming Utility - Generates meaningful cluster names based on domain and characteristics
"""


class ClusterNaming:
    """Generate meaningful cluster names based on domain"""
    
    # E-commerce segment names
    ECOMMERCE_NAMES = [
        "Premium Customers",
        "Budget Shoppers", 
        "Casual Buyers",
        "Loyal Regulars",
        "Sporadic Visitors"
    ]
    
    # Healthcare segment names
    HEALTHCARE_NAMES = [
        "High-Risk Group",
        "Medium-Risk Group",
        "Low-Risk Group",
        "Chronic Condition Group",
        "Preventive Care Group"
    ]
    
    # Education segment names
    EDUCATION_NAMES = [
        "High Performers",
        "Average Performers",
        "At-Risk Students",
        "Struggling Learners",
        "Advanced Learners"
    ]
    
    @staticmethod
    def get_cluster_names(domain: str, num_clusters: int) -> dict:
        """
        Get meaningful cluster names for a domain
        
        Args:
            domain: The domain (E-commerce, Healthcare, Education)
            num_clusters: Number of clusters
            
        Returns:
            Dictionary mapping cluster IDs to names
        """
        
        if domain.lower() == "e-commerce":
            names = ClusterNaming.ECOMMERCE_NAMES
        elif domain.lower() == "healthcare":
            names = ClusterNaming.HEALTHCARE_NAMES
        elif domain.lower() == "education":
            names = ClusterNaming.EDUCATION_NAMES
        else:
            # Fallback generic names
            names = [f"Segment {i}" for i in range(num_clusters)]
        
        # Create mapping from cluster ID to name
        cluster_names = {}
        for i in range(num_clusters):
            if i < len(names):
                cluster_names[str(i)] = names[i]
            else:
                cluster_names[str(i)] = f"{names[0].split()[0]} Group {i+1}"
        
        return cluster_names
