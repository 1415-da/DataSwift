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

        # Add preview (first 5 rows as list of dicts)
        preview = df.head(5).replace({np.nan: None, np.inf: None, -np.inf: None}).to_dict(orient='records')

        result = {
            "summary": clean_nans(summary),
            "missing": clean_nans(missing),
            "dtypes": dtypes,
            "preview": preview
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

    @staticmethod
    def correlation_matrix(dataset_id: str) -> Dict[str, Any]:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        corr = df.corr(numeric_only=True)
        # Replace NaN/inf with None for JSON
        corr = corr.replace({np.nan: None, np.inf: None, -np.inf: None})
        return corr.to_dict()

    @staticmethod
    def detect_outliers(dataset_id: str) -> Dict[str, Any]:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        outliers = {}
        for col in df.select_dtypes(include='number').columns:
            series = df[col]
            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            mask = (series < lower) | (series > upper)
            outlier_indices = series[mask].index.tolist()
            outlier_values = series[mask].replace({np.nan: None, np.inf: None, -np.inf: None}).tolist()
            outliers[col] = {
                'count': int(mask.sum()),
                'indices': outlier_indices,
                'values': outlier_values
            }
        return outliers

    @staticmethod
    def generate_insights(dataset_id: str) -> list:
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        insights = []
        # High missingness
        missing = df.isnull().mean()
        for col, frac in missing.items():
            if frac > 0.5:
                insights.append({
                    'type': 'warning',
                    'message': f"Column '{col}' has over 50% missing values. Consider removing or imputing."
                })
            elif frac > 0.2:
                insights.append({
                    'type': 'info',
                    'message': f"Column '{col}' has {int(frac*100)}% missing values."
                })
        # Strong correlations
        corr = df.corr(numeric_only=True)
        for col1 in corr.columns:
            for col2 in corr.columns:
                if col1 != col2 and abs(corr.loc[col1, col2]) > 0.8:
                    insights.append({
                        'type': 'info',
                        'message': f"Columns '{col1}' and '{col2}' are strongly correlated (corr={corr.loc[col1, col2]:.2f})."
                    })
        # Outliers
        for col in df.select_dtypes(include='number').columns:
            series = df[col]
            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            mask = (series < lower) | (series > upper)
            count = int(mask.sum())
            if count > 0:
                insights.append({
                    'type': 'warning',
                    'message': f"Column '{col}' has {count} outlier value(s) (IQR method)."
                })
        # Suggestion: all numeric
        if len(df.select_dtypes(include='number').columns) == df.shape[1]:
            insights.append({
                'type': 'suggestion',
                'message': "All columns are numeric. Consider dimensionality reduction or feature selection."
            })
        return insights 

    @staticmethod
    def export_report(dataset_id: str, format: str = 'html') -> bytes:
        import base64
        df = DATASETS.get(dataset_id)
        if df is None:
            raise ValueError("Dataset not found")
        # Try to use ydata-profiling (pandas-profiling)
        try:
            from ydata_profiling import ProfileReport
            profile = ProfileReport(df, title="EDA Report", minimal=True)
            if format == 'html':
                html = profile.to_html()
                return html.encode('utf-8')
            elif format == 'pdf':
                # Requires pdfkit and wkhtmltopdf installed
                import pdfkit
                html = profile.to_html()
                pdf = pdfkit.from_string(html, False)
                return pdf
        except ImportError:
            pass
        # Fallback: comprehensive HTML summary
        html = f"<html><head><title>EDA Report</title></head><body>"
        html += f"<h1>EDA Report</h1>"
        html += f"<h2>Shape</h2><p>{df.shape[0]} rows × {df.shape[1]} columns</p>"
        html += f"<h2>Columns</h2><ul>"
        for col in df.columns:
            html += f"<li>{col} ({df[col].dtype})</li>"
        html += "</ul>"
        # Summary statistics
        html += f"<h2>Summary Statistics</h2>"
        html += df.describe(include='all').to_html()
        # Missing values
        html += f"<h2>Missing Values</h2>"
        missing = df.isnull().sum()
        html += missing.to_frame('Missing Count').to_html()
        # Correlation matrix
        html += f"<h2>Correlation Matrix</h2>"
        corr = df.corr(numeric_only=True)
        html += corr.to_html()
        # Outlier summary
        html += f"<h2>Outlier Summary</h2>"
        outliers = EDAService.detect_outliers(dataset_id)
        if outliers:
            html += "<table border='1'><tr><th>Column</th><th>Outlier Count</th><th>Sample Outlier Values</th></tr>"
            for col, info in outliers.items():
                sample_vals = ', '.join(str(v) for v in (info['values'][:5] if info['values'] else []))
                html += f"<tr><td>{col}</td><td>{info['count']}</td><td>{sample_vals}</td></tr>"
            html += "</table>"
        else:
            html += "<p>No outliers detected.</p>"
        # AI Insights
        html += f"<h2>AI Insights</h2>"
        insights = EDAService.generate_insights(dataset_id)
        if insights:
            html += "<ul>"
            for ins in insights:
                html += f"<li><b>{ins['type'].capitalize()}:</b> {ins['message']}</li>"
            html += "</ul>"
        else:
            html += "<p>No insights generated.</p>"
        # Charts: Numeric columns (histograms)
        html += f"<h2>Numeric Distributions</h2>"
        for col in df.select_dtypes(include='number').columns:
            try:
                import matplotlib.pyplot as plt
                import io
                plt.figure()
                df[col].hist()
                plt.title(f"Histogram of {col}")
                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                plt.close()
                buf.seek(0)
                img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                html += f'<div><b>{col}</b><br><img src="data:image/png;base64,{img_base64}" style="max-width:400px;"></div>'
            except Exception as e:
                html += f'<div><b>{col}</b>: Error generating chart ({e})</div>'
        # Charts: Categorical columns (bar charts)
        html += f"<h2>Categorical Distributions</h2>"
        for col in df.select_dtypes(include='object').columns:
            try:
                import matplotlib.pyplot as plt
                import io
                plt.figure()
                df[col].value_counts().plot(kind='bar')
                plt.title(f"Bar Chart of {col}")
                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                plt.close()
                buf.seek(0)
                img_base64 = base64.b64encode(buf.read()).decode('utf-8')
                html += f'<div><b>{col}</b><br><img src="data:image/png;base64,{img_base64}" style="max-width:400px;"></div>'
            except Exception as e:
                html += f'<div><b>{col}</b>: Error generating chart ({e})</div>'
        html += "</body></html>"
        if format == 'html':
            return html.encode('utf-8')
        elif format == 'pdf':
            try:
                import pdfkit
                pdf = pdfkit.from_string(html, False)
                return pdf
            except ImportError:
                raise ValueError('PDF export requires pdfkit and wkhtmltopdf.')
        raise ValueError('Unsupported format') 