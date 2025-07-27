import React from 'react';
import Link from 'next/link';
import { Upload, Database, FileText, BarChart3, ArrowRight, CheckCircle, AlertCircle, Info, Zap, Globe } from 'lucide-react';

export default function DataUploadArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Upload className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Data Upload & Connections</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Learn how to bring your data into DataSwift using files, APIs, or databases. 
          Get started with comprehensive data import capabilities.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#file-upload" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <FileText className="w-5 h-5 text-primary" />
            <span>File Upload</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#api-connections" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Globe className="w-5 h-5 text-primary" />
            <span>API Connections</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#database-connections" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Database className="w-5 h-5 text-primary" />
            <span>Database Connections</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#data-preparation" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Data Preparation</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            DataSwift supports multiple ways to import your data, from simple file uploads to 
            complex database connections. Choose the method that best fits your data source and workflow.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">File Upload</h3>
              <p className="text-sm text-green-700">CSV, Excel, JSON, and more formats</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Globe className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">API Connections</h3>
              <p className="text-sm text-blue-700">Connect to external services and APIs</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Database className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Database Links</h3>
              <p className="text-sm text-purple-700">Direct database connections</p>
            </div>
          </div>
        </div>
      </section>

      {/* File Upload */}
      <section id="file-upload" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">File Upload</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Supported File Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
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
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">JSON Files</div>
                    <div className="text-sm text-muted-foreground">JavaScript Object Notation</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">Parquet Files</div>
                    <div className="text-sm text-muted-foreground">Columnar storage format</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">TSV Files</div>
                    <div className="text-sm text-muted-foreground">Tab-separated values</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">ZIP Archives</div>
                    <div className="text-sm text-muted-foreground">Compressed data files</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Upload Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Navigate to the Data section in your dashboard</li>
              <li>Click "Upload Dataset" and select your file</li>
              <li>Review the data preview and column information</li>
              <li>Configure data types and handle missing values</li>
              <li>Set dataset name and description</li>
              <li>Click "Import Dataset" to complete the process</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">File Requirements</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Maximum file size: 100MB</li>
                  <li>• Maximum rows: 1,000,000</li>
                  <li>• Maximum columns: 1,000</li>
                  <li>• UTF-8 encoding recommended</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Processing Time</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Small files (&lt; 1MB): ~30 seconds</li>
                  <li>• Medium files (1-10MB): ~2-5 minutes</li>
                  <li>• Large files (10-100MB): ~5-15 minutes</li>
                  <li>• Progress tracking available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Connections */}
      <section id="api-connections" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">API Connections</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Supported APIs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-semibold mb-3">REST APIs</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• HTTP/HTTPS endpoints</li>
                  <li>• GET, POST, PUT, DELETE methods</li>
                  <li>• JSON and XML responses</li>
                  <li>• Authentication support</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">GraphQL APIs</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Single endpoint queries</li>
                  <li>• Flexible data fetching</li>
                  <li>• Real-time subscriptions</li>
                  <li>• Schema introspection</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Connection Setup</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Go to the Data section and click "Connect API"</li>
              <li>Enter your API endpoint URL</li>
              <li>Configure authentication (API key, OAuth, etc.)</li>
              <li>Test the connection</li>
              <li>Set up data refresh schedule</li>
              <li>Import and configure your data</li>
            </ol>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Security Note</h4>
                  <p className="text-sm text-yellow-700">
                    API credentials are encrypted and stored securely. Never share your API keys 
                    in public repositories or unsecured channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Database Connections */}
      <section id="database-connections" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Database Connections</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Supported Databases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">PostgreSQL</div>
                    <div className="text-sm text-muted-foreground">Advanced open-source database</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">MySQL</div>
                    <div className="text-sm text-muted-foreground">Popular relational database</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">SQL Server</div>
                    <div className="text-sm text-muted-foreground">Microsoft SQL Server</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">MongoDB</div>
                    <div className="text-sm text-muted-foreground">NoSQL document database</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">SQLite</div>
                    <div className="text-sm text-muted-foreground">Lightweight file database</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">Oracle</div>
                    <div className="text-sm text-muted-foreground">Enterprise database</div>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-3">Connection Process</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Select your database type from the dropdown</li>
              <li>Enter connection details (host, port, database name)</li>
              <li>Provide username and password credentials</li>
              <li>Test the connection</li>
              <li>Browse and select tables to import</li>
              <li>Configure data refresh schedule</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Connection Security</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• SSL/TLS encryption</li>
                  <li>• Credential encryption</li>
                  <li>• Connection pooling</li>
                  <li>• Read-only access option</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Data Synchronization</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Real-time updates</li>
                  <li>• Scheduled refreshes</li>
                  <li>• Incremental updates</li>
                  <li>• Change tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Preparation */}
      <section id="data-preparation" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Preparation</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Best Practices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data Cleaning</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Remove duplicate rows</li>
                  <li>• Handle missing values appropriately</li>
                  <li>• Standardize data formats</li>
                  <li>• Remove outliers if necessary</li>
                  <li>• Validate data types</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Column Preparation</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use descriptive column names</li>
                  <li>• Ensure consistent naming conventions</li>
                  <li>• Separate mixed data types</li>
                  <li>• Create derived features</li>
                  <li>• Document data transformations</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Data Quality Checklist</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Completeness</div>
                  <div className="text-xs text-muted-foreground">Check for missing values</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Consistency</div>
                  <div className="text-xs text-muted-foreground">Uniform data formats</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Accuracy</div>
                  <div className="text-xs text-muted-foreground">Valid data ranges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Common Issues</h3>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-1">File Upload Errors</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Check file format and size limits</li>
                  <li>• Ensure proper encoding (UTF-8)</li>
                  <li>• Verify column headers are present</li>
                  <li>• Check for special characters in filenames</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-1">Connection Issues</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Verify network connectivity</li>
                  <li>• Check firewall settings</li>
                  <li>• Validate credentials</li>
                  <li>• Test connection separately</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Performance Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Compress large files before upload</li>
              <li>• Use appropriate data types</li>
              <li>• Index database columns for faster queries</li>
              <li>• Schedule imports during off-peak hours</li>
              <li>• Monitor connection pool usage</li>
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
              <div className="text-sm text-muted-foreground">Analyze your uploaded data</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/modellab" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">ModelLab</div>
              <div className="text-sm text-muted-foreground">Build models with your data</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 