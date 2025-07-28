"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function DataTransformationPage() {
  const searchParams = useSearchParams();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState<any>(null);
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch datasets on mount
  useEffect(() => {
    fetch("/api/data/list")
      .then((res) => res.json())
      .then((data) => {
        setDatasets(data);
        // Check if dataset_id is in URL and select it
        const datasetId = searchParams?.get('dataset_id');
        if (datasetId) {
          setActiveId(datasetId);
          fetchPreview(datasetId);
        }
      });
  }, [searchParams]);

  // Fetch preview when activeId changes
  const fetchPreview = async (datasetId: string) => {
    try {
      const res = await fetch(`/api/data/analyze?dataset_id=${datasetId}`);
      if (!res.ok) throw new Error('Failed to fetch dataset preview');
      const data = await res.json();
      const columns = Object.keys(data.dtypes || {}).map(name => ({ name, type: data.dtypes[name] }));
      // Compose preview as array of objects for table rendering
      let previewRows = [];
      if (data.preview && Array.isArray(data.preview)) {
        previewRows = data.preview;
      } else if (columns.length && data.summary) {
        // fallback: build preview from summary if preview missing
        previewRows = Object.keys(data.summary[columns[0].name] || {}).map((stat, i) => {
          const row: any = {};
          columns.forEach(col => { row[col.name] = String(data.summary?.[col.name]?.[stat] ?? ''); });
          return row;
        });
      }
      setPreview({
        id: datasetId,
        dtypes: data.dtypes,
        preview: previewRows,
        columns,
        rowCount: previewRows.length,
        colCount: columns.length,
        stats: data.summary,
        name: data.name || datasetId,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch preview');
    }
  };

  // Handle dataset selection
  const handleDatasetSelect = (datasetId: string) => {
    setActiveId(datasetId);
    fetchPreview(datasetId);
  };

  // --- Transformation Handlers ---
  const handleFeatureEngineering = async (type: string) => {
    if (!activeId) return;
    let script = '';
    if (type === 'polynomial') {
      script = `from sklearn.preprocessing import PolynomialFeatures\npoly = PolynomialFeatures(degree=2, include_bias=False)\ndf = pd.DataFrame(poly.fit_transform(df.select_dtypes(include=[float, int])), columns=poly.get_feature_names_out(df.select_dtypes(include=[float, int]).columns))`;
    }
    if (!script) {
      toast({ title: 'Error', description: 'No transformation script available for this operation.' });
      return;
    }
    await runPreprocessScript(script, 'Feature engineering applied');
  };

  const handleEncoding = async (type: string) => {
    if (!activeId) return;
    let script = '';
    if (type === 'onehot') {
      script = `df = pd.get_dummies(df, drop_first=True)`;
    } else if (type === 'label') {
      script = `from sklearn.preprocessing import LabelEncoder\nfor col in df.select_dtypes(include=[object, 'category']).columns:\n    df[col] = LabelEncoder().fit_transform(df[col].astype(str))`;
    }
    if (!script) {
      toast({ title: 'Error', description: 'No transformation script available for this operation.' });
      return;
    }
    await runPreprocessScript(script, 'Encoding applied');
  };

  const handleScaling = async (type: string) => {
    if (!activeId) return;
    let script = '';
    if (type === 'standard') {
      script = `from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\ndf[df.select_dtypes(include=[float, int]).columns] = scaler.fit_transform(df.select_dtypes(include=[float, int]))`;
    } else if (type === 'minmax') {
      script = `from sklearn.preprocessing import MinMaxScaler\nscaler = MinMaxScaler()\ndf[df.select_dtypes(include=[float, int]).columns] = scaler.fit_transform(df.select_dtypes(include=[float, int]))`;
    }
    if (!script) {
      toast({ title: 'Error', description: 'No transformation script available for this operation.' });
      return;
    }
    await runPreprocessScript(script, 'Scaling applied');
  };

  const runPreprocessScript = async (script: string, successMsg: string) => {
    setCleaning(true);
    setError(null);
    try {
      const res = await fetch(`/api/data/preprocess?dataset_id=${activeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
      });
      let data = null;
      let backendError = null;
      try {
        data = await res.json();
      } catch (e) {
        backendError = await res.text();
      }
      if (!res.ok) {
        const detail = (data && data.detail) || backendError || 'Transformation failed';
        throw new Error(detail);
      }
      toast({ title: successMsg });
      if (activeId) await fetchPreview(activeId);
    } catch (err: any) {
      setError(err.message || 'Transformation failed.');
      toast({ title: 'Error', description: err.message });
    } finally {
      setCleaning(false);
    }
  };

  // Export handler
  const handleExport = async () => {
    if (!activeId) return;
    try {
      const params = new URLSearchParams({ dataset_id: activeId });
      const res = await fetch(`/api/data/export?${params.toString()}`);
      if (!res.ok) {
        const backendError = await res.text();
        throw new Error(backendError || 'Failed to export dataset');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${preview?.name?.replace(/\.[^/.]+$/, '') || 'dataset'}_transformed.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({ title: 'Export successful' });
    } catch (err: any) {
      setError(err.message || 'Export failed.');
      toast({ title: 'Error', description: err.message });
    }
  };

  const handleSendToModelLab = () => {
    if (!activeId) return;
    router.push(`/dashboard/modellab?dataset_id=${activeId}`);
  };

  // Helpers to check column types
  const hasNumeric = React.useMemo(() => {
    if (!preview || !preview.dtypes) return false;
    return Object.values(preview.dtypes).some(type => type === 'number');
  }, [preview]);
  const hasCategorical = React.useMemo(() => {
    if (!preview || !preview.dtypes) return false;
    return Object.values(preview.dtypes).some(type => type === 'string');
  }, [preview]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-6 space-y-8 box-border min-w-0 font-sans">
      {/* Dataset Selection */}
      <section className="mb-8">
        <label className="block mb-2 font-bold">Select Dataset</label>
        {datasets.length === 0 ? (
          <div className="text-muted-foreground">No datasets available. Please upload a dataset first.</div>
        ) : (
          <select
            className="border rounded px-3 py-2 w-full max-w-md"
            value={activeId || ''}
            onChange={e => handleDatasetSelect(e.target.value)}
            disabled={cleaning}
          >
            <option value="">-- Select a dataset --</option>
            {datasets.map(ds => (
              <option key={ds.dataset_id} value={ds.dataset_id}>{ds.filename || ds.name}</option>
            ))}
          </select>
        )}
      </section>
      {/* Dataset Preview */}
      {preview && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Preview (first 5 rows)</h2>
          <div className="overflow-x-auto rounded border bg-muted mb-4">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  {Object.keys(preview.dtypes || {}).map(col => (
                    <th key={col} className="px-2 py-1 border-b border-border whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(preview.preview || []).map((row: any, i: number) => (
                  <tr key={i}>
                    {Object.keys(preview.dtypes || {}).map(col => (
                      <td key={col} className="px-2 py-1 border-b border-border whitespace-nowrap">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      {/* Feature Engineering */}
      <section id="feature-engineering" className="animate-fade-in motion-safe:animate-fade-in">
        <h2 className="text-2xl font-semibold mb-1">Feature Engineering</h2>
        <p className="text-muted-foreground text-sm mb-4">Create new features from your existing data, such as polynomial features, to help models capture more complex patterns.</p>
        <div className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full box-border min-w-0 border-l-4 border-primary/40">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeatureEngineering('polynomial')}
              disabled={!activeId || cleaning || !hasNumeric}
              title={!hasNumeric ? 'No numeric columns available for feature engineering' : ''}
            >
              Polynomial Features (degree 2)
            </Button>
          </div>
        </div>
      </section>
      {/* Encoding */}
      <section id="encoding" className="animate-fade-in motion-safe:animate-fade-in">
        <h2 className="text-2xl font-semibold mb-1">Encoding</h2>
        <p className="text-muted-foreground text-sm mb-4">Convert categorical variables into numeric format using one-hot or label encoding, making them usable for machine learning models.</p>
        <div className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full box-border min-w-0 border-l-4 border-primary/40">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEncoding('onehot')}
              disabled={!activeId || cleaning || !hasCategorical}
              title={!hasCategorical ? 'No categorical columns available for encoding' : ''}
            >
              One-Hot Encoding
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEncoding('label')}
              disabled={!activeId || cleaning || !hasCategorical}
              title={!hasCategorical ? 'No categorical columns available for encoding' : ''}
            >
              Label Encoding
            </Button>
          </div>
        </div>
      </section>
      {/* Scaling */}
      <section id="scaling" className="animate-fade-in motion-safe:animate-fade-in">
        <h2 className="text-2xl font-semibold mb-1">Scaling</h2>
        <p className="text-muted-foreground text-sm mb-4">Normalize or standardize your numeric features so that all values are on a similar scale, improving model performance and convergence.</p>
        <div className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full box-border min-w-0 border-l-4 border-primary/40">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleScaling('standard')}
              disabled={!activeId || cleaning || !hasNumeric}
              title={!hasNumeric ? 'No numeric columns available for scaling' : ''}
            >
              Standard Scaling
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleScaling('minmax')}
              disabled={!activeId || cleaning || !hasNumeric}
              title={!hasNumeric ? 'No numeric columns available for scaling' : ''}
            >
              Min-Max Scaling
            </Button>
          </div>
        </div>
      </section>
      {/* Export */}
      <section id="export" className="animate-fade-in motion-safe:animate-fade-in">
        <h2 className="text-2xl font-semibold mb-1">Export</h2>
        <p className="text-muted-foreground text-sm mb-4">Download your transformed dataset as a CSV file for use in other tools or workflows.</p>
        <div className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 flex flex-col gap-4 w-full box-border min-w-0 border-l-4 border-primary/40">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!activeId || cleaning}>Export as CSV</Button>
            <Button
              size="sm"
              onClick={handleSendToModelLab}
              disabled={!activeId || cleaning}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Send to ModelLab
            </Button>
          </div>
        </div>
      </section>
      {/* Loading indicator */}
      {cleaning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 flex items-center gap-3">
            <span className="text-lg font-semibold">Processing...</span>
            <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          </div>
        </div>
      )}
    </div>
  );
} 