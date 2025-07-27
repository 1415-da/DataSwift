import React from 'react';
import Link from 'next/link';
import { FlaskConical, Brain, TrendingUp, BarChart3, ArrowRight, CheckCircle, Info, AlertCircle, Zap, Target } from 'lucide-react';

export default function ModelLabArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">ModelLab</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Train, compare, and deploy machine learning models with AI guidance. 
          Build powerful predictive models without the complexity of traditional ML workflows.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#overview" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Brain className="w-5 h-5 text-primary" />
            <span>Overview</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#getting-started" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Target className="w-5 h-5 text-primary" />
            <span>Getting Started</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#algorithms" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Zap className="w-5 h-5 text-primary" />
            <span>Algorithms</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#deployment" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span>Deployment</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            ModelLab is your comprehensive machine learning workspace where you can experiment with 
            different algorithms, compare model performance, and deploy production-ready models. 
            Our AI assistant helps you choose the best approach for your data and use case.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Brain className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">AI-Powered Selection</h3>
              <p className="text-sm text-green-700">Get recommendations for best algorithms</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">Performance Comparison</h3>
              <p className="text-sm text-blue-700">Compare multiple models side-by-side</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Easy Deployment</h3>
              <p className="text-sm text-purple-700">Deploy models with one click</p>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Step-by-Step Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
              <li>Navigate to the ModelLab section in your dashboard</li>
              <li>Select your dataset from the dropdown menu</li>
              <li>Choose your target variable (what you want to predict)</li>
              <li>Select features to use in your model</li>
              <li>Choose model type or get AI recommendations</li>
              <li>Configure hyperparameters (optional)</li>
              <li>Click "Train Model" to start the process</li>
              <li>Review results and compare performance</li>
              <li>Deploy your best model for predictions</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Training Time</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Simple models: 1-5 minutes</li>
                  <li>• Complex models: 5-30 minutes</li>
                  <li>• Deep learning: 30+ minutes</li>
                  <li>• Progress tracking available</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Data Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Minimum 50 rows of data</li>
                  <li>• At least 2 features</li>
                  <li>• Balanced target distribution</li>
                  <li>• Clean, preprocessed data</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">AI Recommendations</h4>
                  <p className="text-sm text-blue-700">
                    Our AI analyzes your data characteristics and suggests the best algorithms, 
                    hyperparameters, and preprocessing steps for optimal performance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms */}
      <section id="algorithms" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Supported Algorithms</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Classification Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Random Forest</div>
                    <div className="text-sm text-muted-foreground">Ensemble method, robust</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">XGBoost</div>
                    <div className="text-sm text-muted-foreground">Gradient boosting, fast</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Logistic Regression</div>
                    <div className="text-sm text-muted-foreground">Linear, interpretable</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Support Vector Machine</div>
                    <div className="text-sm text-muted-foreground">Non-linear boundaries</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">Neural Network</div>
                    <div className="text-sm text-muted-foreground">Deep learning, complex</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">K-Nearest Neighbors</div>
                    <div className="text-sm text-muted-foreground">Simple, distance-based</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Regression Models</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Linear Regression</div>
                    <div className="text-sm text-muted-foreground">Simple, interpretable</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Ridge Regression</div>
                    <div className="text-sm text-muted-foreground">Regularized linear</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Random Forest Regressor</div>
                    <div className="text-sm text-muted-foreground">Ensemble regression</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">XGBoost Regressor</div>
                    <div className="text-sm text-muted-foreground">Gradient boosting</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Performance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Model Performance</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Evaluation Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Classification Metrics</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Accuracy: Overall correct predictions</li>
                  <li>• Precision: True positives / (True + False positives)</li>
                  <li>• Recall: True positives / (True + False negatives)</li>
                  <li>• F1 Score: Harmonic mean of precision and recall</li>
                  <li>• ROC-AUC: Area under ROC curve</li>
                  <li>• Confusion Matrix: Detailed classification results</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Regression Metrics</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• R² Score: Coefficient of determination</li>
                  <li>• Mean Absolute Error (MAE)</li>
                  <li>• Mean Squared Error (MSE)</li>
                  <li>• Root Mean Squared Error (RMSE)</li>
                  <li>• Mean Absolute Percentage Error (MAPE)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Cross-Validation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                All models are evaluated using k-fold cross-validation to ensure reliable performance estimates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">K-Fold CV</div>
                  <div className="text-xs text-muted-foreground">Default 5-fold validation</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Stratified</div>
                  <div className="text-xs text-muted-foreground">Maintains class distribution</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Repeated</div>
                  <div className="text-xs text-muted-foreground">Multiple runs for stability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section id="deployment" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Model Deployment</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Deployment Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Select your best performing model from the results</li>
              <li>Click "Deploy Model" to start the deployment process</li>
              <li>Configure deployment settings (name, description)</li>
              <li>Set up monitoring and alerts (optional)</li>
              <li>Review and confirm deployment</li>
              <li>Get your model endpoint URL</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Deployment Features</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• REST API endpoints</li>
                  <li>• Real-time predictions</li>
                  <li>• Batch processing</li>
                  <li>• Model versioning</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Monitoring</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Performance tracking</li>
                  <li>• Prediction logs</li>
                  <li>• Error monitoring</li>
                  <li>• Usage analytics</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Production Ready</h4>
                  <p className="text-sm text-yellow-700">
                    Deployed models are production-ready with automatic scaling, 
                    load balancing, and high availability.
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
              <li>• Clean and preprocess your data thoroughly</li>
              <li>• Handle missing values appropriately</li>
              <li>• Scale numerical features</li>
              <li>• Encode categorical variables</li>
              <li>• Split data into train/validation sets</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Model Selection</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Start with simple models first</li>
              <li>• Compare multiple algorithms</li>
              <li>• Consider interpretability vs performance</li>
              <li>• Validate on unseen data</li>
              <li>• Monitor for overfitting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/knowledgehub/documentation/eda" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Automated EDA</div>
              <div className="text-sm text-muted-foreground">Analyze data before modeling</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/testing" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Target className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Model Testing</div>
              <div className="text-sm text-muted-foreground">Test deployed models</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 