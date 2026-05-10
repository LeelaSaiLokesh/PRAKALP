"""
Goal Translation Agent - Converts business goal to domain and objective
"""

from backend.utils.context import Context
from backend.utils.llm_utils import OllamaModelDetector, LLMPrompts


class GoalTranslationAgent:
    """
    ROLE: Translate business goal to domain inference and objective formulation
    INPUT: Goal string and columns
    OUTPUT: Inferred domain and structured objective
    LOG: Domain detection and goal parsing
    """
    
    def __init__(self):
        self.name = "Goal Translation Agent"
    
    def infer_domain_heuristic(self, goal: str, columns: list) -> str:
        """Heuristic domain inference - always returns one of the three main domains"""
        
        goal_lower = goal.lower()
        columns_lower = [c.lower() for c in columns]
        combined_text = goal_lower + ' ' + ' '.join(columns_lower)
        
        # Define specific column keywords for each domain
        domains = {
            "E-commerce": {
                "goal_keywords": ['product', 'customer', 'purchase', 'order', 'sales', 'revenue', 'price', 'category', 'shopping', 'buyer', 'retail', 'invoice', 'stock', 'ecommerce'],
                "column_keywords": ['invoiceno', 'stockcode', 'description', 'quantity', 'invoicedate', 'unitprice', 'customerid', 'country', 'product_category', 'order_value', 'purchase_frequency', 'customer_lifetime_value', 'annual_income']
            },
            "Healthcare": {
                "goal_keywords": ['patient', 'disease', 'health', 'medical', 'treatment', 'diagnosis', 'hospital', 'clinical', 'symptom', 'therapy', 'health condition', 'healthcare'],
                "column_keywords": ['age', 'sex', 'bmi', 'charges', 'smoker', 'region', 'patient_id', 'disease', 'diagnosis', 'treatment', 'symptom', 'blood', 'pressure', 'heartrate', 'medical']
            },
            "Education": {
                "goal_keywords": ['student', 'learning', 'course', 'grade', 'education', 'school', 'university', 'academic', 'performance', 'exam', 'score', 'teacher', 'study'],
                "column_keywords": ['school', 'pstatus', 'medu', 'fedu', 'mjob', 'fjob', 'studytime', 'failures', 'famsup', 'higher', 'internet', 'g1', 'g2', 'g3', 'student_id', 'gpa', 'coursework']
            }
        }
        
        # Score each domain based on keyword matches
        domain_scores = {}
        for domain_name, keywords_info in domains.items():
            score = 0
            
            # Check goal keywords (weight: 2)
            goal_matches = sum(2 for kw in keywords_info['goal_keywords'] if kw in goal_lower)
            
            # Check column keywords (weight: 3 for exact matches)
            column_matches = sum(3 for kw in keywords_info['column_keywords'] if any(kw in col for col in columns_lower))
            
            score = goal_matches + column_matches
            domain_scores[domain_name] = score
        
        # Get the domain with the highest score
        best_domain = max(domain_scores, key=domain_scores.get)
        
        # If the best domain has 0 score, use logic to pick closest
        if domain_scores[best_domain] == 0:
            # Count how many columns are numeric vs categorical indicators
            numeric_indicators = sum(1 for col in columns_lower if any(x in col for x in ['age', 'bmi', 'charges', 'price', 'quantity']))
            text_indicators = sum(1 for col in columns_lower if any(x in col for x in ['description', 'category', 'status', 'school']))
            
            if text_indicators > 2:
                best_domain = "Education"
            elif numeric_indicators > 5:
                best_domain = "Healthcare"
            else:
                best_domain = "E-commerce"
        
        return best_domain
    
    def execute(self, context: Context):
        """Translate goal to domain"""
        
        try:
            goal = context.get("goal")
            columns = context.get("columns")
            
            # Try LLM approach first
            llm = OllamaModelDetector.get_llm(context.get("selected_model"))
            
            if llm:
                try:
                    prompt = LLMPrompts.DOMAIN_INFERENCE
                    response = llm(prompt.format(goal=goal, columns=str(columns)))
                    domain = response.strip().split('\n')[0]
                    context.append_log(f"[{self.name}] Domain detected (LLM): {domain}")
                except Exception as e:
                    context.append_log(f"[{self.name}] LLM inference failed, using heuristic: {str(e)}")
                    domain = self.infer_domain_heuristic(goal, columns)
            else:
                # Fallback to heuristic
                domain = self.infer_domain_heuristic(goal, columns)
                context.append_log(f"[{self.name}] Domain detected (heuristic): {domain}")
            
            context.set("domain", domain)
            context.set("objective", f"Segmentation for {domain} domain - {goal}")
            
            context.append_log(f"[{self.name}] Goal: {goal}")
            context.append_log(f"[{self.name}] Objective: {context.get('objective')}")
            context.append_log(f"[{self.name}] ✓ Goal translation complete")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
