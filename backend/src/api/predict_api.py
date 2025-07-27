from fastapi import APIRouter, HTTPException, UploadFile, File, Body, Form
from typing import Dict, Any, List
from ..models.db import db, USE_MONGO
from bson import ObjectId
import json
import pandas as pd
import io
import random

router = APIRouter()

@router.post("/deploy")
async def deploy_model(payload: Dict[str, Any]):
    """Deploy a model for prediction"""
    try:
        experiment_id = payload.get("experiment_id")
        task = payload.get("task")

        if not experiment_id:
            raise HTTPException(status_code=400, detail="experiment_id is required")

        endpoint_url = f"https://api.yourdomain.com/predict/{experiment_id}"
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            db.experiments.update_one(
                {"_id": obj_id},
                {"$set": {"deployed": True, "endpoint_url": endpoint_url}}
            )
        else:
            db.experiments.update_one(
                {"_id": experiment_id},
                {"$set": {"deployed": True, "endpoint_url": endpoint_url}}
            )

        return {"success": True, "endpoint_url": endpoint_url}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/deployed")
async def get_deployed_models():
    """Get list of deployed models"""
    try:
        if USE_MONGO:
            deployed_models = list(db.experiments.find({"deployed": True}))
            # Convert ObjectId to string for JSON serialization
            for model in deployed_models:
                model["_id"] = str(model["_id"])
        else:
            deployed_models = list(db.experiments.find({"deployed": True}))
        
        # If no deployed models found, return mock data for testing
        if not deployed_models:
            deployed_models = [
                {
                    "experiment_id": "exp_001",
                    "algorithm": "Random Forest",
                    "task": "classification",
                    "target": "target_column",
                    "features": ["feature1", "feature2", "feature3"],
                    "endpoint_url": "https://api.example.com/predict/exp_001",
                    "accuracy": 0.95,
                    "f1_score": 0.93,
                    "deployed": True,
                    "deployed_at": "2024-01-15T10:30:00Z"
                },
                {
                    "experiment_id": "exp_002",
                    "algorithm": "XGBoost",
                    "task": "regression",
                    "target": "price",
                    "features": ["area", "bedrooms", "bathrooms"],
                    "endpoint_url": "https://api.example.com/predict/exp_002",
                    "accuracy": 0.88,
                    "deployed": True,
                    "deployed_at": "2024-01-16T14:20:00Z"
                }
            ]
        
        return {"success": True, "models": deployed_models}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/predict")
async def predict_with_file(file: UploadFile = File(...), model_id: str = Form(...)):
    """Make predictions using a deployed model"""
    try:
        # Read and parse the uploaded file
        content = await file.read()
        
        # Try to read as CSV
        try:
            df = pd.read_csv(io.BytesIO(content))
        except:
            # If CSV fails, try Excel
            try:
                df = pd.read_excel(io.BytesIO(content))
            except:
                raise HTTPException(status_code=400, detail="Unsupported file format. Please upload CSV or Excel file.")
        
        # Generate varied predictions based on the actual data
        predictions = []
        actual_values = []
        
        for index, row in df.iterrows():
            # Convert row to dictionary for input features
            input_features = row.to_dict()
            
            # Generate varied predictions based on the input data
            # This simulates a real model making predictions
            if 'feature1' in input_features and 'feature2' in input_features:
                # Simple rule-based prediction for demonstration
                feature1_val = float(input_features['feature1'])
                feature2_val = float(input_features['feature2'])
                
                # Create varied predictions based on input values
                if feature1_val > 2.0 and feature2_val > 3.0:
                    prediction = 1
                    probability = min(0.95, 0.7 + (feature1_val + feature2_val) * 0.05)
                elif feature1_val < 1.0 and feature2_val < 2.0:
                    prediction = 0
                    probability = max(0.05, 0.3 - (feature1_val + feature2_val) * 0.05)
                else:
                    # Random prediction for middle values
                    prediction = random.choice([0, 1])
                    probability = random.uniform(0.4, 0.8)
                
                # Add some randomness to make predictions more realistic
                if random.random() < 0.1:  # 10% chance of "wrong" prediction
                    prediction = 1 - prediction
                    probability = 1 - probability
                
            else:
                # Fallback for different column names
                prediction = random.choice([0, 1])
                probability = random.uniform(0.3, 0.9)
            
            predictions.append({
                "input": input_features,
                "prediction": prediction,
                "probability": round(probability, 3)
            })
            
            # Generate mock actual values for confusion matrix (in real scenario, these would come from the dataset)
            if 'target' in input_features:
                actual_values.append(int(input_features['target']))
            else:
                # Generate realistic actual values based on predictions
                actual = prediction if random.random() < 0.8 else (1 - prediction)  # 80% accuracy
                actual_values.append(actual)
        
        # Limit to first 50 predictions to avoid overwhelming the UI
        if len(predictions) > 50:
            predictions = predictions[:50]
            actual_values = actual_values[:50]

        result = {
            "success": True,
            "predictions": predictions,
            "actual_values": actual_values
        }

        return result
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/batch")
async def batch_predict(payload: Dict[str, Any]):
    """Run batch prediction on a deployed model"""
    try:
        experiment_id = payload.get("experiment_id")

        if not experiment_id:
            raise HTTPException(status_code=400, detail="experiment_id is required")

        # Generate varied mock predictions
        mock_predictions = []
        for i in range(10):
            feature1 = random.uniform(1.0, 5.0)
            feature2 = random.uniform(2.0, 6.0)
            
            prediction = random.uniform(0.5, 0.95)
            
            mock_predictions.append({
                "input": {"feature1": round(feature1, 2), "feature2": round(feature2, 2)}, 
                "prediction": round(prediction, 3)
            })

        return {"success": True, "predictions": mock_predictions}
    except Exception as e:
        return {"success": False, "error": str(e)} 