import io
import uuid
import pandas as pd
import matplotlib.pyplot as plt
from typing import Dict, Any
import numpy as np

# In-memory storage for datasets and EDA results
DATASETS: Dict[str, pd.DataFrame] = {}
EDA_RESULTS: Dict[str, Dict[str, Any]] = {}

class EDAService:
    @staticmethod
    def upload_dataset(file_bytes: bytes, filename: str) -> str:
        # Support CSV, Excel, and JSON
        ext = filename.lower().split('.')[-1]
        if ext in ['csv']:
            df = pd.read_csv(io.BytesIO(file_bytes))
        elif ext in ['xlsx', 'xls']:
            df = pd.read_excel(io.BytesIO(file_bytes))
        elif ext in ['json']:
            df = pd.read_json(io.BytesIO(file_bytes))
        else:
            raise ValueError(f"Unsupported file type: {ext}")
        dataset_id = str(uuid.uuid4())
        DATASETS[dataset_id] = df
        return dataset_id

    @staticmethod
    def analyze_dataset(dataset_id: str) -> Dict[str, Any]:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        # Basic EDA: summary stats, missing values, dtypes
        summary = df.describe(include='all').to_dict()
        missing = df.isnull().sum().to_dict()
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
        dtypes = {col: map_dtype(dtype) for col, dtype in df.dtypes.items()}

        # Convert all NaN/inf/-inf to None for JSON compliance
        def clean_nans(obj):
            if isinstance(obj, dict):
                return {k: clean_nans(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [clean_nans(v) for v in obj]
            elif isinstance(obj, float):
                if np.isnan(obj) or np.isinf(obj):
                    return None
                return obj
            return obj

        result = {
            "summary": clean_nans(summary),
            "missing": clean_nans(missing),
            "dtypes": dtypes
        }
        EDA_RESULTS[dataset_id] = result
        return result

    @staticmethod
    def visualize_dataset(dataset_id: str, column: str = None) -> bytes:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        # For demo: histogram of first numeric column or specified column
        if column is None:
            num_cols = df.select_dtypes(include='number').columns
            if not num_cols.any():
                raise ValueError("No numeric columns to visualize")
            column = num_cols[0]
        plt.figure()
        df[column].hist()
        plt.title(f"Histogram of {column}")
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        plt.close()
        buf.seek(0)
        return buf.read()

    @staticmethod
    def export_dataset(dataset_id: str) -> bytes:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        buf = io.BytesIO()
        df.to_csv(buf, index=False)
        buf.seek(0)
        return buf.read() 