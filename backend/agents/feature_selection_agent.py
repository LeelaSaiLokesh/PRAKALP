"""
Feature Selection Agent - Uses LLM reasoning to select relevant features
"""

from backend.utils.context import Context
from backend.utils.llm_utils import OllamaModelDetector, LLMPrompts


class FeatureSelectionAgent:
    """
    ROLE: Select most relevant features using LLM reasoning
    INPUT: Columns, goal, domain
    OUTPUT: Selected features list and reasoning explanation
    LOG: Feature selection process and LLM output
    """
    
    def __init__(self):
        self.name = "Feature Selection Agent"
    
    def select_features_heuristic(self, columns: list, goal: str, domain: str = "") -> list:
        """Fallback: Select features based on goal, domain, and column characteristics"""
        
        goal_lower = goal.lower()
        domain_lower = domain.lower()
        selected = []
        
        # Remove obvious non-feature columns
        exclude_keywords = ['id', 'time', 'date', 'index', 'unnamed']
        candidates = [col for col in columns if not any(keyword in col.lower() for keyword in exclude_keywords)]
        
        # Goal-based feature prioritization
        if any(word in goal_lower for word in ['segment', 'cluster', 'group', 'profile']):
            # For segmentation: prioritize demographic/behavioral features
            priority_keywords = ['age', 'income', 'frequency', 'value', 'engagement', 'score', 'rate', 'bmi', 'charges']
            for keyword in priority_keywords:
                selected.extend([col for col in candidates if keyword in col.lower() and col not in selected])
        
        elif any(word in goal_lower for word in ['predict', 'forecast', 'classify']):
            # For prediction: include all numeric features
            selected = candidates.copy()
        
        elif any(word in goal_lower for word in ['marketing', 'campaign', 'promotion', 'convert', 'retention']):
            # For marketing: prioritize purchase and engagement metrics
            marketing_keywords = ['purchase', 'frequency', 'value', 'engagement', 'lifetime', 'income', 'category', 'reviews']
            for keyword in marketing_keywords:
                selected.extend([col for col in candidates if keyword in col.lower() and col not in selected])
        
        elif any(word in goal_lower for word in ['health', 'risk', 'treatment', 'disease', 'diagnosis']):
            # For healthcare: prioritize clinical indicators
            health_keywords = ['age', 'bmi', 'charges', 'smoker', 'region', 'disease', 'diagnosis', 'symptom', 'pressure']
            for keyword in health_keywords:
                selected.extend([col for col in candidates if keyword in col.lower() and col not in selected])
        
        elif any(word in goal_lower for word in ['performance', 'grade', 'score', 'learning', 'student', 'exam']):
            # For education: prioritize academic metrics
            education_keywords = ['g1', 'g2', 'g3', 'school', 'medu', 'fedu', 'studytime', 'failures', 'gpa']
            for keyword in education_keywords:
                selected.extend([col for col in candidates if keyword in col.lower() and col not in selected])
        
        # If no specific goal matched or too few selected, use domain heuristic
        if len(selected) < 3:
            if 'ecommerce' in domain_lower:
                selected = [col for col in candidates if any(kw in col.lower() for kw in ['customer', 'purchase', 'order', 'product', 'price', 'income', 'value'])]
            elif 'healthcare' in domain_lower:
                selected = [col for col in candidates if any(kw in col.lower() for kw in ['age', 'bmi', 'charges', 'smoker', 'disease'])]
            elif 'education' in domain_lower:
                selected = [col for col in candidates if any(kw in col.lower() for kw in ['g1', 'g2', 'g3', 'medu', 'fedu', 'studytime'])]
        
        # If still too few, return all candidates
        if len(selected) < 3:
            selected = candidates[:max(3, len(candidates))]
        
        return selected
    
    def execute(self, context: Context):
        """Select features using LLM"""
        
        try:
            columns = context.get("columns")
            goal = context.get("goal")
            domain = context.get("domain")
            
            # Try LLM approach
            llm = OllamaModelDetector.get_llm(context.get("selected_model"))
            
            if llm:
                try:
                    prompt = LLMPrompts.FEATURE_SELECTION
                    response = llm(prompt.format(
                        columns=str(columns),
                        goal=goal,
                        domain=domain
                    ))
                    
                    # Parse LLM response
                    lines = response.strip().split('\n')
                    feature_line = lines[0]
                    
                    # Extract feature names
                    features = [f.strip() for f in feature_line.split(',')]
                    # Validate that features exist in columns
                    features = [f for f in features if f in columns]
                    
                    if not features:
                        raise ValueError("No valid features extracted from LLM response")
                    
                    context.set("features", features)
                    context.set("feature_reasoning", response)
                    context.append_log(f"[{self.name}] LLM-selected features: {features}")
                    context.append_log(f"[{self.name}] Reasoning: {response[:200]}...")
                    
                except Exception as e:
                    context.append_log(f"[{self.name}] LLM selection failed: {str(e)}, using heuristic")
                    features = self.select_features_heuristic(columns, goal, domain)
                    context.set("features", features)
                    context.set("feature_reasoning", "Heuristic-based selection")
            else:
                # Fallback to heuristic
                features = self.select_features_heuristic(columns, goal, domain)
                context.set("features", features)
                context.set("feature_reasoning", "Heuristic-based selection (no LLM available)")
                context.append_log(f"[{self.name}] Heuristic-selected features: {features}")
            
            context.append_log(f"[{self.name}] ✓ Feature selection complete ({len(features)} features)")
            
        except Exception as e:
            context.append_log(f"[{self.name}] ✗ Error: {str(e)}")
            raise
