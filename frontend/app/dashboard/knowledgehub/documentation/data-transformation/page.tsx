import React from 'react';
import Link from 'next/link';
import { Layers, Zap, BarChart3, Download, ArrowRight, Info } from 'lucide-react';

export default function DataTransformationDocs() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Data Transformation</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Prepare your data for modeling with powerful transformation tools: feature engineering, encoding, scaling, export, and train-test split.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#overview" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span>Overview</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#usage" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Zap className="w-5 h-5 text-primary" />
            <span>How to Use</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section id="overview" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            The Data Transformation section lets you clean, enhance, and prepare your data for machine learning. Use feature engineering to create new variables, encoding to convert categorical data, scaling to normalize values, and export to download your processed dataset. The train-test split tool ensures robust model evaluation.
          </p>
          <ul className="list-disc ml-6 text-muted-foreground">
            <li><strong>Feature Engineering:</strong> Create new features (e.g., polynomial features) to help models capture complex patterns.</li>
            <li><strong>Encoding:</strong> Convert categorical variables into numeric format using one-hot or label encoding.</li>
            <li><strong>Scaling:</strong> Normalize or standardize numeric features for better model performance.</li>
            <li><strong>Export:</strong> Download your transformed dataset as a CSV file.</li>
            <li><strong>Train-Test Split:</strong> Split your data into training and testing sets for unbiased model evaluation.</li>
          </ul>
        </div>
      </section>

      {/* How to Use */}
      <section id="usage" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How to Use Data Transformation</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Step-by-Step Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
              <li>Select your dataset at the top of the Data Transformation dashboard.</li>
              <li>Preview your data and choose the transformation you want to apply.</li>
              <li>Use the Feature Engineering, Encoding, and Scaling sections to modify your data as needed.</li>
              <li>Apply the Train-Test Split to separate your data for training and evaluation.</li>
              <li>Download the processed train and test sets for use in ModelLab or other tools.</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Best Practices</h4>
                  <p className="text-sm text-blue-700">
                    Always transform and split your data before training models. This ensures fair evaluation and prevents data leakage. Document your transformations for reproducibility.
                  </p>
                </div>
              </div>
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
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">ModelLab</div>
              <div className="text-sm text-muted-foreground">Build models after transforming data</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 