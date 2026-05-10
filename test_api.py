"""
API Test Cases - Test the system with actual requests
"""

import requests
import json

# API Base URL
BASE_URL = "http://localhost:8000"


def test_basic_endpoint():
    """Test root endpoint"""
    print("\n=== Test 1: Root Endpoint ===")
    response = requests.get(f"{BASE_URL}/")
    print(response.json())


def test_get_status():
    """Check system status"""
    print("\n=== Test 2: Get Status ===")
    response = requests.get(f"{BASE_URL}/status")
    print(json.dumps(response.json(), indent=2))


def test_get_logs():
    """Get agent logs"""
    print("\n=== Test 3: Get Logs ===")
    response = requests.get(f"{BASE_URL}/logs")
    logs = response.json()
    print(f"Total logs: {len(logs.get('logs', []))}")
    if logs.get('logs'):
        for log in logs['logs'][:5]:
            print(f"  {log}")


def test_run_analysis():
    """Run full analysis on example dataset"""
    print("\n=== Test 4: Run Analysis ===")
    
    # Prepare file and data
    files = {
        'csv_file': open('data/ecommerce_data.csv', 'rb')
    }
    data = {
        'request_data': json.dumps({
            "goal": "Segment customers for targeted marketing campaigns",
            "selected_model": None  # Auto-detect
        })
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/run-analysis",
            files=files,
            data=data,
            timeout=60
        )
        
        result = response.json()
        print(f"Status: {result['status']}")
        print(f"Message: {result['message']}")
        
        # Print key results
        if 'results' in result:
            r = result['results']
            print(f"\nResults Summary:")
            print(f"  Domain: {r.get('domain')}")
            print(f"  Features Count: {len(r.get('features', []))}")
            print(f"  Silhouette Score: {r.get('score', 'N/A')}")
            print(f"  K Value: {r.get('k_value')}")
        
        # Print sample logs
        print(f"\nLogs (first 5):")
        for log in result.get('logs', [])[:5]:
            print(f"  {log}")
            
    except requests.exceptions.Timeout:
        print("Request timed out - analysis took too long or backend is not responding")
    except FileNotFoundError:
        print("CSV file not found at 'data/ecommerce_data.csv'")
    except Exception as e:
        print(f"Error: {e}")


def test_predict():
    """Test prediction endpoint"""
    print("\n=== Test 5: Predict Cluster ===")
    
    # Sample new customer data
    customer_data = {
        "age": 35,
        "annual_income": 75000,
        "purchase_frequency": 25,
        "avg_order_value": 150.50,
        "product_category": "Electronics",
        "customer_lifetime_value": 5000,
        "account_age_months": 24,
        "reviews_count": 12,
        "return_rate": 0.05,
        "email_engagement": "High"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json={"data": customer_data}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Cluster: {result['cluster']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print(f"Distance to center: {result['distance_to_center']:.4f}")
            print(f"Cluster size: {result['cluster_size']} customers ({result['cluster_percentage']:.1f}%)")
            print(f"Explanation: {result['explanation']}")
        else:
            print(f"Error {response.status_code}: {response.json()}")
            
    except Exception as e:
        print(f"Error: {e}")


def test_simulate():
    """Test simulation endpoint"""
    print("\n=== Test 6: Run Simulation ===")
    
    # Define scenario
    scenario = {
        "feature_adjustments": {
            "purchase_frequency": 0.2,  # +20%
            "annual_income": 0.15,       # +15%
            "customer_lifetime_value": 0.25  # +25%
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/simulate",
            json={"scenario": scenario}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"Original Inertia: {result['original_inertia']:.2f}")
            print(f"Simulated Inertia: {result['simulated_inertia']:.2f}")
            
            # Calculate impact
            if result['original_inertia']:
                impact = ((result['simulated_inertia'] - result['original_inertia']) / 
                         result['original_inertia']) * 100
                print(f"Impact: {impact:+.1f}%")
            
            print(f"Original clusters: {len(set(result['original_clusters']))} clusters")
            print(f"Simulated clusters: {len(set(result['simulated_clusters']))} clusters")
        else:
            print(f"Error {response.status_code}: {response.json()}")
            
    except Exception as e:
        print(f"Error: {e}")


def test_api_docs():
    """Print how to access API documentation"""
    print("\n=== API Documentation ===")
    print(f"Swagger UI: {BASE_URL}/docs")
    print(f"ReDoc: {BASE_URL}/redoc")
    print(f"OpenAPI JSON: {BASE_URL}/openapi.json")


if __name__ == "__main__":
    print("=" * 60)
    print("PRAKALP - Multi-Agent AI System Test Suite")
    print("=" * 60)
    
    # Test sequence
    try:
        test_basic_endpoint()
        test_get_status()
        test_get_logs()
        
        # Main analysis
        test_run_analysis()
        
        # After analysis is complete
        test_get_status()
        test_predict()
        test_simulate()
        
    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Cannot connect to backend!")
        print("Make sure the API is running:")
        print("  python -m uvicorn backend.api.main:app --reload")
    
    finally:
        test_api_docs()
        print("\n" + "=" * 60)
        print("Test completed!")
        print("=" * 60)
