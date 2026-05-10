"""
LLM Utility - Ollama model detection and LangChain integration
"""

import subprocess
import os
from typing import Optional
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate

class OllamaModelDetector:
    """Detect and manage Ollama models"""
    
    PREFERRED_MODELS = ["llama3", "mistral", "phi3"]
    
    @staticmethod
    def get_available_models() -> list:
        """Get list of available Ollama models"""
        try:
            result = subprocess.run(
                ["ollama", "list"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                models = []
                for line in lines[1:]:  # Skip header
                    if line.strip():
                        model_name = line.split()[0]
                        models.append(model_name)
                return models
            return []
        except Exception as e:
            print(f"Error detecting Ollama models: {e}")
            return []
    
    @staticmethod
    def select_best_model(available_models: list) -> Optional[str]:
        """Select the best available model based on preference order"""
        for preferred in OllamaModelDetector.PREFERRED_MODELS:
            for model in available_models:
                if preferred in model.lower():
                    return model
        
        # If none of the preferred models found, return the first available
        return available_models[0] if available_models else None
    
    @staticmethod
    def get_llm(model_name: Optional[str] = None) -> Optional[Ollama]:
        """Get configured LLM instance"""
        if model_name is None:
            available_models = OllamaModelDetector.get_available_models()
            model_name = OllamaModelDetector.select_best_model(available_models)
        
        if model_name:
            try:
                return Ollama(model=model_name)
            except Exception as e:
                print(f"Error initializing Ollama: {e}")
                return None
        
        print("No Ollama models found. Please install a model: ollama pull llama3")
        return None


class LLMPrompts:
    """Pre-defined LLM prompts for different agents"""
    
    DOMAIN_INFERENCE = PromptTemplate(
        input_variables=["goal", "columns"],
        template="""Based on the given goal and dataset columns, determine the business domain.

Goal: {goal}
Dataset columns: {columns}

Respond with exactly one of: E-commerce, Healthcare, Education, Finance, Manufacturing, Other

Domain:"""
    )
    
    FEATURE_SELECTION = PromptTemplate(
        input_variables=["columns", "goal", "domain"],
        template="""As a data science expert, select the most relevant features for achieving this goal.

Dataset columns: {columns}
Goal: {goal}
Domain: {domain}

Provide a comma-separated list of selected features and briefly explain why, considering:
1. Relevance to the goal
2. Data quality and completeness
3. Feature importance in the domain

Selected features: """
    )
    
    INSIGHT_GENERATION = PromptTemplate(
        input_variables=["domain", "clusters", "goal"],
        template="""Analyze these segmentation results and provide key insights.

Domain: {domain}
Goal: {goal}
Number of segments: {clusters}

Provide 3-5 actionable insights about the segments discovered."""
    )
    
    STRATEGY_RECOMMENDATION = PromptTemplate(
        input_variables=["domain", "insights", "goal"],
        template="""Based on these insights, recommend a business strategy.

Domain: {domain}
Goal: {goal}
Insights:
{insights}

Provide a concise, actionable strategy (2-3 sentences)."""
    )
