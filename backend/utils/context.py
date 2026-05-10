"""
Context Manager - Shared state for all agents
"""

class Context:
    """Shared context dictionary for multi-agent communication"""
    
    def __init__(self):
        self.data = {
            "goal": "",
            "domain": "",
            "columns": [],
            "data": None,
            "features": [],
            "objective": "",
            "clusters": None,
            "model": None,
            "score": None,
            "retry": False,
            "insights": None,
            "strategy": None,
            "anomalies": None,
            "logs": [],
            "selected_model": None,
            "feature_reasoning": "",
            "k_value": 3,
            "preprocessing_steps": []
        }
    
    def get(self, key, default=None):
        """Get value from context"""
        return self.data.get(key, default)
    
    def set(self, key, value):
        """Set value in context"""
        self.data[key] = value
    
    def append_log(self, message):
        """Append a log message"""
        self.data["logs"].append(message)
    
    def get_logs(self):
        """Get all logs"""
        return self.data["logs"]
    
    def to_dict(self):
        """Convert context to dictionary"""
        # Create a copy that excludes the actual data object for JSON serialization
        result = self.data.copy()
        if result.get("data") is not None:
            result["data"] = "DataFrame loaded"
        if result.get("model") is not None:
            result["model"] = "Model trained"
        # Don't convert clusters - it's already a proper dict of lists
        # if result.get("clusters") is not None and hasattr(result["clusters"], 'shape'):
        #     result["clusters"] = f"Array shape: {result['clusters'].shape}"
        return result
