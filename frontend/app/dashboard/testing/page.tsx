'use client';

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import TestingCard from '@/components/dashboard/TestingCard';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DeployedModel {
  experiment_id: string;
  algorithm: string;
  task: string;
  target: string;
  features: string[];
  endpoint_url: string;
  accuracy?: number;
  f1_score?: number;
  deployed_at: string;
  config?: {
    algorithm: string;
    task: string;
    target: string;
    features: string[];
  };
  metrics?: {
    accuracy: number;
    f1: number;
  };
}

interface PredictionResult {
  input: Record<string, any>;
  prediction: number | string;
  probability?: number;
}

interface ConfusionMatrix {
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

export default function TestingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [deployedModels, setDeployedModels] = useState<DeployedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<DeployedModel | null>(null);
  const [testFile, setTestFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);
  const [confusionMatrix, setConfusionMatrix] = useState<ConfusionMatrix | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch deployed models
  useEffect(() => {
    const fetchDeployedModels = async () => {
      setLoading(true);
      try {
        console.log('Fetching deployed models...');
        const response = await fetch('/api/predict/deployed');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('Raw response:', text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          console.log('Response was not JSON, using fallback data');
          throw new Error('Invalid JSON response');
        }
        
        console.log('Deployed models data:', data);
        console.log('Models array:', data.models);
        setDeployedModels(data.models || []);
      } catch (error) {
        console.error('Error fetching deployed models:', error);
        console.log('Using fallback mock data...');
        // Mock data for demonstration
        setDeployedModels([
          {
            experiment_id: 'exp_001',
            algorithm: 'Random Forest',
            task: 'classification',
            target: 'target_column',
            features: ['feature1', 'feature2', 'feature3'],
            endpoint_url: 'https://api.example.com/predict/exp_001',
            accuracy: 0.95,
            f1_score: 0.93,
            deployed_at: '2024-01-15T10:30:00Z'
          },
          {
            experiment_id: 'exp_002',
            algorithm: 'XGBoost',
            task: 'regression',
            target: 'price',
            features: ['area', 'bedrooms', 'bathrooms'],
            endpoint_url: 'https://api.example.com/predict/exp_002',
            accuracy: 0.88,
            deployed_at: '2024-01-16T14:20:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeployedModels();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTestFile(e.target.files[0]);
    }
  };

  const handlePredict = async () => {
    if (!selectedModel || !testFile) {
      toast({ title: 'Error', description: 'Please select a model and upload a test file.', variant: 'destructive' });
      return;
    }

    setIsPredicting(true);
    setPredictionProgress(0);
    setPredictions(null);
    setConfusionMatrix(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setPredictionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('model_id', selectedModel.experiment_id);

      console.log('Sending prediction request...');
      const response = await fetch('/api/predict/predict', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError);
        throw new Error('Invalid JSON response');
      }

      console.log('Prediction data:', data);

      if (data.success && data.predictions) {
        setPredictions(data.predictions);
        
        // Generate confusion matrix if actual values are provided
        if (data.actual_values && data.actual_values.length > 0) {
          const matrix = generateConfusionMatrix(data.predictions, data.actual_values);
          setConfusionMatrix(matrix);
        }
        
        toast({ title: 'Success!', description: `Generated ${data.predictions.length} predictions.` });
      } else {
        throw new Error(data.error || 'Failed to generate predictions');
      }
    } catch (error) {
      console.error('Error making predictions:', error);
      toast({ 
        title: 'Error', 
        description: error instanceof Error ? error.message : 'Failed to make predictions', 
        variant: 'destructive' 
      });
    } finally {
      clearInterval(progressInterval);
      setPredictionProgress(100);
      setTimeout(() => setIsPredicting(false), 500);
    }
  };

  const generateConfusionMatrix = (predictions: any[], actualValues: any[]): ConfusionMatrix => {
    let tp = 0, fp = 0, tn = 0, fn = 0;

    predictions.forEach((pred, index) => {
      const actual = actualValues[index];
      const predicted = pred.prediction;

      if (actual === 1 && predicted === 1) tp++;
      else if (actual === 0 && predicted === 1) fp++;
      else if (actual === 1 && predicted === 0) fn++;
      else if (actual === 0 && predicted === 0) tn++;
    });

    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1_score = 2 * (precision * recall) / (precision + recall) || 0;

    return {
      true_positives: tp,
      false_positives: fp,
      true_negatives: tn,
      false_negatives: fn,
      accuracy,
      precision,
      recall,
      f1_score
    };
  };

  const downloadPredictions = () => {
    if (!predictions || !predictions.length) return;

    const csv = [
      Object.keys(predictions[0]).join(','),
      ...predictions.map(p => Object.values(p).map(v => JSON.stringify(v)).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `predictions_${selectedModel?.experiment_id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: 'Downloaded!', description: 'Predictions saved as CSV file.' });
  };

  const downloadReport = () => {
    if (!predictions || !predictions.length || !selectedModel) return;

    // Calculate summary statistics
    const totalPredictions = predictions.length;
    const positivePredictions = predictions.filter(p => p.prediction === 1).length;
    const negativePredictions = predictions.filter(p => p.prediction === 0).length;
    const highConfidence = predictions.filter(p => p.probability && p.probability > 0.8).length;
    const avgConfidence = predictions.filter(p => p.probability).length > 0 
      ? (predictions.reduce((sum, p) => sum + (p.probability || 0), 0) / predictions.filter(p => p.probability).length * 100).toFixed(1)
      : '0.0';

    // Generate simple CSV report instead of HTML to avoid template literal issues
    const csvContent = [
      'Model Testing Report',
      `Model: ${selectedModel.config?.algorithm || selectedModel.algorithm}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'Summary',
      `Total Predictions,${totalPredictions}`,
      `Positive Predictions,${positivePredictions}`,
      `Negative Predictions,${negativePredictions}`,
      `High Confidence,${highConfidence}`,
      `Average Confidence,${avgConfidence}%`,
      '',
      'Detailed Predictions',
      'Input Features,Prediction' + (predictions[0]?.probability ? ',Probability' : ''),
      ...predictions.map(p => {
        const features = Object.entries(p.input).map(([k, v]) => `${k}: ${v}`).join('; ');
        const row = [features, p.prediction];
        if (p.probability) {
          row.push(`${(p.probability * 100).toFixed(1)}%`);
        }
        return row.join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `model_testing_report_${selectedModel.experiment_id}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: 'Report Downloaded!', description: 'Testing report saved as CSV file.' });
  };

  if (!mounted) {
    return <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-10 px-4 animate-fade-in motion-safe:animate-fade-in">
      {/* Model Selection */}
      <TestingCard title={<span id="model-selection" className="text-3xl font-extrabold">Model Selection</span>}>
        <div className="space-y-4">
          <label className="font-semibold text-base">Select a deployed model:</label>
          <select
            className="w-full max-w-md border border-border rounded-lg px-4 py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={selectedModel?.experiment_id ?? ''}
            onChange={(e) => {
              console.log('Model selection changed:', e.target.value);
              const model = deployedModels.find(m => m.experiment_id === e.target.value);
              console.log('Found model:', model);
              setSelectedModel(model || null);
            }}
          >
            <option value="">Choose a model...</option>
            {deployedModels.map(model => (
              <option key={model.experiment_id} value={model.experiment_id}>
                {model.config?.algorithm || model.algorithm} - {model.config?.task || model.task} (ID: {model.experiment_id})
              </option>
            ))}
          </select>

          {selectedModel && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <h3 className="font-semibold mb-2">Model Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-medium">Algorithm:</span> {selectedModel.config?.algorithm || selectedModel.algorithm || 'N/A'}</div>
                <div><span className="font-medium">Task:</span> {selectedModel.config?.task || selectedModel.task || 'N/A'}</div>
                <div><span className="font-medium">Target:</span> {selectedModel.config?.target || selectedModel.target || 'N/A'}</div>
                <div><span className="font-medium">Features:</span> {selectedModel.config?.features ? selectedModel.config.features.length : (selectedModel.features ? selectedModel.features.length : 0)}</div>
                {selectedModel.metrics?.accuracy && (
                  <div><span className="font-medium">Accuracy:</span> {(selectedModel.metrics.accuracy * 100).toFixed(1)}%</div>
                )}
                {selectedModel.metrics?.f1 && (
                  <div><span className="font-medium">F1 Score:</span> {(selectedModel.metrics.f1 * 100).toFixed(1)}%</div>
                )}
              </div>
            </div>
          )}
        </div>
      </TestingCard>

      {/* File Upload */}
      <TestingCard title={<span id="file-upload" className="text-3xl font-extrabold">Test Data Upload</span>}>
        <div className="space-y-4">
          <div>
            <label className="font-semibold text-base mb-2 block">Upload test dataset:</label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="w-full max-w-md border border-border rounded-lg px-4 py-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {testFile && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{testFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Size: {(testFile.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  onClick={() => setTestFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handlePredict}
            disabled={!selectedModel || !testFile || isPredicting}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold border border-primary shadow hover:bg-primary/90 hover:border-white transition-all disabled:opacity-50"
          >
            {isPredicting ? 'Making Predictions...' : 'Run Predictions'}
          </button>

          {isPredicting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Processing predictions...</span>
                <span className="text-muted-foreground">{Math.round(predictionProgress)}%</span>
              </div>
              <Progress value={predictionProgress} className="w-full" />
            </div>
          )}
        </div>
      </TestingCard>

      {/* Predictions Results */}
      {predictions && predictions.length > 0 && (
        <TestingCard title={<span id="predictions" className="text-3xl font-extrabold">Prediction Results</span>}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {predictions.length} predictions generated
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadPredictions}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                >
                  Download CSV
                </button>
                <button
                  onClick={downloadReport}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all"
                >
                  Download Report
                </button>
              </div>
            </div>

            {/* Prediction Summary */}
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Prediction Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-primary">{predictions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Predictions</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">
                    {predictions.filter(p => p.prediction === 1).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Positive Predictions</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">
                    {predictions.filter(p => p.prediction === 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Negative Predictions</div>
                </div>
                <div className="text-center p-3 bg-background rounded-lg border">
                  <div className="text-2xl font-bold text-blue-600">
                    {predictions.filter((p) => p.probability && p.probability > 0.8).length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Confidence ({'>'}80%)</div>
                </div>
              </div>
              
              {/* Additional Statistics */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border">
                  <div className="font-semibold text-lg mb-3 text-foreground">Confidence Distribution</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">High (80-100%)</span>
                      </div>
                      <span className="font-bold text-green-600">{predictions.filter(p => p.probability && p.probability >= 0.8).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">Medium (60-79%)</span>
                      </div>
                      <span className="font-bold text-yellow-600">{predictions.filter(p => p.probability && p.probability >= 0.6 && p.probability < 0.8).length}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium">Low (0-59%)</span>
                      </div>
                      <span className="font-bold text-red-600">{predictions.filter(p => p.probability && p.probability < 0.6).length}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                  <div className="font-semibold text-lg mb-3 text-foreground">Average Confidence</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {predictions.filter(p => p.probability).length > 0
                        ? ((predictions.reduce((sum, p) => sum + (p.probability || 0), 0) / predictions.filter(p => p.probability).length) * 100).toFixed(1)
                        : '0.0'}%
                    </div>
                    <div className="text-sm text-muted-foreground">Across all predictions</div>
                    <div className="mt-3 p-2 bg-primary/10 rounded-lg">
                      <div className="text-xs text-primary font-medium">Confidence Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg">
              <table className="w-full">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left border-b">Input Features</th>
                    <th className="px-4 py-2 text-left border-b">Prediction</th>
                    {predictions[0]?.probability && (
                      <th className="px-4 py-2 text-left border-b">Probability</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {predictions.slice(0, 10).map((pred, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="px-4 py-2 border-b">
                        <div className="space-y-1">
                          {Object.entries(pred.input).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="font-medium text-muted-foreground min-w-[80px]">{key}:</span>
                              <span className="font-semibold text-foreground ml-2">
                                {typeof value === 'number' ? value.toFixed(3) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 border-b font-medium">
                        {pred.prediction}
                      </td>
                      {pred.probability && (
                        <td className="px-4 py-2 border-b">
                          {(pred.probability * 100).toFixed(1)}%
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {predictions.length > 10 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Showing first 10 predictions. Download CSV for complete results.
                </div>
              )}
            </div>
          </div>
        </TestingCard>
      )}

      {/* Confusion Matrix */}
      {predictions && predictions.length > 0 && confusionMatrix && (
        <TestingCard title={<span id="confusion-matrix" className="text-3xl font-extrabold">Confusion Matrix & Metrics</span>}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Confusion Matrix Visualization */}
            <div>
              <h3 className="font-semibold mb-4">Confusion Matrix</h3>
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                <div className="p-4 bg-green-100 text-green-800 text-center rounded-lg">
                  <div className="text-2xl font-bold">{confusionMatrix?.true_positives || 0}</div>
                  <div className="text-sm">True Positives</div>
                </div>
                <div className="p-4 bg-red-100 text-red-800 text-center rounded-lg">
                  <div className="text-2xl font-bold">{confusionMatrix?.false_positives || 0}</div>
                  <div className="text-sm">False Positives</div>
                </div>
                <div className="p-4 bg-red-100 text-red-800 text-center rounded-lg">
                  <div className="text-2xl font-bold">{confusionMatrix?.false_negatives || 0}</div>
                  <div className="text-sm">False Negatives</div>
                </div>
                <div className="p-4 bg-green-100 text-green-800 text-center rounded-lg">
                  <div className="text-2xl font-bold">{confusionMatrix?.true_negatives || 0}</div>
                  <div className="text-sm">True Negatives</div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div>
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Accuracy</span>
                  <span className="font-bold text-lg">{((confusionMatrix?.accuracy || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Precision</span>
                  <span className="font-bold text-lg">{((confusionMatrix?.precision || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Recall</span>
                  <span className="font-bold text-lg">{((confusionMatrix?.recall || 0) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">F1 Score</span>
                  <span className="font-bold text-lg">{((confusionMatrix?.f1_score || 0) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confusion Matrix Chart */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Confusion Matrix Chart</h3>
            <div className="max-w-md mx-auto">
              <Doughnut
                data={{
                  labels: ['True Positives', 'False Positives', 'False Negatives', 'True Negatives'],
                  datasets: [{
                    data: [
                      confusionMatrix?.true_positives || 0,
                      confusionMatrix?.false_positives || 0,
                      confusionMatrix?.false_negatives || 0,
                      confusionMatrix?.true_negatives || 0
                    ],
                    backgroundColor: [
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(34, 197, 94, 0.8)'
                    ],
                    borderColor: [
                      'rgba(34, 197, 94, 1)',
                      'rgba(239, 68, 68, 1)',
                      'rgba(239, 68, 68, 1)',
                      'rgba(34, 197, 94, 1)'
                    ],
                    borderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    },
                    title: {
                      display: true,
                      text: 'Confusion Matrix Distribution'
                    }
                  }
                }}
              />
            </div>
          </div>
        </TestingCard>
      )}
    </div>
  );
} 