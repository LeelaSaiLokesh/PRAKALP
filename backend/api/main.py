"""
FastAPI Server - Main application endpoints
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import tempfile
import os
from typing import Optional, Dict, Any
import json
import numpy as np
import pandas as pd


# Helper function to make objects JSON-serializable
def safe_serialization(obj):
    """Convert non-serializable objects to JSON-safe formats"""
    if obj is None:
        return None
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.DataFrame):
        return obj.to_dict(orient='records')
    elif isinstance(obj, (np.integer, np.floating)):
        return obj.item()
    elif isinstance(obj, dict):
        return {k: safe_serialization(v) for k, v in obj.items()}
    elif isinstance(obj, (list, tuple)):
        return [safe_serialization(item) for item in obj]
    elif hasattr(obj, '__dict__'):
        # Skip sklearn models and other complex objects
        return str(type(obj).__name__)
    else:
        return obj


from backend.utils.context import Context
from backend.utils.llm_utils import OllamaModelDetector
from backend.agents.orchestrator_agent import OrchestratorAgent
from backend.agents.simulation_agent import SimulationAgent
from backend.agents.prediction_agent import PredictionAgent
class RunAnalysisRequest(BaseModel):
    goal: str
    selected_model: Optional[str] = None


class PredictRequest(BaseModel):
    features: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None


class SimulateRequest(BaseModel):
    adjustments: Dict[str, Any]
    context: Optional[Dict[str, Any]] = None


class SimulationResult(BaseModel):
    original_clusters: list
    simulated_clusters: list
    original_silhouette: float
    simulated_inertia: float
    scenario: Dict[str, Any]


class PredictionResult(BaseModel):
    cluster: int
    confidence: float
    distance_to_center: float
    cluster_size: int
    cluster_percentage: float
    domain: str
    explanation: str


# Initialize FastAPI app
app = FastAPI(
    title="Goal-Driven Multi-Agent Intelligence System",
    description="Multi-agent system for automated segmentation and analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global context storage
global_context = None
orchestrator = OrchestratorAgent()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Goal-Driven Multi-Agent Intelligence System",
        "version": "1.0.0",
        "endpoints": {
            "/run-analysis": "POST - Run full analysis pipeline",
            "/predict": "POST - Predict cluster for new data",
            "/simulate": "POST - Run what-if simulation",
            "/status": "GET - Get current analysis status",
            "/logs": "GET - Get agent logs"
        }
    }


@app.post("/api/run-analysis")
async def run_analysis(csv_file: UploadFile = File(...), request_data: Optional[str] = None):
    """
    Run full multi-agent analysis pipeline
    
    Parameters:
    - csv_file: CSV file containing the dataset
    - request_data: JSON string with goal and optional selected_model
    
    Returns:
    - Analysis results and agent logs
    """
    
    global global_context
    
    try:
        # Parse request data
        if request_data:
            req = json.loads(request_data)
        else:
            req = {"goal": "Segment and analyze data"}
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
            content = await csv_file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        try:
            # Initialize context
            global_context = Context()
            global_context.set("csv_path", tmp_path)
            global_context.set("goal", req.get("goal", "Segment and analyze data"))
            global_context.set("selected_model", req.get("selected_model"))
            
            # Detect Ollama models if not specified
            if global_context.get("selected_model") is None:
                available_models = OllamaModelDetector.get_available_models()
                selected_model = OllamaModelDetector.select_best_model(available_models)
                global_context.set("selected_model", selected_model)
                global_context.append_log(f"[API] Detected model: {selected_model}")
            
            # Run orchestrator
            global_context = orchestrator.execute(global_context)
            
            # Return results with safe serialization
            context_dict = global_context.to_dict()
            safe_context = safe_serialization(context_dict)
            
            return {
                "status": "success",
                "message": "Analysis completed successfully",
                "results": safe_context,
                "logs": global_context.get_logs()
            }
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
                
    except Exception as e:
        return {
            "status": "error",
            "message": f"Analysis failed: {str(e)}",
            "logs": global_context.get_logs() if global_context else []
        }


@app.post("/api/predict")
async def predict(request: PredictRequest):
    """
    Predict cluster assignment for new data point
    
    Parameters:
    - features: Dictionary with feature values
    - context: Optional context information
    
    Returns:
    - Cluster assignment with confidence and explanation
    """
    
    global global_context
    
    try:
        if global_context is None:
            raise HTTPException(status_code=400, detail="No analysis results available. Run /run-analysis first.")
        
        if not global_context.get("prediction_ready"):
            raise HTTPException(status_code=400, detail="Prediction module not ready")
        
        # Get prediction agent and make prediction
        prediction_agent = PredictionAgent()
        result = prediction_agent.predict(global_context, request.features)
        
        return {"status": "success", **result}
        
    except HTTPException:
        raise
    except Exception as e:
        return {"status": "error", "error": f"Prediction failed: {str(e)}"}


@app.post("/api/simulate")
async def simulate(request: SimulateRequest):
    """
    Run what-if simulation scenario
    
    Parameters:
    - adjustments: Dictionary with feature adjustments (percentage changes)
    - context: Optional context information
    
    Returns:
    - Comparison of original vs simulated clusterings
    """
    
    global global_context
    
    try:
        if global_context is None:
            raise HTTPException(status_code=400, detail="No analysis results available. Run /run-analysis first.")
        
        if not global_context.get("simulation_ready"):
            raise HTTPException(status_code=400, detail="Simulation module not ready")
        
        # Convert adjustments to scenario format
        scenario = {"feature_adjustments": request.adjustments}
        
        # Get simulation agent and run scenario
        simulation_agent = SimulationAgent()
        result = simulation_agent.run_simulation(global_context, scenario)
        
        # Calculate cluster distribution from simulated clusters
        cluster_distribution = {}
        cluster_names = global_context.get("cluster_names", {})
        for cluster_id in set(result.get("simulated_clusters", [])):
            count = result["simulated_clusters"].count(cluster_id)
            cluster_name = cluster_names.get(str(cluster_id), f"Cluster {cluster_id}")
            cluster_distribution[cluster_name] = count
        
        return {
            "status": "success",
            "simulation_result": {
                "cluster_distribution": cluster_distribution,
                "impact_summary": f"Simulation adjusted {len(request.adjustments)} features",
                "recommendations": "Monitor clusters for behavior changes."
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        return {"status": "error", "error": f"Simulation failed: {str(e)}"}


@app.get("/api/status")
async def status():
    """Get current analysis status"""
    
    global global_context
    
    if global_context is None:
        return {
            "status": "idle",
            "message": "No analysis running",
            "context": None
        }
    
    return {
        "status": "completed",
        "message": "Analysis completed",
        "context": global_context.to_dict(),
        "prediction_ready": True,
        "simulation_ready": True
    }


@app.get("/api/logs")
async def logs():
    """Get all agent logs"""
    
    global global_context
    
    if global_context is None:
        return {"logs": []}
    
    return {"logs": global_context.get_logs()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
