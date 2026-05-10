# PRAKALP - Deployment Guide

## Quick Start Commands

### Windows PowerShell

#### 1. Environment Setup

```powershell
cd E:\PRAKALP

# Activate virtual environment
.\prakalp_env\Scripts\Activate.ps1

# Verify installation
python --version
pip list
```

#### 2. Start Backend

```powershell
# In terminal 1
cd E:\PRAKALP
.\prakalp_env\Scripts\Activate.ps1
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Test Backend:**
```
curl http://localhost:8000/
# or open in browser: http://localhost:8000/docs
```

#### 3. Start Frontend

```powershell
# In terminal 2
cd E:\PRAKALP\frontend

# First time only:
npm install

# Start development server
npm start
```

**Expected Output:**
```
webpack compiled with X warnings
Compiled successfully!

Local:   http://localhost:3000
```

---

### Linux / macOS

```bash
cd /path/to/PRAKALP

# Activate
source prakalp_env/bin/activate

# Backend (terminal 1)
python -m uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (terminal 2)
cd frontend
npm install
npm start
```

---

## API Testing

### Using cURL

```bash
# 1. Analyze data
curl -X POST "http://localhost:8000/run-analysis" \
  -F "csv_file=@data/ecommerce_data.csv" \
  -F "request_data={\"goal\": \"Segment customers by value\"}"

# 2. Predict
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"data": {"age": 35, "annual_income": 75000, "purchase_frequency": 20, "avg_order_value": 100, "customer_lifetime_value": 5000, "account_age_months": 24, "reviews_count": 15, "return_rate": 0.05}}'

# 3. Simulate
curl -X POST "http://localhost:8000/simulate" \
  -H "Content-Type: application/json" \
  -d '{"scenario": {"feature_adjustments": {"purchase_frequency": 0.2}}}'

# 4. Get status
curl http://localhost:8000/status

# 5. Get logs
curl http://localhost:8000/logs
```

### Using Postman

1. Import collection from API docs: `http://localhost:8000/docs`
2. Test endpoints in order: run-analysis → predict → simulate

---

## Python Testing

### Test Backend Directly

```python
import sys
sys.path.insert(0, 'E:\\PRAKALP')

from backend.utils.context import Context
from backend.agents.orchestrator_agent import OrchestratorAgent
from backend.utils.llm_utils import OllamaModelDetector

# Initialize
context = Context()
context.set("csv_path", "data/ecommerce_data.csv")
context.set("goal", "Segment customers for marketing")

# Detect model
available_models = OllamaModelDetector.get_available_models()
context.set("selected_model", OllamaModelDetector.select_best_model(available_models))

# Run
orchestrator = OrchestratorAgent()
result_context = orchestrator.execute(context)

# Print results
print("Domain:", result_context.get("domain"))
print("Silhouette Score:", result_context.get("score"))
print("Logs:", result_context.get_logs())
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                  # macOS/Linux

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Module Not Found

```bash
# Reinstall dependencies
pip install -r requirements.txt

# Or specific package
pip install fastapi uvicorn pandas scikit-learn
```

### Ollama Connection Failed

```bash
# Check if Ollama is running
ollama list

# If not installed
# Visit: https://ollama.ai/download

# Download a model
ollama pull llama3

# The system automatically uses heuristic
# fallback if LLM is unavailable
```

### npm install Issues

```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## File Locations

- Sample Data: `E:\PRAKALP\data\ecommerce_data.csv`
- Backend Code: `E:\PRAKALP\backend\`
- Frontend Code: `E:\PRAKALP\frontend\src\`
- Requirements: `E:\PRAKALP\requirements.txt`
- This Guide: `E:\PRAKALP\GUIDE.md`
- Main API: `E:\PRAKALP\backend\api\main.py`

---

## Environment Variables

### Frontend (.env in frontend/ directory)

```
REACT_APP_API_URL=http://localhost:8000
```

### Backend (.env in root or use defaults)

```
# Optional - uses Ollama autodetection by default
LLM_MODEL=llama3
OLLAMA_HOST=http://localhost:11434
```

---

## Performance Tips

1. **Use llama3 model** for best reasoning (if available)
2. **Increase chunk size** for large datasets (adjust in data_agent.py)
3. **Cache LLM responses** for repeated goals
4. **Use GPU acceleration** if available (set in LLM config)

---

## Advanced Configuration

### Change Evaluation Threshold

File: `backend/agents/evaluation_agent.py`

```python
self.score_threshold = 0.45  # Change to 0.50, 0.60, etc.
```

### Change Domain Heuristics

File: `backend/agents/goal_translation_agent.py`

Edit the `infer_domain_heuristic()` method to add custom logic.

### Add New Feature

File: `backend/agents/feature_selection_agent.py`

Modify `select_features_heuristic()` or improve LLM prompts.

---

## Production Deployment

### Docker

```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Gunicorn (Python ASGI)

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 backend.api.main:app
```

### Nginx (Reverse Proxy)

```nginx
upstream backend {
    server localhost:8000;
}

server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
    }
}
```

---

## Monitoring

### Check Backend Health

```bash
curl http://localhost:8000/status
```

### Monitor Memory Usage

```bash
# Windows
Get-Process python

# Linux
ps aux | grep python
```

### View Real-time Logs

```bash
# Terminal with Uvicorn running shows all requests
# Check frontend browser console for errors
```

---

## Data Privacy Checklist

- ✅ No data persisted to disk (only temp files)
- ✅ No external API calls except local Ollama
- ✅ No user tracking
- ✅ No analytics sent
- ✅ All processing local to machine
- ✅ Temp files deleted after analysis

---

## Next Steps

1. Start the system using commands above
2. Upload `data/ecommerce_data.csv` in browser
3. Enter goal: "Segment customers for targeted marketing"
4. Wait for analysis completion (~10-20 seconds)
5. Explore dashboard, predictions, and simulations
6. Read logs to understand agent execution

---

**Questions?** Check README.md for detailed documentation.
