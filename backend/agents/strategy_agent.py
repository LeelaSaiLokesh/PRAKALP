"""
Strategy Agent - Recommends business strategies based on insights using LLM
"""

from backend.utils.context import Context
from backend.utils.llm_utils import OllamaModelDetector, LLMPrompts


class StrategyAgent:
    """
    ROLE: Recommend actionable business strategies based on insights
    INPUT: Insights, domain, goal
    OUTPUT: Strategic recommendations
    LOG: Strategy generation process
    """
    
    def __init__(self):
        self.name = "Strategy Agent"
    
    def generate_strategy_heuristic(self, domain: str, goal: str) -> str:
        """Fallback: Generate strategic recommendations tailored to goal"""
        
        goal_lower = goal.lower()
        domain_lower = domain.lower()
        
        strategy = "Strategic Recommendations:\n\n"
        
        # Goal-based strategies
        if any(word in goal_lower for word in ['segment', 'cluster', 'group', 'profile']):
            strategy += "Segmentation Strategy:\n"
            strategy += "1. Build detailed profiles for each segment\n"
            strategy += "2. Understand unique needs of each cluster\n"
            strategy += "3. Develop cluster-specific solutions\n"
            strategy += "4. Monitor segment evolution over time\n"
        
        elif any(word in goal_lower for word in ['marketing', 'campaign', 'promotion']):
            if "ecommerce" in domain_lower:
                strategy += "E-commerce Marketing Strategy:\n"
                strategy += "1. Create personalized email campaigns per cluster\n"
                strategy += "2. Optimize product recommendations by segment\n"
                strategy += "3. Implement dynamic pricing based on cluster value\n"
                strategy += "4. Design loyalty programs for high-value segments\n"
            else:
                strategy += "Marketing Campaign Strategy:\n"
                strategy += "1. Tailor messaging for each segment\n"
                strategy += "2. Allocate budget proportional to segment value\n"
                strategy += "3. Track ROI by cluster\n"
                strategy += "4. Refine targeting based on performance\n"
        
        elif any(word in goal_lower for word in ['convert', 'conversion', 'sales', 'revenue']):
            strategy += "Revenue Optimization Strategy:\n"
            strategy += "1. Focus initial efforts on highest-value clusters\n"
            strategy += "2. Identify conversion barriers per segment\n"
            strategy += "3. Test interventions with pilot groups first\n"
            strategy += "4. Scale successful strategies to full clusters\n"
        
        elif any(word in goal_lower for word in ['retention', 'churn', 'loyalty']):
            strategy += "Customer Retention Strategy:\n"
            strategy += "1. Identify at-risk segments proactively\n"
            strategy += "2. Implement retention programs per cluster\n"
            strategy += "3. Increase engagement for low-activity groups\n"
            strategy += "4. Build loyalty through personalized rewards\n"
        
        elif any(word in goal_lower for word in ['risk', 'fraud', 'anomaly']):
            strategy += "Risk Management Strategy:\n"
            strategy += "1. Monitor high-risk clusters intensively\n"
            strategy += "2. Implement preventive controls per segment\n"
            strategy += "3. Build early warning systems for each cluster\n"
            strategy += "4. Adjust risk tolerance per cluster\n"
        
        elif "healthcare" in domain_lower:
            strategy += "Healthcare Management Strategy:\n"
            strategy += "1. Allocate specialist resources to high-risk groups\n"
            strategy += "2. Implement preventive care for at-risk segments\n"
            strategy += "3. Customize treatment protocols per cluster\n"
            strategy += "4. Monitor outcomes and adjust interventions\n"
        
        elif "education" in domain_lower:
            strategy += "Educational Excellence Strategy:\n"
            strategy += "1. Design advanced curriculum for high performers\n"
            strategy += "2. Provide targeted support for at-risk students\n"
            strategy += "3. Allocate tutoring resources strategically\n"
            strategy += "4. Track progress and adjust support levels\n"
        
        else:
            strategy += "Cluster-Based Strategy:\n"
            strategy += "1. Develop cluster-specific action plans\n"
            strategy += "2. Allocate resources based on cluster characteristics\n"
            strategy += "3. Monitor performance metrics per cluster\n"
            strategy += "4. Continuously optimize strategies\n"
        
        return strategy
    
    def execute(self, context: Context):
        """Generate strategy"""
        
        try:
            insights = context.get("insights")
            domain = context.get("domain")
            goal = context.get("goal")
            
            # Try LLM approach
            llm = OllamaModelDetector.get_llm(context.get("selected_model"))
            
            if llm:
                try:
                    prompt = LLMPrompts.STRATEGY_RECOMMENDATION
                    response = llm(prompt.format(
                        domain=domain,
                        insights=insights if insights else "No detailed insights",
                        goal=goal
                    ))
                    
                    strategy = response.strip()
                    context.set("strategy", strategy)
                    context.append_log(f"[{self.name}] LLM-generated strategy: {strategy[:300]}...")
                    
                except Exception as e:
                    context.append_log(f"[{self.name}] LLM generation failed: {str(e)}, using heuristic")
                    strategy = self.generate_strategy_heuristic(domain, goal)
                    context.set("strategy", strategy)
            else:
                # Fallback to heuristic
                strategy = self.generate_strategy_heuristic(domain, goal)
                context.set("strategy", strategy)
                context.append_log(f"[{self.name}] Heuristic strategy generated (no LLM available)")
            
            context.append_log(f"[{self.name}] ✓ Strategy generation complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
