import React from 'react';
import Link from 'next/link';
import { Download, Share2, FileText, BarChart3, Users, ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function DataExportArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Download className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Data Export & Sharing</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Learn how to export your analysis results, share reports with stakeholders, and collaborate on findings.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#export-formats" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <FileText className="w-5 h-5 text-primary" />
            <span>Export Formats</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#sharing-reports" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Share2 className="w-5 h-5 text-primary" />
            <span>Sharing Reports</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#collaboration" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Users className="w-5 h-5 text-primary" />
            <span>Collaboration</span>
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
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            DataSwift provides powerful export and sharing capabilities to help you communicate your findings 
            effectively with stakeholders, team members, and external collaborators.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Download className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">Multiple Formats</h3>
              <p className="text-sm text-green-700">Export to CSV, Excel, PDF, and more</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Share2 className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">Easy Sharing</h3>
              <p className="text-sm text-blue-700">Share reports with secure links</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Team Collaboration</h3>
              <p className="text-sm text-purple-700">Work together on analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Export Formats */}
      <section id="export-formats" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Export Formats</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Supported Formats</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">CSV Files</div>
                    <div className="text-sm text-muted-foreground">Raw data and predictions</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Excel Files</div>
                    <div className="text-sm text-muted-foreground">Formatted reports with charts</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">PDF Reports</div>
                    <div className="text-sm text-muted-foreground">Professional presentations</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">JSON Data</div>
                    <div className="text-sm text-muted-foreground">API integration format</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">HTML Reports</div>
                    <div className="text-sm text-muted-foreground">Interactive web reports</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">PowerPoint</div>
                    <div className="text-sm text-muted-foreground">Presentation slides</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sharing Reports */}
      <section id="sharing-reports" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sharing Reports</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">How to Share</h3>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
              <li>Generate your report or analysis in DataSwift</li>
              <li>Click the "Share" button in the top-right corner</li>
              <li>Choose your sharing method (link, email, or download)</li>
              <li>Set permissions and expiration dates if needed</li>
              <li>Send or copy the sharing link</li>
            </ol>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Public Links</h4>
                <p className="text-sm text-green-700">
                  Create shareable links that anyone can access. Perfect for stakeholders and external collaborators.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Team Sharing</h4>
                <p className="text-sm text-blue-700">
                  Share directly with team members. They can view, comment, and collaborate on the analysis.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Security Note</h4>
                  <p className="text-sm text-yellow-700">
                    Public links are secure but accessible to anyone with the link. Use team sharing for sensitive data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration */}
      <section id="collaboration" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Collaboration Features</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Team Collaboration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Real-time Collaboration</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multiple users can view reports simultaneously</li>
                  <li>• Add comments and annotations to charts</li>
                  <li>• Track changes and version history</li>
                  <li>• Real-time notifications for updates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Permission Management</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• View-only access for stakeholders</li>
                  <li>• Edit permissions for team members</li>
                  <li>• Admin controls for project owners</li>
                  <li>• Time-limited access for external users</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Commenting System</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Add comments to specific data points</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Tag team members in discussions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Resolve comments when addressed</span>
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
            <h3 className="text-lg font-semibold mb-3">Export Best Practices</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Choose the right format for your audience</li>
              <li>• Include context and methodology in reports</li>
              <li>• Use consistent naming conventions</li>
              <li>• Archive important reports for future reference</li>
              <li>• Validate data before sharing</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Sharing Best Practices</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Set appropriate permissions for sensitive data</li>
              <li>• Use expiration dates for temporary access</li>
              <li>• Provide context and explanations</li>
              <li>• Follow up with stakeholders</li>
              <li>• Keep track of shared reports</li>
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
              <div className="text-sm text-muted-foreground">Export EDA reports and insights</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/testing" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Model Testing</div>
              <div className="text-sm text-muted-foreground">Export prediction results</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 