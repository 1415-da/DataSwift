#!/usr/bin/env python3
"""
Test frontend upload and analyze functionality
"""

import requests
import pandas as pd
import io
import time

def test_frontend_upload_analyze():
    backend_url = "http://localhost:8000"
    frontend_url = "http://localhost:3000"
    
    print("Testing frontend upload and analyze workflow...")
    
    # Create a test CSV file
    df = pd.DataFrame({
        'feature1': [1, 2, 3, 4, 5],
        'feature2': ['A', 'B', 'A', 'B', 'A'],
        'target': [0, 1, 0, 1, 0]
    })
    
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    print("1. Testing backend upload...")
    files = {'file': ('test_data.csv', csv_buffer, 'text/csv')}
    response = requests.post(f"{backend_url}/api/data/upload", files=files)
    
    if response.status_code == 200:
        data = response.json()
        dataset_id = data.get('dataset_id')
        print(f"✅ Backend upload successful - Dataset ID: {dataset_id}")
        
        print("2. Testing backend analyze...")
        analyze_response = requests.get(f"{backend_url}/api/data/analyze?dataset_id={dataset_id}")
        
        if analyze_response.status_code == 200:
            analyze_data = analyze_response.json()
            print("✅ Backend analyze successful")
            print(f"   - Columns: {list(analyze_data.get('dtypes', {}).keys())}")
            print(f"   - Missing values: {analyze_data.get('missing', {})}")
            
            print("3. Testing frontend API routes...")
            # Test frontend analyze route
            frontend_analyze_response = requests.get(f"{frontend_url}/api/data/analyze?dataset_id={dataset_id}")
            
            if frontend_analyze_response.status_code == 200:
                print("✅ Frontend analyze route working")
            else:
                print(f"❌ Frontend analyze route failed: {frontend_analyze_response.text}")
            
            print("4. Testing frontend data page...")
            # Test if the frontend data page loads
            try:
                frontend_page_response = requests.get(f"{frontend_url}/dashboard/data")
                if frontend_page_response.status_code == 200:
                    print("✅ Frontend data page accessible")
                else:
                    print(f"❌ Frontend data page failed: {frontend_page_response.status_code}")
            except requests.exceptions.ConnectionError:
                print("⚠️  Frontend server not running (expected if not started)")
            
            return True
        else:
            print(f"❌ Backend analyze failed: {analyze_response.text}")
            return False
    else:
        print(f"❌ Backend upload failed: {response.text}")
        return False

if __name__ == "__main__":
    test_frontend_upload_analyze() 