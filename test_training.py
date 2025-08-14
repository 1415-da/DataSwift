#!/usr/bin/env python3
"""
Test model training functionality
"""

import requests
import pandas as pd
import io
import time

def test_model_training():
    base_url = "http://localhost:8000"
    
    print("Testing model training workflow...")
    
    # 1. Create a test dataset
    print("1. Creating test dataset...")
    df = pd.DataFrame({
        'feature1': [1, 2, 3, 4, 5],
        'feature2': [2, 4, 6, 8, 10],
        'target': [0, 1, 0, 1, 0]
    })
    
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    files = {'file': ('test_data.csv', csv_buffer, 'text/csv')}
    upload_response = requests.post(f"{base_url}/api/data/upload", files=files)
    
    if upload_response.status_code == 200:
        upload_data = upload_response.json()
        dataset_id = upload_data.get('dataset_id')
        print(f"✅ Dataset created - ID: {dataset_id}")
        
        # 2. Create an experiment
        print("2. Creating experiment...")
        experiment_payload = {
            "user_id": "test_user",
            "dataset_id": dataset_id,
            "config": {
                "task": "classification",
                "algorithm": "random_forest",
                "hyperparams": {
                    "n_estimators": 100,
                    "max_depth": 5
                },
                "target": "target",
                "features": ["feature1", "feature2"],
                "metrics": ["accuracy", "f1"]
            },
            "created_at": "2024-01-01T00:00:00Z"
        }
        
        experiment_response = requests.post(f"{base_url}/api/model/experiments", json=experiment_payload)
        
        if experiment_response.status_code == 200:
            experiment_data = experiment_response.json()
            experiment_id = experiment_data.get('experiment_id')
            print(f"✅ Experiment created - ID: {experiment_id}")
            
            # 3. Start training
            print("3. Starting training...")
            train_response = requests.post(f"{base_url}/api/model/train?experiment_id={experiment_id}")
            
            if train_response.status_code == 200:
                train_data = train_response.json()
                print(f"✅ Training started - Status: {train_data.get('status')}")
                
                # 4. Check training status
                print("4. Checking training status...")
                for i in range(5):  # Check status 5 times
                    time.sleep(2)
                    status_response = requests.get(f"{base_url}/api/model/status/{experiment_id}")
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        status = status_data.get('status')
                        print(f"   Status: {status}")
                        
                        if status == 'complete':
                            print("✅ Training completed successfully!")
                            
                            # 5. Get results
                            print("5. Getting training results...")
                            results_response = requests.get(f"{base_url}/api/model/results/{experiment_id}")
                            if results_response.status_code == 200:
                                results_data = results_response.json()
                                print(f"✅ Results: {results_data}")
                            else:
                                print(f"❌ Failed to get results: {results_response.text}")
                            break
                        elif status == 'failed':
                            print("❌ Training failed")
                            break
                    else:
                        print(f"❌ Failed to get status: {status_response.text}")
                        break
                
                return True
            else:
                print(f"❌ Training failed: {train_response.text}")
                return False
        else:
            print(f"❌ Experiment creation failed: {experiment_response.text}")
            return False
    else:
        print(f"❌ Dataset creation failed: {upload_response.text}")
        return False

if __name__ == "__main__":
    test_model_training() 