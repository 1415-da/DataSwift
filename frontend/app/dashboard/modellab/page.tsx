'use client';

import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';
import dynamic from 'next/dynamic';
import { Progress } from '@/components/ui/progress';
import { useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';

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
  endpoint_url?: string; // Added for endpoint URL
  isBest?: boolean; // Added for best model badge
  isLatest?: boolean; // Added for latest model badge
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

const Card = ({ title, children, actions }: { title: React.ReactNode; children: React.ReactNode; actions?: React.ReactNode }) => (
  <section className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 w-full box-border min-w-0 border-l-4 border-primary/40 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl hover:border-primary/80 backdrop-blur-md bg-opacity-80 animate-fade-in motion-safe:animate-fade-in mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    <div>{children}</div>
  </section>
);

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
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  // Progress tracking state
  const [trainingExpId, setTrainingExpId] = useState<string | null>(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStatus, setTrainingStatus] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [predictProgress, setPredictProgress] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);

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

  useEffect(() => {
    console.log('Datasets:', datasets);
  }, [datasets]);

  useEffect(() => {
    console.log('Selected dataset:', selectedDataset);
  }, [selectedDataset]);

  useEffect(() => {
    console.log('Experiments:', experiments);
  }, [experiments]);

  // Fetch experiments (real API)
  const fetchExperiments = async () => {
    if (!selectedDataset) return;
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/model/experiments?user_id=demo&dataset_id=${selectedDataset.dataset_id}`);
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
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStatus('Initializing experiment...');
    setError('');
    
    const payload = {
      user_id: 'demo', // TODO: Replace with real user
      dataset_id: selectedDataset.dataset_id,
      config: {
        task,
        algorithm,
        hyperparams,
        target,
        features,
        metrics,
      },
      created_at: new Date().toISOString(),
    };
    
    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 1000);

      setTrainingStatus('Creating experiment...');
      setTrainingProgress(10);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/model/experiments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to create experiment');
      
      setTrainingStatus('Model training in progress...');
      setTrainingProgress(50);
      
      toast({ title: 'Experiment created!', description: 'Your model is now training.' });
      await fetchExperiments();
      
      // Complete the progress
      setTrainingProgress(100);
      setTrainingStatus('Training completed!');
      
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
        setTrainingStatus('');
      }, 2000);
      
    } catch (e) {
      setError('Failed to create experiment.');
      toast({ title: 'Error', description: 'Failed to create experiment.', variant: 'destructive' });
      setIsTraining(false);
      setTrainingProgress(0);
      setTrainingStatus('');
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

  const handleBatchPredictDetail = async () => {
    if (!selectedExperiment || !batchFile) return;
    setPredicting(true);
    try {
      const formData = new FormData();
      formData.append('file', batchFile);
      
      const response = await fetch(`/api/model/predict/${selectedExperiment.experiment_id}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        // setBatchPredictions(data.predictions || []); // This state variable is removed
        toast({ title: 'Batch prediction completed!', description: 'Batch prediction completed!' });
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
    } finally {
      setPredicting(false);
    }
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
    setIsDeploying(true);
    setDeployProgress(0);
    
    try {
      // Simulate deployment progress
      const progressInterval = setInterval(() => {
        setDeployProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 800);

      setDeployProgress(10);
      
      const response = await fetch(`/api/model/deploy/${viewExp.experiment_id}`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        setDeployProgress(100);
        toast({ title: 'Model deployed!', description: 'Model deployed!' });
        setViewExp({
          ...viewExp,
          deployed: true,
          endpoint_url: data.endpoint_url,
        });
        
        setTimeout(() => {
          setIsDeploying(false);
          setDeployProgress(0);
        }, 2000);
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
        setIsDeploying(false);
        setDeployProgress(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
      setIsDeploying(false);
      setDeployProgress(0);
    } finally {
      setModalDeploying(false);
    }
  };
  // ✅ Only ONE handleBatchPredict declaration (modal-related)
  const handleBatchPredict = async () => {
    if (!viewExp || !modalBatchFile) return;
    setModalPredicting(true);
    setIsPredicting(true);
    setPredictProgress(0);
    
    try {
      // Simulate prediction progress
      const progressInterval = setInterval(() => {
        setPredictProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 25;
        });
      }, 600);

      setPredictProgress(10);
      
      const formData = new FormData();
      formData.append('file', modalBatchFile);
      
      const response = await fetch(`/api/model/predict/${viewExp.experiment_id}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPredictProgress(100);
        // setModalBatchPred(data.predictions || []); // This state variable is removed
        toast({ title: 'Batch prediction completed!', description: 'Batch prediction completed!' });
        
        setTimeout(() => {
          setIsPredicting(false);
          setPredictProgress(0);
        }, 2000);
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
        setIsPredicting(false);
        setPredictProgress(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
      setIsPredicting(false);
      setPredictProgress(0);
    } finally {
      setModalPredicting(false);
    }
  };

  // Helper functions for Export & Deployment section
  const downloadMetrics = (experiment: ExperimentMeta) => {
    if (!experiment.metrics) return;
    const dataStr = JSON.stringify(experiment.metrics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `metrics_${experiment.experiment_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Metrics downloaded!', description: 'Metrics saved as JSON file.' });
  };

  const downloadExperimentReport = (experiment: ExperimentMeta) => {
    // Create a simple HTML report that can be printed as PDF
    const reportHtml = `
      <html>
        <head>
          <title>Experiment Report - ${experiment.experiment_id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
            .metric { margin: 10px 0; }
            .metric strong { color: #007bff; }
            table { border-collapse: collapse; width: 100%; margin: 10px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ModelLab Experiment Report</h1>
            <p>Experiment ID: ${experiment.experiment_id}</p>
            <p>Created: ${new Date(experiment.created_at).toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h3>Configuration</h3>
            <div class="metric"><strong>Task:</strong> ${experiment.config.task}</div>
            <div class="metric"><strong>Algorithm:</strong> ${experiment.config.algorithm}</div>
            <div class="metric"><strong>Target:</strong> ${experiment.config.target}</div>
            <div class="metric"><strong>Features:</strong> ${experiment.config.features?.join(', ')}</div>
            <div class="metric"><strong>Metrics:</strong> ${experiment.config.metrics?.join(', ')}</div>
          </div>
          
          <div class="section">
            <h3>Hyperparameters</h3>
            <table>
              <tr><th>Parameter</th><th>Value</th></tr>
              ${experiment.config.hyperparams ? Object.entries(experiment.config.hyperparams).map(([k, v]) => 
                `<tr><td>${k}</td><td>${v}</td></tr>`
              ).join('') : '<tr><td colspan="2">No hyperparameters</td></tr>'}
            </table>
          </div>
          
          <div class="section">
            <h3>Results</h3>
            <table>
              <tr><th>Metric</th><th>Value</th></tr>
              ${experiment.metrics ? Object.entries(experiment.metrics).filter(([k]) => k !== 'charts').map(([k, v]) => 
                `<tr><td>${k}</td><td>${v}</td></tr>`
              ).join('') : '<tr><td colspan="2">No metrics available</td></tr>'}
            </table>
          </div>
          
          <div class="section">
            <h3>Deployment Status</h3>
            <div class="metric"><strong>Deployed:</strong> ${experiment.deployed ? 'Yes' : 'No'}</div>
            ${experiment.endpoint_url ? `<div class="metric"><strong>Endpoint:</strong> ${experiment.endpoint_url}</div>` : ''}
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment_report_${experiment.experiment_id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Report downloaded!', description: 'Open the HTML file and print as PDF.' });
  };

  const downloadPredictions = (predictions: any[]) => {
    if (!predictions || predictions.length === 0) return;
    const csv = [Object.keys(predictions[0]).join(',')]
      .concat(predictions.map(row => Object.values(row).map(v => JSON.stringify(v)).join(',')))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `predictions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Predictions downloaded!', description: 'Predictions saved as CSV file.' });
  };

  const downloadLogs = (experiment: ExperimentMeta) => {
    // Create a log file with experiment details and training information
    const logContent = `
Experiment Log Report
====================

Experiment ID: ${experiment.experiment_id}
Created: ${new Date(experiment.created_at).toLocaleString()}
Status: ${experiment.status}

Configuration:
- Task: ${experiment.config.task}
- Algorithm: ${experiment.config.algorithm}
- Target: ${experiment.config.target}
- Features: ${experiment.config.features?.join(', ')}
- Metrics: ${experiment.config.metrics?.join(', ')}

Hyperparameters:
${experiment.config.hyperparams ? Object.entries(experiment.config.hyperparams).map(([k, v]) => `- ${k}: ${v}`).join('\n') : '- No hyperparameters set'}

Results:
${experiment.metrics ? Object.entries(experiment.metrics).filter(([k]) => k !== 'charts').map(([k, v]) => `- ${k}: ${v}`).join('\n') : '- No metrics available'}

Deployment Status: ${experiment.deployed ? 'Deployed' : 'Not deployed'}
${experiment.endpoint_url ? `Endpoint: ${experiment.endpoint_url}` : ''}

Training Log:
- Training started at: ${new Date(experiment.created_at).toLocaleString()}
- Training completed at: ${experiment.status === 'complete' ? new Date().toLocaleString() : 'Not completed'}
- Training duration: ${experiment.status === 'complete' ? 'Completed successfully' : 'In progress or failed'}

Notes:
- This log was generated on: ${new Date().toLocaleString()}
- Model artifact available: ${experiment.status === 'complete' ? 'Yes' : 'No'}
    `;
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment_log_${experiment.experiment_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: 'Logs downloaded!', description: 'Experiment logs saved as text file.' });
  };

  const handleDeployExperiment = async (experiment: ExperimentMeta) => {
    setIsDeploying(true);
    setDeployProgress(0);
    
    try {
      // Simulate deployment progress
      const progressInterval = setInterval(() => {
        setDeployProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 800);

      setDeployProgress(10);
      
      const response = await fetch(`/api/model/deploy/${experiment.experiment_id}`, {
        method: "POST",
      });

      const data = await response.json();
      if (data.success) {
        setDeployProgress(100);
        toast({ title: 'Model deployed!', description: 'Model is now available for predictions.' });
        
        // Update the experiment in the list
        setExperiments(prev => prev.map(exp => 
          exp.experiment_id === experiment.experiment_id 
            ? { ...exp, deployed: true, endpoint_url: data.endpoint_url }
            : exp
        ));
        
        setTimeout(() => {
          setIsDeploying(false);
          setDeployProgress(0);
        }, 2000);
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
        setIsDeploying(false);
        setDeployProgress(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
      setIsDeploying(false);
      setDeployProgress(0);
    }
  };

  const handleBatchPredictExperiment = async (experiment: ExperimentMeta) => {
    if (!batchFile) return;
    setIsPredicting(true);
    setPredictProgress(0);
    
    try {
      // Simulate prediction progress
      const progressInterval = setInterval(() => {
        setPredictProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 25;
        });
      }, 600);

      setPredictProgress(10);
      
      const formData = new FormData();
      formData.append('file', batchFile);
      
      const response = await fetch(`/api/model/predict/${experiment.experiment_id}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setPredictProgress(100);
        // setBatchPredictions(data.predictions || []); // This state variable is removed
        toast({ title: 'Batch prediction completed!', description: 'Predictions ready for download.' });
        
        setTimeout(() => {
          setIsPredicting(false);
          setPredictProgress(0);
        }, 2000);
      } else {
        toast({ title: 'Error', description: data.error || "Something went wrong", variant: 'destructive' });
        setIsPredicting(false);
        setPredictProgress(0);
      }
    } catch (error) {
      toast({ title: 'Error', description: "Something went wrong", variant: 'destructive' });
      setIsPredicting(false);
      setPredictProgress(0);
    }
  };

  // Add handleTrain function
  const handleTrain = async (exp: ExperimentMeta) => {
    setTrainingExpId(exp.experiment_id);
    setTrainingProgress(0);
    setTrainingStatus('Starting training...');
    try {
      // Start training
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/api/model/train?experiment_id=${exp.experiment_id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to start training');
      setTrainingStatus('Training in progress...');
      toast({ title: 'Training started', description: `Experiment ${exp.experiment_id} is now running.` });
      // Simulate progress bar
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + Math.random() * 20, 90);
        setTrainingProgress(progress);
      }, 800);
      // Poll backend for status
      let status = 'queued';
      while (status !== 'complete' && status !== 'failed') {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await fetch(`${backendUrl}/api/model/status/${exp.experiment_id}`);
        const statusData = await statusRes.json();
        status = statusData.status;
        setTrainingStatus(`Status: ${status}`);
        if (status === 'running') setTrainingProgress(Math.max(progress, 30));
      }
      clearInterval(progressInterval);
      setTrainingProgress(100);
      setTrainingStatus(status === 'complete' ? 'Training complete!' : 'Training failed');
      await fetchExperiments();
      setTimeout(() => {
        setTrainingExpId(null);
        setTrainingProgress(0);
        setTrainingStatus('');
      }, 2000);
    } catch (err: any) {
      setTrainingStatus('Training failed');
      setTrainingExpId(null);
      setTrainingProgress(0);
      toast({ title: 'Error', description: err.message || 'Failed to start training', variant: 'destructive' });
    }
  };

  // Find the latest completed experiment with metrics
  const latestCompletedExperiment = experiments
    .filter(exp => exp.status === 'complete' && exp.metrics)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  const [copyClicked, setCopyClicked] = useState(false);
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const autoDeploy = searchParams?.get('deploy') === '1';
  const [autoDeployed, setAutoDeployed] = useState(false);

  useEffect(() => {
    if (autoDeploy && !autoDeployed && latestCompletedExperiment) {
      setAutoDeployed(true);
      handleDeployExperiment(latestCompletedExperiment);
    }
  }, [autoDeploy, autoDeployed, latestCompletedExperiment]);

  const [splitRatio, setSplitRatio] = useState(0.8);
  const [splitSummary, setSplitSummary] = useState<{train: number, test: number} | null>(null);
  const [splitting, setSplitting] = useState(false);
  const [activeTrainDataset, setActiveTrainDataset] = useState<DatasetMeta | null>(null);

  if (!mounted) {
    // Skeleton loader for SSR
    return <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-10 px-4 animate-fade-in motion-safe:animate-fade-in">
      {/* 1. Dataset Selection */}
      <Card title={<span id="select-dataset" className="text-3xl font-extrabold">Select Dataset</span>}>
        <div className="flex flex-col gap-4">
          <label htmlFor="dataset-select" className="font-semibold mb-1">Choose a dataset:</label>
          <select
            id="dataset-select"
            className="w-full max-w-md border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
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
            <div className="mt-4 space-y-2 bg-muted rounded p-4">
              <div className="font-semibold text-lg mb-2">Dataset Summary</div>
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
      </Card>

      {/* 1.5. Train-Test Split */}
      <Card title={<span id="train-test-split" className="text-2xl font-bold">Train-Test Split</span>}>
        <div className="flex flex-col gap-4">
          <label className="font-semibold">Split Ratio (Train %)</label>
          <input
            type="range"
            min={0.5}
            max={0.95}
            step={0.01}
            value={splitRatio}
            onChange={e => setSplitRatio(Number(e.target.value))}
            className="w-full max-w-md"
            disabled={!selectedDataset || splitting}
          />
          <div className="flex gap-4 text-sm">
            <span>Train: <span className="font-bold">{Math.round(splitRatio * 100)}%</span></span>
            <span>Test: <span className="font-bold">{100 - Math.round(splitRatio * 100)}%</span></span>
          </div>
          <button
            className="px-6 py-2 rounded bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all w-fit"
            onClick={async () => {
              if (!selectedDataset) return;
              setSplitting(true);
              setSplitSummary(null);
              try {
                const res = await fetch(`/api/data/split`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ dataset_id: selectedDataset.dataset_id, train_ratio: splitRatio }),
                });
                if (!res.ok) throw new Error('Failed to split dataset');
                const data = await res.json();
                setSplitSummary({ train: data.train_size, test: data.test_size });
                toast({ title: 'Split successful', description: `Train: ${data.train_size} rows, Test: ${data.test_size} rows` });
                // Refresh datasets and set activeTrainDataset
                if (data.train_dataset_id) {
                  const dsRes = await fetch('/api/data/list');
                  const dsList = await dsRes.json();
                  setDatasets(dsList);
                  const trainDs = dsList.find((d: any) => d.dataset_id === data.train_dataset_id);
                  if (trainDs) setActiveTrainDataset(trainDs);
                }
              } catch (err: any) {
                toast({ title: 'Error', description: err.message || 'Failed to split dataset', variant: 'destructive' });
              } finally {
                setSplitting(false);
              }
            }}
            disabled={!selectedDataset || splitting}
          >
            {splitting ? 'Splitting...' : 'Apply Split'}
          </button>
          {splitSummary && (
            <div className="text-green-700 font-medium mt-2">Split applied: Train = {splitSummary.train} rows, Test = {splitSummary.test} rows</div>
          )}
          {splitSummary && selectedDataset && (
            <div className="flex gap-4 mt-2">
              <button
                className="px-5 py-2 rounded bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/data/download_train?dataset_id=${selectedDataset.dataset_id}`);
                    if (!res.ok) throw new Error('Failed to download train set');
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDataset.filename.replace(/\.[^/.]+$/, '')}_train.csv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    toast({ title: 'Train set downloaded' });
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to download train set', variant: 'destructive' });
                  }
                }}
              >
                Download Train
              </button>
              <button
                className="px-5 py-2 rounded bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all"
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/data/download_test?dataset_id=${selectedDataset.dataset_id}`);
                    if (!res.ok) throw new Error('Failed to download test set');
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDataset.filename.replace(/\.[^/.]+$/, '')}_test.csv`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    toast({ title: 'Test set downloaded' });
                  } catch (err: any) {
                    toast({ title: 'Error', description: err.message || 'Failed to download test set', variant: 'destructive' });
                  }
                }}
              >
                Download Test
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 2. Model Config & Creation */}
      <Card title={<span id="configure-model" className="text-3xl font-extrabold">Configure Model</span>}>
        {activeTrainDataset && (
          <div className="mb-6 p-5 rounded-xl bg-accent/80 border border-primary shadow-md flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white italic">
              <Info className="w-5 h-5 text-white opacity-80" />
              <span className="font-semibold not-italic">Note:</span>
              <span>Using split training set for all model operations.</span>
            </div>
            <div className="flex items-center gap-2 text-white italic">
              <Info className="w-5 h-5 text-white opacity-80" />
              <span className="font-semibold not-italic">Note:</span>
              <span>Your train dataset is going for training.</span>
            </div>
          </div>
        )}
        {/* Use activeTrainDataset if set, otherwise selectedDataset for all config/experiment logic */}
        {(activeTrainDataset || selectedDataset) && task && algorithm && (
          <div className="mb-6 p-5 rounded-xl bg-accent/80 border border-primary shadow-md flex flex-col gap-2">
            <div className="font-semibold text-base mb-1 text-primary">Model Recommendation</div>
            <ModelSummary
              dataset={(activeTrainDataset || selectedDataset)!.dataset_id}
              task={task}
              algorithm={algorithm}
            />
          </div>
        )}
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="font-semibold text-base text-foreground">Task</label>
            <select
              className="w-full max-w-md border border-border rounded-lg px-4 py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base font-medium"
              value={task ?? ''}
              onChange={e => setTask(e.target.value as keyof typeof METRICS)}
            >
              {MODEL_TASKS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-base text-foreground">Algorithm</label>
            <select
              className="w-full max-w-md border border-border rounded-lg px-4 py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base font-medium"
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
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <div className="font-semibold text-base mb-4 text-foreground">Hyperparameters</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HYPERPARAMS[algorithm].map(hp => (
                  <div key={hp.name} className="flex flex-col space-y-2">
                    <label className="font-medium text-sm text-foreground">{hp.label}</label>
                    {hp.type === 'checkbox' ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={!!hyperparams[hp.name]}
                          onChange={e => setHyperparams(hp => ({ ...hp, [hp.name]: e.target.checked }))}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-muted-foreground">Enable {hp.label}</span>
                      </div>
                    ) : (
                      <input
                        type={hp.type}
                        step={hp.step || undefined}
                        className="border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
                        value={String(hyperparams[hp.name] ?? '')}
                        onChange={e => setHyperparams(hp => ({ ...hp, [hp.name]: e.target.value }))}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Target column selection */}
          {(activeTrainDataset || selectedDataset) && (
            <div className="space-y-2">
              <label className="font-semibold text-base text-foreground">Target Column</label>
              <select
                className="w-full max-w-md border border-border rounded-lg px-4 py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base font-medium"
                value={target}
                onChange={e => setTarget(e.target.value)}
              >
                <option value="" disabled>Select target...</option>
                {Array.isArray((activeTrainDataset || selectedDataset)?.features) && (activeTrainDataset || selectedDataset)!.features.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
          {/* Feature columns multi-select */}
          {(activeTrainDataset || selectedDataset) && (
            <div className="space-y-2">
              <label className="font-semibold text-base text-foreground">Feature Columns</label>
              <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-border bg-muted/30">
                {Array.isArray((activeTrainDataset || selectedDataset)?.features) && (activeTrainDataset || selectedDataset)!.features.map(col => (
                  <label key={col} className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 cursor-pointer text-base font-medium text-foreground bg-background shadow-sm transition-all hover:border-primary hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={features.includes(col)}
                      onChange={e => {
                        setFeatures(f => e.target.checked ? [...f, col] : f.filter(x => x !== col));
                      }}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    {col}
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Metrics multi-select */}
          <div className="space-y-2">
            <label className="font-semibold text-base text-foreground">Metrics</label>
            <div className="flex flex-wrap gap-3 p-4 rounded-lg border border-border bg-muted/30">
              {METRICS[task].map((m: { value: string; label: string }) => (
                <label key={m.value} className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 cursor-pointer text-base font-medium text-foreground bg-background shadow-sm transition-all hover:border-primary hover:bg-primary/5">
                  <input
                    type="checkbox"
                    checked={metrics.includes(m.value)}
                    onChange={e => {
                      setMetrics(ms => e.target.checked ? [...ms, m.value] : ms.filter(x => x !== m.value));
                    }}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  {m.label}
                </label>
              ))}
            </div>
          </div>
          <button
            className="mt-4 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg disabled:opacity-60 shadow-lg border border-primary w-fit self-start transition-all hover:bg-primary/90 hover:border-white"
            onClick={handleCreateExperiment}
            disabled={creating || !selectedDataset || !target || features.length === 0 || metrics.length === 0}
          >
            {creating ? 'Creating...' : 'Create Experiment'}
          </button>
          
          {/* Training Progress Bar */}
          {isTraining && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{trainingStatus}</span>
                <span className="text-muted-foreground">{Math.round(trainingProgress)}%</span>
              </div>
              <Progress value={trainingProgress} className="w-full" />
            </div>
          )}
        </div>
      </Card>

      {/* 3. Experiment Management */}
      <Card title={<span id="experiments" className="text-3xl font-extrabold">Experiments</span>}>
        {experiments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-lg mb-2">No experiments yet</div>
            <div className="text-sm">Create and run a new experiment to see it listed here.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((exp: ExperimentMeta) => (
              <div 
                key={exp.experiment_id} 
                className={`border rounded-lg p-6 bg-card shadow flex flex-col gap-2 transition-all ${
                  latestCompletedExperiment && exp.experiment_id === latestCompletedExperiment.experiment_id 
                    ? 'border-primary border-2 shadow-lg' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg">{exp.config.algorithm}</div>
                  <span className={`text-xs px-2 py-1 rounded ${exp.status === 'complete' ? 'bg-green-100 text-green-700' : exp.status === 'running' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{exp.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">{exp.created_at}</div>
                <div className="text-sm">Task: <span className="font-semibold">{exp.config.task}</span></div>
                <div className="text-sm">Target: <span className="font-semibold">{exp.config.target}</span></div>
                <div className="text-xs text-muted-foreground">Features: {exp.config.features?.join(', ')}</div>
                <div className="flex gap-3 mt-3">
                  <button className="px-3 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={() => handleView(exp)}>View</button>
                  {['queued', 'failed'].includes(exp.status) && (
                    <button className="px-3 py-1 rounded bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all" onClick={() => handleTrain(exp)}>
                      Train
                    </button>
                  )}
                  <button className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={() => handleDelete(exp)} disabled={trainingExpId === exp.experiment_id}>Delete</button>
                  {/* Progress bar for this experiment */}
                  {trainingExpId === exp.experiment_id && (
                    <div className="flex-1 mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{trainingStatus}</span>
                        <span>{Math.round(trainingProgress)}%</span>
                      </div>
                      <Progress value={trainingProgress} className="w-full" />
                    </div>
                  )}
                  {exp.status === 'complete' && (
                    <>
                      <a href={`/api/model/artifact/${exp.experiment_id}`} className="px-3 py-1 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition" download>Download Pickle</a>
                      <button className="px-3 py-1 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700 transition" onClick={() => handleView(exp)}>Deploy</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 4. Results & Analysis */}
      <Card title={<span id="results" className="text-3xl font-extrabold">Results & Analysis</span>}>
        {latestCompletedExperiment && latestCompletedExperiment.metrics ? (
          <>
            <div className="flex flex-col md:flex-row gap-8 mb-4 items-start">
              {/* Metrics */}
              <div className="min-w-[220px] flex-1">
                <div className="font-semibold mb-2">Metrics:</div>
                <ul className="ml-4 list-disc">
                  {Object.entries(latestCompletedExperiment.metrics).map(([k, v]) => (
                    k !== 'charts' ? <li key={k}><span className="font-medium">{k}:</span> {String(v)}</li> : null
                  ))}
                </ul>
              </div>
            </div>
            {/* Download buttons for metrics, predictions, logs */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow hover:bg-primary/90 hover:border-white border border-primary transition-all" onClick={() => downloadMetrics(latestCompletedExperiment)}>
                Download Metrics
              </button>
              
              <button className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow hover:bg-primary/90 hover:border-white border border-primary transition-all" onClick={() => downloadLogs(latestCompletedExperiment)}>
                Download Logs
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">No completed experiment results yet.</div>
        )}
      </Card>

      {/* 5. Export & Deployment */}
      <Card title={<span id="export" className="text-3xl font-extrabold">Export & Deployment</span>}>
        {latestCompletedExperiment ? (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Model Export</h3>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={`/api/model/artifact/${latestCompletedExperiment.experiment_id}`} 
                  className="px-5 py-2 rounded-lg bg-green-600 text-white font-bold text-base shadow hover:bg-green-700 border border-green-600 transition-all flex items-center gap-2" 
                  download
                >
                   Download Pickle (.pkl)
                </a>
                <button 
                  className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-base shadow hover:bg-primary/90 hover:border-white border border-primary transition-all flex items-center gap-2"
                  onClick={() => downloadMetrics(latestCompletedExperiment)}
                >
                   Download Metrics (JSON)
                </button>
                <button 
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-bold text-base shadow hover:bg-purple-700 border border-purple-600 transition-all flex items-center gap-2"
                  onClick={() => downloadExperimentReport(latestCompletedExperiment)}
                >
                   Download Report (PDF)
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2">Model Deployment</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button 
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white font-bold text-base shadow hover:bg-orange-700 border border-orange-600 transition-all flex items-center gap-2" 
                  onClick={() => handleDeployExperiment(latestCompletedExperiment)}
                  disabled={latestCompletedExperiment.deployed}
                >
                  {latestCompletedExperiment.deployed ? '✅ Deployed' : 'Deploy Model'}
                </button>
                {latestCompletedExperiment.deployed && latestCompletedExperiment.endpoint_url && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm text-foreground">API Endpoint:</span>
                      <button
                        onClick={() => {
                          if (latestCompletedExperiment.endpoint_url) {
                            navigator.clipboard.writeText(latestCompletedExperiment.endpoint_url);
                            setCopyClicked(true);
                            toast({ title: 'Copied!', description: 'Endpoint URL copied to clipboard.' });
                            setTimeout(() => setCopyClicked(false), 2000);
                          }
                        }}
                        className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                      >
                        {copyClicked ? '✓' : 'Copy'}
                      </button>
                    </div>
                    <div className="font-mono text-sm bg-background px-3 py-2 rounded border text-foreground break-all">
                      {latestCompletedExperiment.endpoint_url}
                    </div>

                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              {/* Batch Prediction section removed */}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <div className="text-lg mb-2">No completed experiments available</div>
            <div className="text-sm">Create and complete an experiment to access export and deployment features.</div>
          </div>
        )}
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
                {/* Batch Prediction section removed */}
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
          <div className="bg-background rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] p-8 border border-border relative animate-fade-in text-foreground overflow-y-auto">
            <button className="absolute top-3 right-3 text-2xl text-muted-foreground hover:text-primary transition" onClick={() => setViewModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-primary">Experiment Details</h2>
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
                  <div className="mt-4">
                    <button className="inline-block px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all" onClick={handleDeploy} disabled={modalDeploying}>
                      {modalDeploying ? 'Deploying...' : 'Deploy'}
                    </button>
                    {/* Deployment Progress Bar */}
                    {isDeploying && (
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Deploying model...</span>
                          <span className="text-muted-foreground">{Math.round(deployProgress)}%</span>
                        </div>
                        <Progress value={deployProgress} className="w-full" />
                      </div>
                    )}
                  </div>
                )}
                {modalStatus === 'complete' && modalDeployed && (
                  <div className="mt-4">
                    <button className="inline-block px-5 py-2 rounded-lg bg-green-600 text-white font-semibold border border-green-600 shadow cursor-default">
                      Deployed
                    </button>
                  </div>
                )}
                {modalStatus === 'complete' && modalDeployed && (
                  <div className="mt-6">
                    <div className="font-semibold mb-2 text-primary">Model Testing</div>
                    <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="text-sm text-foreground font-medium mb-1">Test Your Deployed Model</div>
                      <div className="text-sm text-foreground">
                        Your model is now deployed and ready for testing. Click the button below to navigate to the testing section where you can upload datasets and get predictions.
                      </div>
                    </div>
                    <button
                      className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all"
                      onClick={() => {
                        // Navigate to testing section
                        window.location.href = '/dashboard/testing';
                      }}
                    >
                       Go to Testing Section
                    </button>
                  </div>
                )}
                <div className="flex gap-4 mt-6">
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
          <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full p-8 border border-border relative animate-fade-in text-foreground">
            <h2 className="text-2xl font-bold mb-4 text-primary">Delete Experiment?</h2>
            <div className="mb-6 text-foreground">Are you sure you want to delete this experiment? This action cannot be undone.</div>
            <div className="flex gap-3 justify-end">
              <button className="px-5 py-2 rounded-lg bg-muted text-foreground font-semibold border border-border hover:bg-muted/80 transition-all" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="px-5 py-2 rounded-lg bg-destructive text-destructive-foreground font-semibold border border-destructive hover:bg-destructive/90 transition-all" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Testing Section Button - Only show when model is trained */}
      {latestCompletedExperiment && latestCompletedExperiment.metrics && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-semibold border border-primary shadow-lg hover:bg-primary/90 hover:border-white transition-all"
            onClick={() => {
              window.location.href = '/dashboard/testing';
            }}
          >
            Go to Testing
          </button>
        </div>
      )}
    </div>
  );
};

function ModelSummary({ dataset, task, algorithm }: { dataset: string, task: string, algorithm: string }) {
  // Simple rules for summary (can be expanded)
  let summary = '';
  let benefits = '';
  if (task === 'classification') {
    if (algorithm === 'random_forest') {
      summary = 'Random Forest is a robust ensemble method for classification tasks.';
      benefits = 'It handles both numerical and categorical features, is resistant to overfitting, and works well with datasets with many features or missing values.';
    } else if (algorithm === 'xgboost') {
      summary = 'XGBoost is a powerful gradient boosting algorithm for classification.';
      benefits = 'It is highly accurate, handles missing data, and is efficient for large datasets.';
    } else if (algorithm === 'logistic_regression') {
      summary = 'Logistic Regression is a simple, interpretable model for binary or multiclass classification.';
      benefits = 'It is fast, easy to interpret, and works well when the relationship between features and target is linear.';
    }
  } else if (task === 'regression') {
    if (algorithm === 'random_forest_regressor') {
      summary = 'Random Forest Regressor is an ensemble method for regression tasks.';
      benefits = 'It captures non-linear relationships, is robust to outliers, and works well with mixed feature types.';
    } else if (algorithm === 'xgboost_regressor') {
      summary = 'XGBoost Regressor is a high-performance gradient boosting model for regression.';
      benefits = 'It is efficient, handles missing values, and often achieves state-of-the-art results.';
    } else if (algorithm === 'linear_regression') {
      summary = 'Linear Regression is a simple, interpretable model for regression.';
      benefits = 'It is fast, easy to interpret, and works well when the relationship between features and target is linear.';
    }
  } else if (task === 'clustering') {
    if (algorithm === 'kmeans') {
      summary = 'K-Means is a popular clustering algorithm for partitioning data into groups.';
      benefits = 'It is efficient, easy to implement, and works well when clusters are spherical and similar in size.';
    } else if (algorithm === 'dbscan') {
      summary = 'DBSCAN is a density-based clustering algorithm.';
      benefits = 'It can find arbitrarily shaped clusters and is robust to outliers.';
    }
  }
  return (
    <div>
      <div className="text-sm mb-1"><span className="font-medium">Recommended Model:</span> {algorithm.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
      <div className="text-sm mb-1"><span className="font-medium">Why this model?</span> {summary}</div>
      <div className="text-xs text-muted-foreground"><span className="font-medium">Benefits:</span> {benefits}</div>
    </div>
  );
}

export default ModelLabPageImpl; 