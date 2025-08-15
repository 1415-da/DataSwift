from fastapi import APIRouter, HTTPException, UploadFile, File, Body, Form
from fastapi.responses import FileResponse
from typing import List, Dict, Any
from ..models.db import db, USE_MONGO
import os
import pandas as pd # For batch predict demo
import time # For training demo
import pickle
from ..services.eda_service import EDAService, DATASETS
from bson import ObjectId
import json
import io
import random
import math

router = APIRouter()

def clean_nans(obj):
    if isinstance(obj, float) and (math.isnan(obj) or math.isinf(obj)):
        return None
    elif isinstance(obj, dict):
        return {k: clean_nans(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_nans(x) for x in obj]
    else:
        return obj





@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a dataset"""
    try:
        # Read file content
        content = await file.read()
        
        # Upload to EDA service
        dataset_id = EDAService.upload_dataset(content, file.filename)
        
        return {
            "success": True,
            "dataset_id": dataset_id,
            "filename": file.filename
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/experiments")
async def create_experiment(payload: Dict[str, Any]):
    """Create a new model training experiment"""
    try:
        user_id = payload.get("user_id")
        dataset_id = payload.get("dataset_id")
        config = payload.get("config", {})
        
        if not user_id or not dataset_id:
            raise HTTPException(status_code=400, detail="user_id and dataset_id are required")
        
        # Generate experiment ID
        experiment_id = str(ObjectId()) if USE_MONGO else f"exp_{random.randint(1000, 9999)}"
        
        # Create experiment record
        experiment = {
            "experiment_id": experiment_id,
            "user_id": user_id,
            "dataset_id": dataset_id,
            "config": config,
            "status": "queued",
            "created_at": payload.get("created_at", pd.Timestamp.now().isoformat()),
            "metrics": {},
            "deployed": False
        }
        
        # Store in database
        if USE_MONGO:
            db.experiments.insert_one(experiment)
        else:
            db.experiments.insert_one(experiment)
        
        return {"success": True, "experiment_id": experiment_id}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/experiments")
async def get_experiments(user_id: str, dataset_id: str = None):
    """Get experiments for a user"""
    try:
        query = {"user_id": user_id}
        if dataset_id:
            query["dataset_id"] = dataset_id
        
        if USE_MONGO:
            experiments = list(db.experiments.find(query))
            # Convert ObjectId to string
            for exp in experiments:
                exp["_id"] = str(exp["_id"])
        else:
            experiments = list(db.experiments.find(query))
        
        return {"success": True, "experiments": experiments}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/experiments/{experiment_id}")
async def delete_experiment(experiment_id: str):
    try:
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
            db.experiments.delete_one({"_id": obj_id})
        else:
            db.experiments.delete_one({"_id": experiment_id})
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

@router.post("/train")
async def train_model(payload: Dict[str, Any]):
    """Start model training"""
    try:
        experiment_id = payload.get("experiment_id")
        
        if not experiment_id:
            raise HTTPException(status_code=400, detail="experiment_id is required")
        
        # First, find the experiment to get its MongoDB _id
        experiment = None
        if USE_MONGO:
            # Try to find by experiment_id first
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
            if not experiment:
                # If not found, try by _id (in case experiment_id is actually the MongoDB _id)
                try:
                    obj_id = ObjectId(experiment_id)
                    experiment = db.experiments.find_one({"_id": obj_id})
                except:
                    pass
        else:
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
        
        if not experiment:
            print(f"ERROR: Could not find experiment {experiment_id}")
            return {"success": False, "error": "Experiment not found"}
        
        print(f"Found experiment: {experiment}")
        
        # Update experiment status to training
        if USE_MONGO:
            # Use the _id from the found experiment
            obj_id = experiment["_id"]
            result = db.experiments.update_one(
                {"_id": obj_id},
                {"$set": {"status": "training"}}
            )
            print(f"Updated status to training: {result.modified_count} documents modified")
        else:
            result = db.experiments.update_one(
                {"experiment_id": experiment_id},
                {"$set": {"status": "training"}}
            )
            print(f"Updated status to training: {result.modified_count} documents modified")
        
        # Simulate training completion with mock results
        task = experiment.get("config", {}).get("task", "classification")
        
        mock_metrics = {}
        if task == "classification":
            mock_metrics = {
                "accuracy": round(random.uniform(0.75, 0.95), 3),
                "f1_score": round(random.uniform(0.70, 0.93), 3),
                "precision": round(random.uniform(0.72, 0.94), 3),
                "recall": round(random.uniform(0.68, 0.92), 3)
            }
        elif task == "regression":
            mock_metrics = {
                "rmse": round(random.uniform(0.1, 0.5), 3),
                "mae": round(random.uniform(0.08, 0.4), 3),
                "r2": round(random.uniform(0.6, 0.9), 3)
            }
        elif task == "clustering":
            mock_metrics = {
                "silhouette_score": round(random.uniform(0.3, 0.8), 3),
                "davies_bouldin": round(random.uniform(0.5, 2.0), 3)
            }
        
        # Update experiment with completed status and metrics
        if USE_MONGO:
            result = db.experiments.update_one(
                {"_id": obj_id},
                {"$set": {
                    "status": "complete",
                    "metrics": mock_metrics
                }}
            )
            print(f"MongoDB update result: {result.modified_count} documents modified")
        else:
            result = db.experiments.update_one(
                {"experiment_id": experiment_id},
                {"$set": {
                    "status": "complete",
                    "metrics": mock_metrics
                }}
            )
            print(f"Non-MongoDB update result: {result.modified_count} documents modified")
        
        print(f"Training completed for experiment {experiment_id}: status=complete, metrics={mock_metrics}")
        
        # Verify the update worked
        if USE_MONGO:
            updated_exp = db.experiments.find_one({"_id": obj_id})
        else:
            updated_exp = db.experiments.find_one({"experiment_id": experiment_id})
        
        if updated_exp:
            print(f"Verification - Updated experiment status: {updated_exp.get('status')}, metrics: {updated_exp.get('metrics')}")
        else:
            print(f"ERROR: Could not find updated experiment {experiment_id}")
        
        return {"success": True, "status": "training_completed"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/status/{experiment_id}")
async def get_training_status(experiment_id: str):
    """Get training status for an experiment"""
    try:
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
            experiment = db.experiments.find_one({"_id": obj_id})
        else:
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
        
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
        
        if USE_MONGO:
            experiment["_id"] = str(experiment["_id"])
        
        return {"success": True, "experiment": experiment}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/results/{experiment_id}")
async def get_training_results(experiment_id: str):
    """Get training results for an experiment"""
    try:
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
            experiment = db.experiments.find_one({"_id": obj_id})
        else:
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
        
        if not experiment:
            raise HTTPException(status_code=404, detail="Experiment not found")
        
        if USE_MONGO:
            experiment["_id"] = str(experiment["_id"])
        
        # Generate mock results for demonstration
        config = experiment.get("config", {})
        task = config.get("task", "classification")
        
        mock_metrics = {}
        if task == "classification":
            mock_metrics = {
                "accuracy": round(random.uniform(0.75, 0.95), 3),
                "f1_score": round(random.uniform(0.70, 0.93), 3),
                "precision": round(random.uniform(0.72, 0.94), 3),
                "recall": round(random.uniform(0.68, 0.92), 3)
            }
        elif task == "regression":
            mock_metrics = {
                "rmse": round(random.uniform(0.1, 0.5), 3),
                "mae": round(random.uniform(0.08, 0.4), 3),
                "r2": round(random.uniform(0.6, 0.9), 3)
            }
        elif task == "clustering":
            mock_metrics = {
                "silhouette_score": round(random.uniform(0.3, 0.8), 3),
                "davies_bouldin": round(random.uniform(0.5, 2.0), 3)
            }
        
        experiment["metrics"] = mock_metrics
        experiment["status"] = "complete"
        
        return {"success": True, "results": experiment}
    except Exception as e:
        return {"success": False, "error": str(e)}

# --- Artifact Download ---

@router.get("/artifact/{experiment_id}")
async def download_artifact(experiment_id: str):
    try:
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
            exp = db.experiments.find_one({"_id": obj_id})
        else:
            exp = db.experiments.find_one({"_id": experiment_id})
        
        if not exp or "artifact_path" not in exp:
            raise HTTPException(status_code=404, detail="No artifact")
        return FileResponse(exp["artifact_path"], filename=f"model_{experiment_id}.pkl")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Deployment ---

@router.post("/deploy/{experiment_id}")
async def deploy_model(experiment_id: str):
    try:
        print(f"Deploying model with experiment_id: {experiment_id}")
        
        # First, find the experiment to get its MongoDB _id
        experiment = None
        if USE_MONGO:
            # Try to find by experiment_id first
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
            if not experiment:
                # If not found, try by _id (in case experiment_id is actually the MongoDB _id)
                try:
                    obj_id = ObjectId(experiment_id)
                    experiment = db.experiments.find_one({"_id": obj_id})
                except:
                    pass
        else:
            experiment = db.experiments.find_one({"experiment_id": experiment_id})
        
        if not experiment:
            print(f"ERROR: Could not find experiment {experiment_id}")
            raise HTTPException(status_code=404, detail="Experiment not found")
        
        print(f"Found experiment: {experiment}")
        
        endpoint_url = f"https://api.yourdomain.com/predict/{experiment_id}"
        
        # Update the experiment with deployed status
        if USE_MONGO:
            # Use the _id from the found experiment
            obj_id = experiment["_id"]
            result = db.experiments.update_one(
                {"_id": obj_id}, 
                {"$set": {"deployed": True, "endpoint_url": endpoint_url}}
            )
            print(f"MongoDB deployment update result: {result.modified_count} documents modified")
        else:
            result = db.experiments.update_one(
                {"experiment_id": experiment_id}, 
                {"$set": {"deployed": True, "endpoint_url": endpoint_url}}
            )
            print(f"Non-MongoDB deployment update result: {result.modified_count} documents modified")
        
        # Verify the update worked
        if USE_MONGO:
            updated_exp = db.experiments.find_one({"_id": obj_id})
        else:
            updated_exp = db.experiments.find_one({"experiment_id": experiment_id})
        
        if updated_exp:
            print(f"Verification - Updated experiment deployed: {updated_exp.get('deployed')}")
        else:
            print(f"ERROR: Could not find updated experiment {experiment_id}")
        
        return {"success": True, "endpoint_url": endpoint_url}
    except Exception as e:
        print(f"Deployment error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Batch Prediction ---

@router.post("/predict/{experiment_id}")
async def batch_predict(experiment_id: str, file: UploadFile = File(...)):
    try:
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
        else:
            obj_id = experiment_id
        
        df = pd.read_csv(file.file)
        predictions = [{"input": row.to_dict(), "prediction": 1} for _, row in df.iterrows()]
        return {"success": True, "predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Helper: Background Training Job ---
def run_training_job(experiment_id: str):
    time.sleep(5) # Simulate training
    try:
        artifact_path = f"/tmp/model_{experiment_id}.pkl"
        # Save a dummy model as Pickle
        dummy_model = {"model": "dummy", "experiment_id": experiment_id}
        os.makedirs(os.path.dirname(artifact_path), exist_ok=True)
        with open(artifact_path, "wb") as f:
            pickle.dump(dummy_model, f)
        if USE_MONGO:
            obj_id = ObjectId(experiment_id)
            db.experiments.update_one(
                {"_id": obj_id},
                {"$set": {
                    "status": "complete",
                    "metrics": {
                        "accuracy": 0.95,
                        "f1": 0.93,
                        "charts": [
                            {"title": "Confusion Matrix", "url": "/static/confusion_matrix.png"}
                        ]
                    },
                    "artifact_path": artifact_path
                }}
            )
        else:
            db.experiments.update_one(
                {"_id": experiment_id},
                {"$set": {
                    "status": "complete",
                    "metrics": {
                        "accuracy": 0.95,
                        "f1": 0.93,
                        "charts": [
                            {"title": "Confusion Matrix", "url": "/static/confusion_matrix.png"}
                        ]
                    },
                    "artifact_path": artifact_path
                }}
            )
    except Exception as e:
        print(f"Error in background job: {e}")
        pass  # Ignore errors in background job
