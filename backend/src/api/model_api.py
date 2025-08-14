from fastapi import APIRouter, HTTPException, UploadFile, File, BackgroundTasks, Query
from fastapi.responses import FileResponse
from typing import List, Dict, Any
from ..models.db import db, USE_MONGO
import os
import pandas as pd # For batch predict demo
import time # For training demo
import pickle

router = APIRouter()

# --- Experiment Management ---

@router.get("/experiments")
async def list_experiments(user_id: str, dataset_id: str = None):
    try:
        query = {"user_id": user_id}
        if dataset_id:
            query["dataset_id"] = dataset_id
        
        if USE_MONGO:
            from bson import ObjectId
            exps = list(db.experiments.find(query))
            for exp in exps:
                exp["experiment_id"] = str(exp["_id"])
                exp["isBest"] = exp.get("isBest", False)
                exp["isLatest"] = exp.get("isLatest", False)
                exp["deployed"] = exp.get("deployed", False)
                exp["endpoint_url"] = exp.get("endpoint_url", "")
                # Remove the ObjectId to avoid JSON serialization issues
                exp["_id"] = str(exp["_id"])
        else:
            exps = list(db.experiments.find(query))
            for exp in exps:
                exp["experiment_id"] = str(exp["_id"])
                exp["isBest"] = exp.get("isBest", False)
                exp["isLatest"] = exp.get("isLatest", False)
                exp["deployed"] = exp.get("deployed", False)
                exp["endpoint_url"] = exp.get("endpoint_url", "")
        return {"experiments": exps}
    except Exception as e:
        print(f"Error in list_experiments: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/experiments")
async def create_experiment(payload: Dict[str, Any]):
    payload["status"] = "queued"
    result = db.experiments.insert_one(payload)
    return {"experiment_id": str(result.inserted_id)}

@router.delete("/experiments/{experiment_id}")
async def delete_experiment(experiment_id: str):
    try:
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            db.experiments.delete_one({"_id": obj_id})
        else:
            db.experiments.delete_one({"_id": experiment_id})
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Training/Status/Results ---

@router.post("/train")
async def train_model(experiment_id: str = Query(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    try:
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            background_tasks.add_task(run_training_job, experiment_id)
            db.experiments.update_one({"_id": obj_id}, {"$set": {"status": "running"}})
        else:
            background_tasks.add_task(run_training_job, experiment_id)
            db.experiments.update_one({"_id": experiment_id}, {"$set": {"status": "running"}})
        return {"status": "running"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

@router.get("/status/{experiment_id}")
async def get_status(experiment_id: str):
    try:
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            exp = db.experiments.find_one({"_id": obj_id})
        else:
            exp = db.experiments.find_one({"_id": experiment_id})
        
        if not exp:
            raise HTTPException(status_code=404, detail="Experiment not found")
        return {"status": exp["status"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

@router.get("/results/{experiment_id}")
async def get_results(experiment_id: str):
    try:
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            exp = db.experiments.find_one({"_id": obj_id})
        else:
            exp = db.experiments.find_one({"_id": experiment_id})
        
        if not exp or "metrics" not in exp:
            raise HTTPException(status_code=404, detail="No results")
        return {"metrics": exp["metrics"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Artifact Download ---

@router.get("/artifact/{experiment_id}")
async def download_artifact(experiment_id: str):
    try:
        if USE_MONGO:
            from bson import ObjectId
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
        endpoint_url = f"https://api.yourdomain.com/predict/{experiment_id}"
        if USE_MONGO:
            from bson import ObjectId
            obj_id = ObjectId(experiment_id)
            db.experiments.update_one({"_id": obj_id}, {"$set": {"deployed": True, "endpoint_url": endpoint_url}})
        else:
            db.experiments.update_one({"_id": experiment_id}, {"$set": {"deployed": True, "endpoint_url": endpoint_url}})
        return {"success": True, "endpoint_url": endpoint_url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid experiment ID: {e}")

# --- Batch Prediction ---

@router.post("/predict/{experiment_id}")
async def batch_predict(experiment_id: str, file: UploadFile = File(...)):
    try:
        if USE_MONGO:
            from bson import ObjectId
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
            from bson import ObjectId
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
