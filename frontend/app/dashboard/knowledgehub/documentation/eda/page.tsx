import React from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, PieChart, Activity, ArrowRight, CheckCircle, Info, AlertCircle, Download, Eye } from 'lucide-react';

export default function EDAArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Automated Exploratory Data Analysis</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Discover insights in your data with AI-powered exploratory data analysis. 
          Get comprehensive statistics, visualizations, and automated insights.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#overview" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Eye className="w-5 h-5 text-primary" />
            <span>Overview</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#running-eda" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Activity className="w-5 h-5 text-primary" />
            <span>Running EDA</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#analysis-results" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Analysis Results</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#best-practices" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Best Practices</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            Automated Exploratory Data Analysis (EDA) helps you quickly understand your dataset 
            through comprehensive statistics, visualizations, and AI-generated insights. 
            This powerful tool saves hours of manual analysis and reveals hidden patterns in your data.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Comprehensive Analysis</h3>
              <p className="text-sm text-green-700">Statistical summaries and visualizations</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">AI Insights</h3>
              <p className="text-sm text-blue-700">Automated pattern detection</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <PieChart className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Interactive Reports</h3>
              <p className="text-sm text-purple-700">Exportable and shareable results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Running EDA */}
      <section id="running-eda" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Running EDA</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Step-by-Step Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
              <li>Upload or select your dataset from the Data section</li>
              <li>Navigate to the EDA section in your dashboard</li>
              <li>Click "Run EDA" to start the analysis</li>
              <li>Wait for the automated analysis to complete (typically 2-5 minutes)</li>
              <li>Review the generated summary statistics and visualizations</li>
              <li>Explore correlations, distributions, and AI-generated insights</li>
              <li>Download or share your EDA report</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Processing Time</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Small datasets (&lt; 10K rows): ~1-2 minutes</li>
                  <li>• Medium datasets (10K-100K rows): ~2-5 minutes</li>
                  <li>• Large datasets (100K+ rows): ~5-10 minutes</li>
                  <li>• Progress tracking available</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Data Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Minimum 10 rows of data</li>
                  <li>• At least 2 columns</li>
                  <li>• Mixed data types supported</li>
                  <li>• Handles missing values automatically</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Analysis Scope</h4>
                  <p className="text-sm text-blue-700">
                    EDA analyzes all columns in your dataset, automatically detecting data types 
                    and applying appropriate statistical methods for each variable type.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results */}
      <section id="analysis-results" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Analysis Results</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">What You'll Get</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Summary Statistics</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Count, mean, median, mode</li>
                  <li>• Standard deviation and variance</li>
                  <li>• Minimum and maximum values</li>
                  <li>• Quartiles and percentiles</li>
                  <li>• Missing value counts</li>
                  <li>• Unique value counts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Visualizations</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Histograms and distribution plots</li>
                  <li>• Box plots for outlier detection</li>
                  <li>• Correlation heatmaps</li>
                  <li>• Scatter plots for relationships</li>
                  <li>• Bar charts for categorical data</li>
                  <li>• Time series plots (if applicable)</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">AI-Generated Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Pattern Detection</div>
                  <div className="text-xs text-muted-foreground">Identifies trends and correlations</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Anomaly Detection</div>
                  <div className="text-xs text-muted-foreground">Finds outliers and unusual values</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Data Quality</div>
                  <div className="text-xs text-muted-foreground">Assesses data completeness and consistency</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Understanding Results */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Understanding Your Results</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Key Metrics Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Numerical Variables</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Mean vs Median</div>
                    <div className="text-xs text-muted-foreground">
                      Mean is sensitive to outliers, median is more robust
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Standard Deviation</div>
                    <div className="text-xs text-muted-foreground">
                      Measures data spread around the mean
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Skewness</div>
                    <div className="text-xs text-muted-foreground">
                      Indicates distribution asymmetry
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Categorical Variables</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Frequency Counts</div>
                    <div className="text-xs text-muted-foreground">
                      Shows most common categories
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Cardinality</div>
                    <div className="text-xs text-muted-foreground">
                      Number of unique values
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">Missing Values</div>
                    <div className="text-xs text-muted-foreground">
                      Percentage of null/empty values
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section id="best-practices" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Before Running EDA</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Clean your data and handle missing values</li>
              <li>• Ensure data types are correctly set</li>
              <li>• Remove obvious outliers if they're errors</li>
              <li>• Check for data quality issues</li>
              <li>• Understand your business context</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Interpreting Results</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Look for unexpected patterns or anomalies</li>
              <li>• Pay attention to correlation strengths</li>
              <li>• Consider the business implications</li>
              <li>• Document your findings</li>
              <li>• Share insights with stakeholders</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Export and Sharing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Export and Sharing</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Available Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Download className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">PDF Report</div>
                  <div className="text-sm text-muted-foreground">Professional presentation</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Download className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">HTML Report</div>
                  <div className="text-sm text-muted-foreground">Interactive web format</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Download className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">CSV Data</div>
                  <div className="text-sm text-muted-foreground">Raw statistics</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Sharing Options</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Generate shareable links for stakeholders</li>
                <li>• Export to presentation formats</li>
                <li>• Include in project documentation</li>
                <li>• Share with team members</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/dashboard/knowledgehub/documentation/data-upload" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Download className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Data Upload & Connections</div>
              <div className="text-sm text-muted-foreground">Prepare your data for analysis</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/modellab" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">ModelLab</div>
              <div className="text-sm text-muted-foreground">Build models after EDA</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 