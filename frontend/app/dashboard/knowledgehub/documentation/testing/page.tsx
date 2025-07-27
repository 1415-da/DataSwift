import React from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Info, ArrowRight, TestTube, BarChart3, FileText, Download } from 'lucide-react';

export default function TestingDocumentationPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Model Testing Documentation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Learn how to test your deployed models, make predictions, and evaluate performance metrics in DataSwift.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#model-selection" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Model Selection</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#file-upload" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <FileText className="w-5 h-5 text-primary" />
            <span>Test Data Upload</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#predictions" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <TestTube className="w-5 h-5 text-primary" />
            <span>Prediction Results</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#confusion-matrix" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Confusion Matrix</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            The Model Testing feature allows you to evaluate the performance of your deployed machine learning models. 
            You can upload test datasets, make predictions, and analyze results to ensure your models are performing as expected.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Easy Model Selection</h3>
              <p className="text-sm text-green-700">Choose from your deployed models with detailed information</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">Flexible Data Upload</h3>
              <p className="text-sm text-blue-700">Support for CSV, Excel, and other common formats</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Comprehensive Analysis</h3>
              <p className="text-sm text-purple-700">Detailed metrics and visualizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Model Selection */}
      <section id="model-selection" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Model Selection</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">How to Select a Model</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Navigate to the Testing page in your dashboard</li>
              <li>View the list of deployed models in the dropdown</li>
              <li>Select the model you want to test</li>
              <li>Review the model details including algorithm, task type, and performance metrics</li>
            </ol>
            
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Model Information</h4>
                  <p className="text-sm text-blue-700">
                    Each model displays its algorithm type, target variable, feature count, and performance metrics 
                    (accuracy, F1 score) to help you make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* File Upload */}
      <section id="file-upload" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Test Data Upload</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Supported Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">CSV Files</div>
                  <div className="text-sm text-muted-foreground">Comma-separated values</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Excel Files</div>
                  <div className="text-sm text-muted-foreground">.xlsx and .xls formats</div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Data Requirements</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
              <li>Your test data should contain the same features used during model training</li>
              <li>Column names should match the feature names from your training dataset</li>
              <li>Data types should be consistent (numeric for numeric features, categorical for categorical)</li>
              <li>Missing values should be handled appropriately</li>
            </ul>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Important Note</h4>
                  <p className="text-sm text-yellow-700">
                    For classification models, including actual target values in your test data will enable 
                    confusion matrix generation and performance evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Predictions */}
      <section id="predictions" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Prediction Results</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Understanding Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Prediction Summary</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Total number of predictions made</li>
                  <li>• Distribution of positive vs negative predictions</li>
                  <li>• High confidence predictions (>80%)</li>
                  <li>• Average confidence score across all predictions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Confidence Distribution</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• High confidence (80-100%)</li>
                  <li>• Medium confidence (60-79%)</li>
                  <li>• Low confidence (0-59%)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Export Options</h4>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Download CSV</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Download Report</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confusion Matrix */}
      <section id="confusion-matrix" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Confusion Matrix & Metrics</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Classification Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Accuracy</span>
                    <span className="text-sm text-muted-foreground">Overall correct predictions</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Precision</span>
                    <span className="text-sm text-muted-foreground">True positives / (True + False positives)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Recall</span>
                    <span className="text-sm text-muted-foreground">True positives / (True + False negatives)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">F1 Score</span>
                    <span className="text-sm text-muted-foreground">Harmonic mean of precision and recall</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Confusion Matrix</h4>
                <div className="grid grid-cols-2 gap-2 max-w-xs">
                  <div className="p-3 bg-green-100 text-green-800 text-center rounded-lg">
                    <div className="text-lg font-bold">TP</div>
                    <div className="text-xs">True Positives</div>
                  </div>
                  <div className="p-3 bg-red-100 text-red-800 text-center rounded-lg">
                    <div className="text-lg font-bold">FP</div>
                    <div className="text-xs">False Positives</div>
                  </div>
                  <div className="p-3 bg-red-100 text-red-800 text-center rounded-lg">
                    <div className="text-lg font-bold">FN</div>
                    <div className="text-xs">False Negatives</div>
                  </div>
                  <div className="p-3 bg-green-100 text-green-800 text-center rounded-lg">
                    <div className="text-lg font-bold">TN</div>
                    <div className="text-xs">True Negatives</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">When Available</h4>
                  <p className="text-sm text-blue-700">
                    Confusion matrix and performance metrics are only generated for classification models 
                    when actual target values are provided in your test dataset.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Data Preparation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ensure your test data is representative of real-world scenarios</li>
              <li>• Handle missing values consistently with your training data</li>
              <li>• Normalize or scale features if your model requires it</li>
              <li>• Include a diverse range of test cases</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Model Evaluation</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Test on multiple datasets to ensure robustness</li>
              <li>• Monitor confidence scores for reliability</li>
              <li>• Compare performance across different model versions</li>
              <li>• Document your testing methodology</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/knowledgehub/documentation/modellab" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">ModelLab</div>
              <div className="text-sm text-muted-foreground">Train and deploy models</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/eda" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Automated EDA</div>
              <div className="text-sm text-muted-foreground">Explore and analyze your data</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 