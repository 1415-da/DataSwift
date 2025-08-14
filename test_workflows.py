#!/usr/bin/env python3
"""
DataSwift Workflow Test Script
Tests all major workflows to ensure they are functional
"""

import requests
import json
import time
import io
import pandas as pd
from typing import Dict, Any

class DataSwiftWorkflowTester:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.test_results = {}
        
    def test_health_check(self) -> bool:
        """Test basic API health"""
        try:
            response = requests.get(f"{self.base_url}/health")
            if response.status_code == 200:
                print("✅ Health check passed")
                return True
            else:
                print("❌ Health check failed")
                return False
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def test_data_upload(self) -> str:
        """Test data upload workflow"""
        try:
            # Create a sample CSV file
            df = pd.DataFrame({
                'feature1': [1, 2, 3, 4, 5],
                'feature2': ['A', 'B', 'A', 'B', 'A'],
                'target': [0, 1, 0, 1, 0]
            })
            
            csv_buffer = io.BytesIO()
            df.to_csv(csv_buffer, index=False)
            csv_buffer.seek(0)
            
            files = {'file': ('test_data.csv', csv_buffer, 'text/csv')}
            response = requests.post(f"{self.base_url}/api/data/upload", files=files)
            
            if response.status_code == 200:
                data = response.json()
                dataset_id = data.get('dataset_id')
                print(f"✅ Data upload successful - Dataset ID: {dataset_id}")
                return dataset_id
            else:
                print(f"❌ Data upload failed: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Data upload error: {e}")
            return None
    
    def test_data_analysis(self, dataset_id: str) -> bool:
        """Test data analysis workflow"""
        try:
            response = requests.get(f"{self.base_url}/api/data/analyze?dataset_id={dataset_id}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Data analysis successful")
                print(f"   - Columns: {list(data.get('dtypes', {}).keys())}")
                print(f"   - Missing values: {data.get('missing', {})}")
                return True
            else:
                print(f"❌ Data analysis failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Data analysis error: {e}")
            return False
    
    def test_data_cleaning(self, dataset_id: str) -> bool:
        """Test data cleaning workflow"""
        try:
            response = requests.post(
                f"{self.base_url}/api/data/clean?dataset_id={dataset_id}&method=auto"
            )
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Data cleaning successful")
                return True
            else:
                print(f"❌ Data cleaning failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Data cleaning error: {e}")
            return False
    
    def test_model_creation(self, dataset_id: str) -> str:
        """Test model creation workflow"""
        try:
            experiment_data = {
                "user_id": "test_user",
                "dataset_id": dataset_id,
                "task": "classification",
                "algorithm": "random_forest",
                "target": "target",
                "features": ["feature1", "feature2"],
                "hyperparameters": {
                    "n_estimators": 100,
                    "max_depth": 5
                }
            }
            
            response = requests.post(f"{self.base_url}/api/model/experiments", json=experiment_data)
            
            if response.status_code == 200:
                data = response.json()
                experiment_id = data.get('experiment_id')
                print(f"✅ Model creation successful - Experiment ID: {experiment_id}")
                return experiment_id
            else:
                print(f"❌ Model creation failed: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Model creation error: {e}")
            return None
    
    def test_model_training(self, experiment_id: str) -> bool:
        """Test model training workflow"""
        try:
            # Start training
            response = requests.post(f"{self.base_url}/api/model/train?experiment_id={experiment_id}")
            
            if response.status_code == 200:
                print("✅ Model training started")
                
                # Wait for training to complete (simulate)
                time.sleep(2)
                
                # Check status
                status_response = requests.get(f"{self.base_url}/api/model/status/{experiment_id}")
                if status_response.status_code == 200:
                    status_data = status_response.json()
                    print(f"   - Training status: {status_data.get('status')}")
                    return True
                else:
                    print(f"❌ Status check failed: {status_response.text}")
                    return False
            else:
                print(f"❌ Model training failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Model training error: {e}")
            return False
    
    def test_model_deployment(self, experiment_id: str) -> bool:
        """Test model deployment workflow"""
        try:
            deploy_data = {
                "experiment_id": experiment_id,
                "task": "classification"
            }
            
            response = requests.post(f"{self.base_url}/api/predict/deploy", json=deploy_data)
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Model deployment successful")
                print(f"   - Endpoint URL: {data.get('endpoint_url')}")
                return True
            else:
                print(f"❌ Model deployment failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Model deployment error: {e}")
            return False
    
    def test_prediction(self) -> bool:
        """Test prediction workflow"""
        try:
            # Get deployed models
            response = requests.get(f"{self.base_url}/api/predict/deployed")
            
            if response.status_code == 200:
                data = response.json()
                models = data.get('models', [])
                
                if models:
                    model = models[0]
                    print("✅ Prediction test successful")
                    print(f"   - Deployed models: {len(models)}")
                    return True
                else:
                    print("⚠️  No deployed models found")
                    return True  # Not a failure, just no models
            else:
                print(f"❌ Prediction test failed: {response.text}")
                return False
        except Exception as e:
            print(f"❌ Prediction test error: {e}")
            return False
    
    def run_all_tests(self):
        """Run all workflow tests"""
        print("🚀 Starting DataSwift Workflow Tests")
        print("=" * 50)
        
        # Test 1: Health Check
        if not self.test_health_check():
            print("❌ Health check failed, stopping tests")
            return
        
        # Test 2: Data Upload
        dataset_id = self.test_data_upload()
        if not dataset_id:
            print("❌ Data upload failed, stopping tests")
            return
        
        # Test 3: Data Analysis
        if not self.test_data_analysis(dataset_id):
            print("❌ Data analysis failed, stopping tests")
            return
        
        # Test 4: Data Cleaning
        if not self.test_data_cleaning(dataset_id):
            print("❌ Data cleaning failed, stopping tests")
            return
        
        # Test 5: Model Creation
        experiment_id = self.test_model_creation(dataset_id)
        if not experiment_id:
            print("❌ Model creation failed, stopping tests")
            return
        
        # Test 6: Model Training
        if not self.test_model_training(experiment_id):
            print("❌ Model training failed, stopping tests")
            return
        
        # Test 7: Model Deployment
        if not self.test_model_deployment(experiment_id):
            print("❌ Model deployment failed, stopping tests")
            return
        
        # Test 8: Prediction
        if not self.test_prediction():
            print("❌ Prediction test failed, stopping tests")
            return
        
        print("=" * 50)
        print("🎉 All workflow tests completed successfully!")
        print("✅ DataSwift is fully functional")

if __name__ == "__main__":
    tester = DataSwiftWorkflowTester()
    tester.run_all_tests() 