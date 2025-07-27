import React from 'react';
import Link from 'next/link';
import { Rocket, Database, BarChart3, FlaskConical, Users, ArrowRight, CheckCircle, Info, AlertCircle } from 'lucide-react';

export default function GettingStartedArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Getting Started with DataSwift</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Welcome to DataSwift! This comprehensive guide will help you set up your account, 
          connect your first data source, and start your data science journey.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#account-setup" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Users className="w-5 h-5 text-primary" />
            <span>Account Setup</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#data-upload" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Database className="w-5 h-5 text-primary" />
            <span>Data Upload</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#first-analysis" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>First Analysis</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#next-steps" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <FlaskConical className="w-5 h-5 text-primary" />
            <span>Next Steps</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            DataSwift is a comprehensive data science platform that makes it easy to explore data, 
            build models, and share insights. This guide will walk you through the essential steps 
            to get started.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Database className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Data Management</h3>
              <p className="text-sm text-green-700">Upload, clean, and organize your data</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">Automated Analysis</h3>
              <p className="text-sm text-blue-700">Explore data with AI-powered insights</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <FlaskConical className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Model Building</h3>
              <p className="text-sm text-purple-700">Train and deploy ML models</p>
            </div>
          </div>
        </div>
      </section>

      {/* Account Setup */}
      <section id="account-setup" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Account Setup</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Creating Your Account</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Visit the DataSwift homepage and click "Get Started"</li>
              <li>Sign up with your email or use social login (Google, GitHub)</li>
              <li>Verify your email address if prompted</li>
              <li>Complete your profile and set workspace preferences</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Free Tier</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 5 datasets</li>
                  <li>• Basic EDA features</li>
                  <li>• 3 model experiments</li>
                  <li>• Community support</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Pro Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Unlimited datasets</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                  <li>• Team collaboration</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Workspace Setup</h4>
                  <p className="text-sm text-blue-700">
                    Choose your workspace name and settings. You can always update these later in your account settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Upload */}
      <section id="data-upload" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Upload</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Getting Your Data Ready</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Supported Formats</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• CSV files (comma-separated values)</li>
                  <li>• Excel files (.xlsx, .xls)</li>
                  <li>• JSON files</li>
                  <li>• Database connections</li>
                  <li>• API integrations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Data Requirements</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Maximum file size: 100MB</li>
                  <li>• Maximum rows: 1,000,000</li>
                  <li>• Maximum columns: 1,000</li>
                  <li>• UTF-8 encoding recommended</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Upload Process</h4>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Navigate to the Data section in your dashboard</li>
                <li>Click "Upload Dataset" and select your file</li>
                <li>Review the data preview and column information</li>
                <li>Configure data types and handle missing values</li>
                <li>Click "Import Dataset" to complete the process</li>
              </ol>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Data Quality Tips</h4>
                  <p className="text-sm text-yellow-700">
                    Clean your data before uploading for better results. Remove duplicates, 
                    handle missing values, and ensure consistent formatting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First Analysis */}
      <section id="first-analysis" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Your First Analysis</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Running EDA</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Step-by-Step Process</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Select your uploaded dataset</li>
                  <li>Click "Run EDA" in the dashboard</li>
                  <li>Wait for the analysis to complete</li>
                  <li>Review summary statistics and visualizations</li>
                  <li>Explore correlations and patterns</li>
                  <li>Download or share your findings</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-3">What You'll Get</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Descriptive statistics for all variables</li>
                  <li>• Distribution plots and histograms</li>
                  <li>• Correlation matrices and heatmaps</li>
                  <li>• Missing value analysis</li>
                  <li>• Outlier detection</li>
                  <li>• Data quality insights</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Understanding Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Summary Stats</div>
                  <div className="text-xs text-muted-foreground">Mean, median, standard deviation</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Visualizations</div>
                  <div className="text-xs text-muted-foreground">Charts and graphs</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Insights</div>
                  <div className="text-xs text-muted-foreground">AI-generated observations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section id="next-steps" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Building Your First Model</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">ModelLab Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• One-click model training</li>
                  <li>• AI-powered model selection</li>
                  <li>• Performance comparison</li>
                  <li>• Hyperparameter tuning</li>
                  <li>• Model deployment</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Getting Started</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to ModelLab section</li>
                  <li>Select your dataset and target variable</li>
                  <li>Choose model type or get AI recommendations</li>
                  <li>Review training progress and results</li>
                  <li>Deploy your model for predictions</li>
                </ol>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Advanced Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Model Testing</h5>
                  <p className="text-sm text-green-700">Test deployed models with new data</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Collaboration</h5>
                  <p className="text-sm text-blue-700">Work with team members</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-semibold text-purple-800 mb-2">Knowledge Hub</h5>
                  <p className="text-sm text-purple-700">Access tutorials and best practices</p>
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
              <li>• Clean your data before uploading</li>
              <li>• Handle missing values appropriately</li>
              <li>• Ensure consistent data types</li>
              <li>• Remove duplicates and outliers</li>
              <li>• Use descriptive column names</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Workflow Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Start with EDA before modeling</li>
              <li>• Document your analysis process</li>
              <li>• Save important findings</li>
              <li>• Share results with stakeholders</li>
              <li>• Keep learning and experimenting</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/knowledgehub/documentation/data-upload" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Database className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Data Upload & Connections</div>
              <div className="text-sm text-muted-foreground">Detailed upload instructions</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/eda" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Automated EDA</div>
              <div className="text-sm text-muted-foreground">Exploratory data analysis guide</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 