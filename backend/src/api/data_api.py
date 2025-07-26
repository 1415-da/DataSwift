from fastapi import APIRouter, HTTPException, UploadFile, File, Query, Response, Body
from typing import List, Dict, Any, Optional
from ..services.eda_service import EDAService
from datetime import datetime
from fastapi.responses import StreamingResponse
import pandas as pd

# In-memory metadata for datasets
DATASET_METADATA = {}

router = APIRouter()

@router.get("/")
async def get_data_endpoints():
    """Get available data endpoints"""
    return {
        "endpoints": [
            "/upload",
            "/analyze",
            "/visualize",
            "/export"
        ]
    }

@router.post("/upload")
async def upload_data(file: UploadFile = File(...)):
    """Upload data file (CSV) and return dataset_id"""
    try:
        file_bytes = await file.read()
        dataset_id = EDAService.upload_dataset(file_bytes, file.filename)
        # Store metadata
        DATASET_METADATA[dataset_id] = {
            "dataset_id": dataset_id,
            "filename": file.filename,
            "size": len(file_bytes),
            "upload_date": datetime.utcnow().isoformat(),
            "status": "ready"
        }
        return {"dataset_id": dataset_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/list")
async def list_datasets():
    """List all uploaded datasets (in memory)"""
    from ..services.eda_service import DATASETS
    datasets = []
    for dataset_id, metadata in DATASET_METADATA.items():
        df = DATASETS.get(dataset_id)
        if df is not None:
            # Map pandas dtypes to frontend-friendly types
            def map_dtype(dtype):
                if pd.api.types.is_numeric_dtype(dtype):
                    return 'number'
                elif pd.api.types.is_datetime64_any_dtype(dtype):
                    return 'date'
                elif pd.api.types.is_bool_dtype(dtype):
                    return 'boolean'
                else:
                    return 'string'
            
            dataset_info = {
                **metadata,
                "features": list(df.columns),
                "types": {col: map_dtype(dtype) for col, dtype in df.dtypes.items()}
            }
            datasets.append(dataset_info)
    return datasets

@router.get("/analyze")
async def analyze_data(dataset_id: str = Query(...)):
    """Analyze uploaded data and return EDA results"""
    try:
        result = EDAService.analyze_dataset(dataset_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/visualize")
async def visualize_data(dataset_id: str = Query(...), column: Optional[str] = Query(None)):
    """Generate data visualizations (histogram) and return as PNG image"""
    try:
        img_bytes = EDAService.visualize_dataset(dataset_id, column)
        return Response(content=img_bytes, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export")
async def export_data(dataset_id: str = Query(...)):
    """Export processed data as CSV"""
    try:
        csv_bytes = EDAService.export_dataset(dataset_id)
        return Response(content=csv_bytes, media_type="text/csv")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/export_report")
async def export_report(dataset_id: str = Query(...), format: str = Query('html')):
    """Export EDA report as PDF or HTML"""
    try:
        report_bytes = EDAService.export_report(dataset_id, format)
        if format == 'pdf':
            return Response(content=report_bytes, media_type='application/pdf', headers={
                'Content-Disposition': f'attachment; filename="eda_report_{dataset_id}.pdf"'
            })
        else:
            return Response(content=report_bytes, media_type='text/html', headers={
                'Content-Disposition': f'attachment; filename="eda_report_{dataset_id}.html"'
            })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/preprocess")
async def preprocess_data(dataset_id: str = Query(...), script: str = Body(...)):
    """Run a preprocessing script on the dataset and update it in memory."""
    try:
        from services.eda_service import DATASETS
        import pandas as pd
        df = DATASETS.get(dataset_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Dataset not found")
        # Define a safe namespace for script execution
        local_vars = {"df": df.copy(), "pd": pd}
        try:
            exec(script, {}, local_vars)
            new_df = local_vars.get("df")
            if not isinstance(new_df, pd.DataFrame):
                raise ValueError("Script must assign the processed DataFrame back to variable 'df'.")
            DATASETS[dataset_id] = new_df
            return {"success": True, "message": "Preprocessing complete."}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Script error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/clean")
async def clean_data(dataset_id: str = Query(...), method: str = Query("auto"), options: dict = Body(None)):
    """Clean the dataset using auto or manual method."""
    try:
        from services.eda_service import DATASETS
        import pandas as pd
        import numpy as np
        import re
        df = DATASETS.get(dataset_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Dataset not found")
        if method == "auto":
            # 1. Remove columns/rows with >50% missing
            thresh_col = int(0.5 * len(df))
            df = df.dropna(axis=1, thresh=thresh_col)
            thresh_row = int(0.5 * len(df.columns))
            df = df.dropna(axis=0, thresh=thresh_row)
            # 2. Fill missing values
            for col in df.columns:
                if pd.api.types.is_numeric_dtype(df[col]):
                    df[col] = df[col].fillna(df[col].median())
                else:
                    mode = df[col].mode()
                    if not mode.empty:
                        df[col] = df[col].fillna(mode[0])
                    else:
                        df[col] = df[col].fillna('')
            # 3. Type detection/conversion
            for col in df.columns:
                try:
                    df[col] = pd.to_numeric(df[col])
                except:
                    try:
                        df[col] = pd.to_datetime(df[col])
                    except:
                        pass
            # 4. Remove duplicates
            df = df.drop_duplicates()
            # 5. Outlier removal (IQR, numeric columns)
            for col in df.select_dtypes(include=[np.number]).columns:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                mask = (df[col] >= Q1 - 1.5 * IQR) & (df[col] <= Q3 + 1.5 * IQR)
                df = df[mask]
            # 6. Whitespace/case normalization
            for col in df.select_dtypes(include=[object]).columns:
                df[col] = df[col].astype(str).str.strip().str.lower()
            # 7. Column name standardization
            df.columns = [re.sub(r'[^a-zA-Z0-9_]', '', c.replace(' ', '_')).lower() for c in df.columns]
            # 8. One-hot encoding for categoricals
            cat_cols = df.select_dtypes(include=[object]).columns
            if len(cat_cols) > 0:
                df = pd.get_dummies(df, columns=cat_cols, drop_first=True)
            # 9. Basic error correction (stub: remove invalid datetimes)
            for col in df.columns:
                if pd.api.types.is_datetime64_any_dtype(df[col]):
                    df = df[~df[col].isna()]
            DATASETS[dataset_id] = df.reset_index(drop=True)
            return {"success": True, "message": "Auto clean complete."}
        elif method == "manual":
            # Manual cleaning: execute user script
            script = options.get('script') if options else None
            if not script:
                raise HTTPException(status_code=400, detail="No script provided for manual cleaning.")
            local_vars = {"df": df.copy(), "pd": pd}
            try:
                exec(script, {}, local_vars)
                new_df = local_vars.get("df")
                if not isinstance(new_df, pd.DataFrame):
                    raise ValueError("Script must assign the processed DataFrame back to variable 'df'.")
                DATASETS[dataset_id] = new_df
                return {"success": True, "message": "Manual cleaning complete."}
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Script error: {str(e)}")
        else:
            raise HTTPException(status_code=400, detail="Unknown cleaning method.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete")
async def delete_dataset(dataset_id: str = Query(...)):
    """Delete a dataset by dataset_id (in memory)"""
    try:
        from services.eda_service import DATASETS
        if dataset_id in DATASETS:
            del DATASETS[dataset_id]
        if dataset_id in DATASET_METADATA:
            del DATASET_METADATA[dataset_id]
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/correlation")
async def correlation_matrix(dataset_id: str = Query(...)):
    """Return correlation matrix for numeric columns of the dataset"""
    try:
        result = EDAService.correlation_matrix(dataset_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/outliers")
async def outliers(dataset_id: str = Query(...)):
    """Return outlier info for numeric columns of the dataset"""
    try:
        result = EDAService.detect_outliers(dataset_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/insights")
async def insights(dataset_id: str = Query(...)):
    """Return AI-generated insights for the dataset"""
    try:
        result = EDAService.generate_insights(dataset_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
