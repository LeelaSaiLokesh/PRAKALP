"""
Orchestrator Agent - Orchestrates the entire multi-agent workflow
"""

from backend.utils.context import Context


class OrchestratorAgent:
    """
    ROLE: Master controller that orchestrates all other agents
    INPUT: Initial context with goal and dataset file path
    OUTPUT: Final context with complete analysis
    LOG: Workflow progress and decisions
    """
    
    def __init__(self):
        self.name = "Orchestrator Agent"
    
    def execute(self, context: Context):
        """Execute the complete workflow"""
        
        context.append_log(f"[{self.name}] ✓ Workflow started")
        
        # Import all agents here to avoid circular imports
        from backend.agents.context_understanding_agent import ContextUnderstandingAgent
        from backend.agents.goal_translation_agent import GoalTranslationAgent
        from backend.agents.feature_selection_agent import FeatureSelectionAgent
        from backend.agents.data_agent import DataAgent
        from backend.agents.segmentation_agent import SegmentationAgent
        from backend.agents.evaluation_agent import EvaluationAgent
        from backend.agents.anomaly_detection_agent import AnomalyDetectionAgent
        from backend.agents.insight_agent import InsightAgent
        from backend.agents.strategy_agent import StrategyAgent
        from backend.agents.simulation_agent import SimulationAgent
        from backend.agents.prediction_agent import PredictionAgent
        
        try:
            # Stage 1: Understand and prepare data
            context.append_log(f"[{self.name}] Stage 1: Data Understanding")
            ContextUnderstandingAgent().execute(context)
            GoalTranslationAgent().execute(context)
            
            # Stage 2: Prepare features
            context.append_log(f"[{self.name}] Stage 2: Feature Engineering")
            FeatureSelectionAgent().execute(context)
            DataAgent().execute(context)
            
            # Stage 3: Segmentation with retry loop
            context.append_log(f"[{self.name}] Stage 3: Segmentation with Evaluation Loop")
            max_retries = 3
            for attempt in range(max_retries):
                context.set("retry", False)
                context.set("k_value", 3 + attempt)
                
                context.append_log(f"[{self.name}] Attempt {attempt + 1}: k={context.get('k_value')}")
                SegmentationAgent().execute(context)
                EvaluationAgent().execute(context)
                
                if not context.get("retry"):
                    context.append_log(f"[{self.name}] ✓ Segmentation successful with k={context.get('k_value')}")
                    break
            
            # Stage 4: Anomaly and insights
            context.append_log(f"[{self.name}] Stage 4: Analysis & Insights")
            AnomalyDetectionAgent().execute(context)
            InsightAgent().execute(context)
            StrategyAgent().execute(context)
            
            # Stage 5: Advanced analytics
            context.append_log(f"[{self.name}] Stage 5: Simulation & Prediction Ready")
            SimulationAgent().execute(context)
            PredictionAgent().execute(context)
            
            context.append_log(f"[{self.name}] ✓ Workflow completed successfully")
            return context
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
