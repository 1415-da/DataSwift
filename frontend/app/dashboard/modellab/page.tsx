'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';

// --- Types ---
interface DatasetMeta {
  dataset_id: string;
  filename: string;
  upload_date: string;
  status: string;
  features: string[];
  types: Record<string, string>;
}
interface ExperimentMeta {
  experiment_id: string;
  status: string;
  created_at: string;
  config: any;
  metrics?: any;
  deployed?: boolean; // Added for deployment status
}

const MODEL_TASKS = [
  { value: 'classification', label: 'Classification' },
  { value: 'regression', label: 'Regression' },
  { value: 'clustering', label: 'Clustering' },
];
const ALGORITHMS: Record<string, { value: string; label: string }[]> = {
  classification: [
    { value: 'random_forest', label: 'Random Forest' },
    { value: 'xgboost', label: 'XGBoost' },
    { value: 'logistic_regression', label: 'Logistic Regression' },
  ],
  regression: [
    { value: 'random_forest_regressor', label: 'Random Forest Regressor' },
    { value: 'xgboost_regressor', label: 'XGBoost Regressor' },
    { value: 'linear_regression', label: 'Linear Regression' },
  ],
  clustering: [
    { value: 'kmeans', label: 'K-Means' },
    { value: 'dbscan', label: 'DBSCAN' },
  ],
};

const HYPERPARAMS: Record<string, { name: string; label: string; type: string; default: any; step?: number }[]> = {
  random_forest: [
    { name: 'n_estimators', label: 'Number of Trees', type: 'number', default: 100 },
    { name: 'max_depth', label: 'Max Depth', type: 'number', default: 5 },
  ],
  xgboost: [
    { name: 'n_estimators', label: 'Number of Trees', type: 'number', default: 100 },
    { name: 'learning_rate', label: 'Learning Rate', type: 'number', step: 0.01, default: 0.1 },
  ],
  logistic_regression: [
    { name: 'C', label: 'Inverse Regularization', type: 'number', step: 0.01, default: 1.0 },
    { name: 'max_iter', label: 'Max Iterations', type: 'number', default: 100 },
  ],
  random_forest_regressor: [
    { name: 'n_estimators', label: 'Number of Trees', type: 'number', default: 100 },
    { name: 'max_depth', label: 'Max Depth', type: 'number', default: 5 },
  ],
  xgboost_regressor: [
    { name: 'n_estimators', label: 'Number of Trees', type: 'number', default: 100 },
    { name: 'learning_rate', label: 'Learning Rate', type: 'number', step: 0.01, default: 0.1 },
  ],
  linear_regression: [
    { name: 'fit_intercept', label: 'Fit Intercept', type: 'checkbox', default: true },
  ],
  kmeans: [
    { name: 'n_clusters', label: 'Number of Clusters', type: 'number', default: 8 },
  ],
  dbscan: [
    { name: 'eps', label: 'Epsilon', type: 'number', step: 0.01, default: 0.5 },
    { name: 'min_samples', label: 'Min Samples', type: 'number', default: 5 },
  ],
};

const METRICS: Record<string, { value: string; label: string }[]> = {
  classification: [
    { value: 'accuracy', label: 'Accuracy' },
    { value: 'f1', label: 'F1 Score' },
    { value: 'roc_auc', label: 'ROC AUC' },
  ],
  regression: [
    { value: 'rmse', label: 'RMSE' },
    { value: 'mae', label: 'MAE' },
    { value: 'r2', label: 'R^2' },
  ],
  clustering: [
    { value: 'silhouette', label: 'Silhouette Score' },
    { value: 'davies_bouldin', label: 'Davies-Bouldin' },
  ],
};

const ModelLabPageImpl = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [datasets, setDatasets] = useState<DatasetMeta[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetMeta | null>(null);
  const [experiments, setExperiments] = useState<ExperimentMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  // Model config state
  const [task, setTask] = useState<keyof typeof METRICS>('classification');
  const [algorithm, setAlgorithm] = useState<keyof typeof HYPERPARAMS>('random_forest');
  const [hyperparams, setHyperparams] = useState<Record<string, any>>({});
  const [target, setTarget] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [metrics, setMetrics] = useState<string[]>([]);
  // TODO: Add hyperparams, target/features, metrics
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentMeta | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailStatus, setDetailStatus] = useState<string | null>(null);
  const [detailMetrics, setDetailMetrics] = useState<Record<string, any> | null>(null);
  const [polling, setPolling] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const [deployed, setDeployed] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchPredictions, setBatchPredictions] = useState<any[]>([]);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  // New state for modals and confirmations
  const [viewExp, setViewExp] = useState<ExperimentMeta | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<ExperimentMeta | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalStatus, setModalStatus] = useState('');
  const [modalMetrics, setModalMetrics] = useState<any>(null);
  const [modalDeployed, setModalDeployed] = useState(false);
  const [modalDeploying, setModalDeploying] = useState(false);
  const [modalBatchFile, setModalBatchFile] = useState<File | null>(null);
  const [modalBatchPred, setModalBatchPred] = useState<any[]>([]);
  const [modalPredicting, setModalPredicting] = useState(false);

  // Fetch datasets (integrate with EDA/Data)
  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/data/list');
        const data = await res.json();
        setDatasets(data);
      } catch {
        setDatasets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, []);

  // Fetch experiments (real API)
  const fetchExperiments = async () => {
    if (!selectedDataset) return;
    try {
      const res = await fetch(`/api/model/experiments?user_id=demo&dataset_id=${selectedDataset.dataset_id}`);
      const data = await res.json();
      setExperiments(data.experiments || []);
    } catch {
      setExperiments([]);
    }
  };
  useEffect(() => {
    fetchExperiments();
    // eslint-disable-next-line
  }, [selectedDataset]);

  const handleCreateExperiment = async () => {
    if (!selectedDataset || !target || features.length === 0 || metrics.length === 0) {
      setError('Please fill all required fields.');
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    setError('');
    const payload = {
      user_id: 'demo', // TODO: Replace with real user
      dataset_id: selectedDataset.dataset_id,
      task,
      algorithm,
      hyperparams,
      target,
      features,
      metrics,
    };
    try {
      await fetch('/api/model/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      toast({ title: 'Experiment created!', description: 'Your model is now training.' });
      await fetchExperiments();
    } catch (e) {
      setError('Failed to create experiment.');
      toast({ title: 'Error', description: 'Failed to create experiment.', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  // Update algorithm when task changes
  useEffect(() => {
    setAlgorithm(ALGORITHMS[task][0].value);
  }, [task]);

  // Reset hyperparams, target, features, metrics when algorithm or dataset changes
  useEffect(() => {
    const hpDefs = HYPERPARAMS[algorithm] || [];
    const hpInit: Record<string, any> = {};
    hpDefs.forEach(hp => { hpInit[hp.name] = hp.default; });
    setHyperparams(hpInit);
    setTarget('');
    setFeatures(Array.isArray(selectedDataset?.features) ? [...selectedDataset.features] : []);
    setMetrics([]);
  }, [algorithm, selectedDataset]);

  const handleViewExperiment = (exp: ExperimentMeta) => {
    setSelectedExperiment(exp);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedExperiment(null);
  };
  const handleDeleteExperiment = async (experiment_id: string) => {
    setDeleting(true);
    setDeleteId(experiment_id);
    try {
      await fetch(`/api/model/experiments/${experiment_id}`, { method: 'DELETE' });
      await fetchExperiments();
    } finally {
      setDeleting(false);
      setDeleteId(null);
      if (selectedExperiment?.experiment_id === experiment_id) handleCloseDetail();
    }
  };

  useEffect(() => {
    if (!detailOpen || !selectedExperiment) return;
    setDetailStatus(selectedExperiment.status);
    setDetailMetrics(selectedExperiment.metrics || null);
    setDeployed(!!selectedExperiment?.deployed);
    setPolling(false);
    // If not complete, start polling
    if (selectedExperiment.status !== 'complete') {
      setPolling(true);
      pollingRef.current = setInterval(async () => {
        const res = await fetch(`/api/model/status/${selectedExperiment.experiment_id}`);
        const data = await res.json();
        setDetailStatus(data.status);
        if (data.status === 'complete') {
          setPolling(false);
          if (pollingRef.current) clearInterval(pollingRef.current);
          // Fetch results
          const res2 = await fetch(`/api/model/results/${selectedExperiment.experiment_id}`);
          const data2 = await res2.json();
          setDetailMetrics(data2.metrics || null);
        }
      }, 3000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  // eslint-disable-next-line
  }, [detailOpen, selectedExperiment]);

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setBatchFile(e.target.files[0]);
  };

  // New handlers for modals
  const handleView = async (exp: ExperimentMeta) => {
    setViewExp(exp);
    setViewModal(true);
    setModalLoading(true);
    setModalStatus(exp.status);
    setModalMetrics(exp.metrics || null);
    setModalDeployed(!!exp.deployed);
    setModalBatchFile(null);
    setModalBatchPred([]);
    setModalPredicting(false);
    // Fetch latest status/metrics if not complete
    if (exp.status !== 'complete') {
      try {
        const res = await fetch(`/api/model/status/${exp.experiment_id}`);
        const data = await res.json();
        setModalStatus(data.status);
        if (data.status === 'complete') {
          const res2 = await fetch(`/api/model/results/${exp.experiment_id}`);
          const data2 = await res2.json();
          setModalMetrics(data2.metrics || null);
        }
      } catch {}
    }
    setModalLoading(false);
  };
  const handleDelete = async (exp: ExperimentMeta) => {
    setDeleteConfirm(exp);
  };
  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await fetch(`/api/model/experiments/${deleteConfirm.experiment_id}`, { method: 'DELETE' });
      toast({ title: 'Experiment deleted.', description: 'Experiment deleted.' });
      await fetchExperiments();
      setDeleteConfirm(null);
      setViewModal(false);
    } catch {
      toast({ title: 'Error', description: 'Failed to delete experiment.', variant: 'destructive' });
    }
  };
  // ✅ Only ONE handleDeploy declaration (modal-related)
  const handleDeploy = async () => {
    if (!viewExp) return;
    setModalDeploying(true);
    try {
      const response = await fetch("/api/predict/deploy", {
        method: "POST",
        body: JSON.stringify({
          experiment_id: viewExp.experiment_id,
          task: viewExp.config.task,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Model deployed!', description: 'Model deployed!' });
        setViewExp({
          ...viewExp,
          deployed: true,
        });
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
    } finally {
      setModalDeploying(false);
    }
  };
  // ✅ Only ONE handleBatchPredict declaration (modal-related)
  const handleBatchPredict = async () => {
    if (!viewExp) return;
    setModalPredicting(true);
    try {
      const response = await fetch("/api/predict/batch", {
        method: "POST",
        body: JSON.stringify({
          experiment_id: viewExp.experiment_id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Batch prediction completed!', description: 'Batch prediction completed!' });
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
    } finally {
      setModalPredicting(false);
    }
  };

  if (!mounted) {
    // Skeleton loader for SSR
    return <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-8 px-4 py-10 animate-fade-in motion-safe:animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">ModelLab</h1>
      {/* 1. Dataset Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Dataset</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse">Loading datasets...</div>
          ) : datasets.length === 0 ? (
            <div>No datasets available.</div>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="dataset-select" className="font-medium mb-1">Choose a dataset:</label>
              <select
                id="dataset-select"
                className="w-full max-w-md border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedDataset?.dataset_id ?? ''}
                onChange={e => {
                  const ds = datasets.find(d => d.dataset_id === e.target.value);
                  setSelectedDataset(ds || null);
                }}
              >
                <option value="" disabled>Select a dataset...</option>
                {datasets.map(ds => (
                  <option key={ds.dataset_id} value={ds.dataset_id}>
                    {ds.filename} ({ds.status})
                  </option>
                ))}
              </select>
              {selectedDataset && (
                <div className="mt-4 space-y-2">
                  <div className="font-medium">Dataset Summary</div>
                  <div className="flex gap-8">
                    <div>
                      <span className="font-semibold">Columns:</span> {Array.isArray(selectedDataset.features) ? selectedDataset.features.length : 0}
                    </div>
                    <div>
                      <span className="font-semibold">Types:</span> {selectedDataset.types ? Object.values(selectedDataset.types).join(', ') : ''}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedDataset.types ? Object.entries(selectedDataset.types).map(([col, typ]) => `${col}: ${typ}`).join(', ') : ''}
                  </div>
                </div>
              )}
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Model Config & Creation */}
      <Card>
        <CardHeader>
          <CardTitle>Configure Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <label className="font-medium">Task</label>
              <select
                className="w-full max-w-xs border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                value={task ?? ''}
                onChange={e => setTask(e.target.value as keyof typeof METRICS)}
              >
                {MODEL_TASKS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-medium">Algorithm</label>
              <select
                className="w-full max-w-xs border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                value={algorithm ?? ''}
                onChange={e => setAlgorithm(e.target.value as keyof typeof HYPERPARAMS)}
              >
                {ALGORITHMS[task].map((opt: { value: string; label: string }) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {/* Hyperparameters */}
            {HYPERPARAMS[algorithm] && HYPERPARAMS[algorithm].length > 0 && (
              <div>
                <div className="font-medium mb-1">Hyperparameters</div>
                <div className="flex flex-col gap-2">
                  {HYPERPARAMS[algorithm].map(hp => (
                    <div key={hp.name} className="flex items-center gap-2">
                      <label className="w-40">{hp.label}</label>
                      {hp.type === 'checkbox' ? (
                        <input
                          type="checkbox"
                          checked={!!hyperparams[hp.name]}
                          onChange={e => setHyperparams(hp => ({ ...hp, [hp.name]: e.target.checked }))}
                        />
                      ) : (
                        <input
                          type={hp.type}
                          step={hp.step || undefined}
                          className="border rounded px-2 py-1 w-32"
                          value={String(hyperparams[hp.name] ?? '')}
                          onChange={e => setHyperparams(hp => ({ ...hp, [hp.name]: e.target.value }))}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Target column (for classification/regression) */}
            {selectedDataset && (task === 'classification' || task === 'regression') && (
              <div>
                <label className="font-medium">Target Column</label>
                <select
                  className="w-full max-w-xs border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                  value={target ?? ''}
                  onChange={e => setTarget(e.target.value)}
                >
                  <option value="" disabled>Select target...</option>
                  {Array.isArray(selectedDataset.features) && selectedDataset.features.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Feature columns multi-select */}
            {selectedDataset && (
              <div>
                <label className="font-medium">Feature Columns</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(selectedDataset.features) && selectedDataset.features.map(col => (
                    <label key={col} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={features.includes(col)}
                        onChange={e => {
                          setFeatures(f => e.target.checked ? [...f, col] : f.filter(x => x !== col));
                        }}
                      />
                      {col}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {/* Metrics multi-select */}
            <div>
              <label className="font-medium">Metrics</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {METRICS[task].map((m: { value: string; label: string }) => (
                  <label key={m.value} className="flex items-center gap-1 border rounded px-2 py-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={metrics.includes(m.value)}
                      onChange={e => {
                        setMetrics(ms => e.target.checked ? [...ms, m.value] : ms.filter(x => x !== m.value));
                      }}
                    />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>
            <button
              className="mt-4 px-4 py-2 rounded bg-primary text-white font-semibold disabled:opacity-60"
              onClick={handleCreateExperiment}
              disabled={creating || !selectedDataset || !target || features.length === 0 || metrics.length === 0}
            >
              {creating ? 'Creating...' : 'Create Experiment'}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 3. Experiment Management */}
      <Card>
        <CardHeader>
          <CardTitle>Experiments</CardTitle>
        </CardHeader>
        <CardContent>
          {experiments.length === 0 && !loading ? (
            <div className="text-muted-foreground">No experiments yet.</div>
          ) : loading ? (
            <div className="animate-pulse">Loading experiments...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiments.map((exp: ExperimentMeta) => (
                <div key={exp.experiment_id} className="border rounded-lg p-4 bg-card shadow animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{exp.config.algorithm}</div>
                    <span className={`text-xs px-2 py-1 rounded ${exp.status === 'complete' ? 'bg-green-100 text-green-700' : exp.status === 'running' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{exp.status}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{exp.created_at}</div>
                  <div className="text-sm mb-2">Task: {exp.config.task}</div>
                  <div className="text-sm mb-2">Target: {exp.config.target}</div>
                  <div className="text-xs text-muted-foreground mb-2">Features: {exp.config.features?.join(', ')}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="text-primary underline text-xs" onClick={() => handleView(exp)}>View</button>
                    <button className="text-destructive underline text-xs" onClick={() => handleDelete(exp)}>Delete</button>
                    {exp.status === 'complete' && (
                      <>
                        <a href={`/api/model/artifact/${exp.experiment_id}`} className="text-xs underline text-blue-700" download>Download Pickle</a>
                        <button className="text-green-700 underline text-xs" onClick={() => handleView(exp)}>Deploy</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Results & Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Results & Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Show metrics, charts, download options */}
          <div className="text-muted-foreground">Results UI coming soon...</div>
        </CardContent>
      </Card>

      {/* 5. Export & Deployment */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Pickle download, deploy, batch inference */}
          <div className="text-muted-foreground">Export & deployment UI coming soon...</div>
        </CardContent>
      </Card>

      {/* Experiment Detail Modal */}
      {detailOpen && selectedExperiment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-xl" onClick={handleCloseDetail}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Experiment Details</h2>
            <div className="mb-2"><span className="font-semibold">Status:</span> <span className={`text-xs px-2 py-1 rounded ${detailStatus === 'complete' ? 'bg-green-100 text-green-700' : detailStatus === 'running' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{detailStatus}</span></div>
            {polling && detailStatus !== 'complete' && (
              <div className="mb-2 text-blue-600 text-sm flex items-center gap-2"><span className="animate-spin">⏳</span> Waiting for experiment to complete...</div>
            )}
            <div className="mb-2"><span className="font-semibold">Algorithm:</span> {selectedExperiment.config.algorithm}</div>
            <div className="mb-2"><span className="font-semibold">Task:</span> {selectedExperiment.config.task}</div>
            <div className="mb-2"><span className="font-semibold">Target:</span> {selectedExperiment.config.target}</div>
            <div className="mb-2"><span className="font-semibold">Features:</span> {selectedExperiment.config.features?.join(', ')}</div>
            <div className="mb-2"><span className="font-semibold">Metrics:</span> {selectedExperiment.config.metrics?.join(', ')}</div>
            <div className="mb-2"><span className="font-semibold">Hyperparameters:</span>
              <ul className="ml-4 list-disc">
                {selectedExperiment.config.hyperparams && Object.entries(selectedExperiment.config.hyperparams).map(([k, v]) => (
                  <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                ))}
              </ul>
            </div>
            {/* Results (if available) */}
            {detailMetrics && (
              <div className="mb-2">
                <span className="font-semibold">Results:</span>
                <ul className="ml-4 list-disc">
                  {Object.entries(detailMetrics).map(([k, v]) => (
                    <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Download Pickle if complete */}
            {detailStatus === 'complete' && !deployed && (
              <button
                className="inline-block mt-2 px-4 py-2 rounded bg-primary text-white font-semibold"
                onClick={handleDeploy}
                disabled={deploying}
              >
                {deploying ? 'Deploying...' : 'Deploy'}
              </button>
            )}
            {detailStatus === 'complete' && deployed && (
              <div className="mt-4">
                <div className="font-semibold mb-1">Batch Prediction</div>
                <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleBatchFileChange} />
                <button
                  className="ml-2 px-3 py-1 rounded bg-primary text-white font-semibold disabled:opacity-60"
                  onClick={handleBatchPredict}
                  disabled={predicting || !batchFile}
                >
                  {predicting ? 'Predicting...' : 'Run Batch Prediction'}
                </button>
                {Array.isArray(batchPredictions) && batchPredictions.length > 0 && (
                  <div className="mt-2 overflow-x-auto">
                    <table className="min-w-max border text-xs">
                      <thead>
                        <tr>
                          {Object.keys(batchPredictions[0]).map(col => (
                            <th key={col} className="border px-2 py-1 bg-muted">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {batchPredictions.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).map((v, j) => (
                              <td key={j} className="border px-2 py-1">{String(v)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button className="text-destructive underline text-xs" onClick={() => handleDeleteExperiment(selectedExperiment.experiment_id)} disabled={deleting && deleteId === selectedExperiment.experiment_id}>
                {deleting && deleteId === selectedExperiment.experiment_id ? 'Deleting...' : 'Delete'}
              </button>
              {/* TODO: Deploy, Batch Predict, Comments */}
            </div>
          </div>
        </div>
      )}

      {/* View/Deploy/Batch Predict Modal */}
      {viewModal && viewExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative animate-fade-in">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setViewModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Experiment Details</h2>
            {modalLoading ? <div className="animate-pulse">Loading...</div> : (
              <>
                <div className="mb-2"><span className="font-semibold">Status:</span> <span className={`text-xs px-2 py-1 rounded ${modalStatus === 'complete' ? 'bg-green-100 text-green-700' : modalStatus === 'running' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{modalStatus}</span></div>
                <div className="mb-2"><span className="font-semibold">Algorithm:</span> {viewExp.config.algorithm}</div>
                <div className="mb-2"><span className="font-semibold">Task:</span> {viewExp.config.task}</div>
                <div className="mb-2"><span className="font-semibold">Target:</span> {viewExp.config.target}</div>
                <div className="mb-2"><span className="font-semibold">Features:</span> {viewExp.config.features?.join(', ')}</div>
                <div className="mb-2"><span className="font-semibold">Metrics:</span> {viewExp.config.metrics?.join(', ')}</div>
                <div className="mb-2"><span className="font-semibold">Hyperparameters:</span>
                  <ul className="ml-4 list-disc">
                    {viewExp.config.hyperparams && Object.entries(viewExp.config.hyperparams).map(([k, v]) => (
                      <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                    ))}
                  </ul>
                </div>
                {modalMetrics && (
                  <div className="mb-2">
                    <span className="font-semibold">Results:</span>
                    <ul className="ml-4 list-disc">
                      {Object.entries(modalMetrics).map(([k, v]) => (
                        <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {modalStatus === 'complete' && !modalDeployed && (
                  <button className="inline-block mt-2 px-4 py-2 rounded bg-primary text-white font-semibold" onClick={handleDeploy} disabled={modalDeploying}>
                    {modalDeploying ? 'Deploying...' : 'Deploy'}
                  </button>
                )}
                {modalStatus === 'complete' && modalDeployed && (
                  <div className="mt-4">
                    <div className="font-semibold mb-1">Batch Prediction</div>
                    <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={e => setModalBatchFile(e.target.files?.[0] || null)} />
                    <button className="ml-2 px-3 py-1 rounded bg-primary text-white font-semibold disabled:opacity-60" onClick={handleBatchPredict} disabled={modalPredicting || !modalBatchFile}>
                      {modalPredicting ? 'Predicting...' : 'Run Batch Prediction'}
                    </button>
                    {Array.isArray(modalBatchPred) && modalBatchPred.length > 0 && (
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-max border text-xs">
                          <thead>
                            <tr>
                              {Object.keys(modalBatchPred[0]).map(col => (
                                <th key={col} className="border px-2 py-1 bg-muted">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {modalBatchPred.map((row, i) => (
                              <tr key={i}>
                                {Object.values(row).map((v, j) => (
                                  <td key={j} className="border px-2 py-1">{String(v)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <button className="text-destructive underline text-xs" onClick={() => setDeleteConfirm(viewExp)}>Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative animate-fade-in">
            <h2 className="text-lg font-bold mb-2">Delete Experiment?</h2>
            <div className="mb-4">Are you sure you want to delete this experiment? This action cannot be undone.</div>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="px-4 py-2 rounded bg-destructive text-white font-semibold" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelLabPageImpl; 