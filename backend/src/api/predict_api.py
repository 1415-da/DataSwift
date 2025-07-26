from fastapi import APIRouter, HTTPException, UploadFile, File, Body
from typing import Dict, Any, List
from ..models.db import db, USE_MONGO
from bson import ObjectId
import json

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
async def predict_with_file(file: UploadFile = File(...), model_id: str = Body(...)):
    """Make predictions using a deployed model"""
    try:
        # Mock predictions for demonstration
        predictions = [
            {
                "input": {"feature1": 1.0, "feature2": 2.0, "feature3": 3.0},
                "prediction": 1,
                "probability": 0.85
            },
            {
                "input": {"feature1": 2.0, "feature2": 3.0, "feature3": 4.0},
                "prediction": 0,
                "probability": 0.15
            },
            {
                "input": {"feature1": 3.0, "feature2": 4.0, "feature3": 5.0},
                "prediction": 1,
                "probability": 0.92
            }
        ]
        
        actual_values = [1, 0, 1]  # Mock actual values for confusion matrix

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

        mock_predictions = [
            {"input": {"feature1": 1.0, "feature2": 2.0}, "prediction": 0.85},
            {"input": {"feature1": 2.0, "feature2": 3.0}, "prediction": 0.92},
            {"input": {"feature1": 3.0, "feature2": 4.0}, "prediction": 0.78}
        ]

        return {"success": True, "predictions": mock_predictions}
    except Exception as e:
        return {"success": False, "error": str(e)} 