"""
Insight Agent - Generates business insights from clustering results using LLM
"""

from backend.utils.context import Context
from backend.utils.llm_utils import OllamaModelDetector, LLMPrompts


class InsightAgent:
    """
    ROLE: Generate actionable business insights from segmentation results
    INPUT: Domain, clusters count, goal
    OUTPUT: Key insights and interpretations
    LOG: Insight generation process
    """
    
    def __init__(self):
        self.name = "Insight Agent"
    
    def generate_insights_heuristic(self, domain: str, num_clusters: int, goal: str) -> str:
        """Fallback: Generate insights tailored to the goal and domain"""
        
        goal_lower = goal.lower()
        domain_lower = domain.lower()
        
        insights = ""
        
        # Goal-specific insight generation
        if any(word in goal_lower for word in ['segment', 'cluster', 'group']):
            insights += f"✓ Data successfully segmented into {num_clusters} distinct clusters.\n\n"
            insights += f"Key Insights:\n"
            insights += f"1. Each cluster represents a unique group with distinct characteristics\n"
            insights += f"2. Cluster patterns enable targeted strategies for each segment\n"
            insights += f"3. Resource allocation should prioritize largest segments\n"
            insights += f"4. Further analysis recommended for actionable recommendations\n"
        
        elif any(word in goal_lower for word in ['marketing', 'campaign', 'promotion', 'convert', 'retention']):
            insights += f"✓ Customer segmentation revealed {num_clusters} distinct groups.\n\n"
            insights += f"Marketing Insights:\n"
            insights += f"1. Tailor messaging for each segment's unique needs\n"
            insights += f"2. Different clusters show varying engagement patterns\n"
            insights += f"3. High-value segments should receive premium treatment\n"
            insights += f"4. Implement personalized campaigns per cluster\n"
        
        elif any(word in goal_lower for word in ['predict', 'forecast', 'classify']):
            insights += f"✓ Predictive segmentation identified {num_clusters} clusters.\n\n"
            insights += f"Prediction Insights:\n"
            insights += f"1. New customers can be assigned to clusters automatically\n"
            insights += f"2. Cluster membership predicts customer behaviors\n"
            insights += f"3. Assign new data points to nearest cluster for prediction\n"
            insights += f"4. Monitor cluster boundaries for evolving patterns\n"
        
        elif 'healthcare' in domain_lower:
            insights += f"✓ Patient segmentation identified {num_clusters} distinct groups.\n\n"
            insights += f"Clinical Insights:\n"
            insights += f"1. High-risk group requires intensive care coordination\n"
            insights += f"2. Medium-risk patients need preventive interventions\n"
            insights += f"3. Low-risk group responds to standard care protocols\n"
            insights += f"4. Customize treatment plans for each patient cluster\n"
        
        elif 'education' in domain_lower:
            insights += f"✓ Student analysis identified {num_clusters} performance clusters.\n\n"
            insights += f"Academic Insights:\n"
            insights += f"1. High performers need advanced curriculum tracks\n"
            insights += f"2. Average performers benefit from standard instruction\n"
            insights += f"3. At-risk students require targeted intervention programs\n"
            insights += f"4. Allocate tutoring resources to struggling segments\n"
        
        else:
            insights += f"✓ Data successfully segmented into {num_clusters} clusters.\n\n"
            insights += f"Key Observations:\n"
            insights += f"1. Distinct clusters support {goal.lower()}\n"
            insights += f"2. Each cluster has unique characteristics and patterns\n"
            insights += f"3. Cluster analysis reveals actionable segments\n"
            insights += f"4. Further investigation recommended for each segment\n"
        
        return insights
    
    def execute(self, context: Context):
        """Generate insights"""
        
        try:
            domain = context.get("domain")
            clusters = context.get("clusters")
            goal = context.get("goal")
            score = context.get("score")
            
            num_clusters = len(set(clusters)) if clusters is not None else 0
            
            # Try LLM approach
            llm = OllamaModelDetector.get_llm(context.get("selected_model"))
            
            if llm:
                try:
                    prompt = LLMPrompts.INSIGHT_GENERATION
                    response = llm(prompt.format(
                        domain=domain,
                        clusters=num_clusters,
                        goal=goal
                    ))
                    
                    insights = response.strip()
                    context.set("insights", insights)
                    context.append_log(f"[{self.name}] LLM-generated insights (first 300 chars): {insights[:300]}...")
                    
                except Exception as e:
                    context.append_log(f"[{self.name}] LLM generation failed: {str(e)}, using heuristic")
                    insights = self.generate_insights_heuristic(domain, num_clusters, goal)
                    context.set("insights", insights)
            else:
                # Fallback to heuristic
                insights = self.generate_insights_heuristic(domain, num_clusters, goal)
                context.set("insights", insights)
                context.append_log(f"[{self.name}] Heuristic insights generated (no LLM available)")
            
            context.append_log(f"[{self.name}] Silhouette Score: {score:.4f}")
            context.append_log(f"[{self.name}] ✓ Insight generation complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
