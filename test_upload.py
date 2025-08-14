#!/usr/bin/env python3
"""
Simple test for upload and analyze workflow
"""

import requests
import pandas as pd
import io

def test_upload_and_analyze():
    base_url = "http://localhost:8000"
    
    # Create a test CSV file
    df = pd.DataFrame({
        'feature1': [1, 2, 3, 4, 5],
        'feature2': ['A', 'B', 'A', 'B', 'A'],
        'target': [0, 1, 0, 1, 0]
    })
    
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    print("Testing upload...")
    files = {'file': ('test_data.csv', csv_buffer, 'text/csv')}
    response = requests.post(f"{base_url}/api/data/upload", files=files)
    
    if response.status_code == 200:
        data = response.json()
        dataset_id = data.get('dataset_id')
        print(f"✅ Upload successful - Dataset ID: {dataset_id}")
        
        print("Testing analyze...")
        analyze_response = requests.get(f"{base_url}/api/data/analyze?dataset_id={dataset_id}")
        
        if analyze_response.status_code == 200:
            analyze_data = analyze_response.json()
            print("✅ Analyze successful")
            print(f"   - Columns: {list(analyze_data.get('dtypes', {}).keys())}")
            print(f"   - Missing values: {analyze_data.get('missing', {})}")
            return True
        else:
            print(f"❌ Analyze failed: {analyze_response.text}")
            return False
    else:
        print(f"❌ Upload failed: {response.text}")
        return False

if __name__ == "__main__":
    test_upload_and_analyze() 