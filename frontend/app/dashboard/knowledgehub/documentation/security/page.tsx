import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Users, ArrowRight, CheckCircle, Info, AlertCircle, Key, Database } from 'lucide-react';

export default function SecurityArticle() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Security & Compliance</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Learn about DataSwift's comprehensive security measures, privacy protections, 
          and compliance standards that keep your data safe and secure.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="bg-muted/50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="#data-security" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Lock className="w-5 h-5 text-primary" />
            <span>Data Security</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#privacy" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Eye className="w-5 h-5 text-primary" />
            <span>Privacy Protection</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#compliance" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <CheckCircle className="w-5 h-5 text-primary" />
            <span>Compliance</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="#access-control" className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted transition-colors">
            <Users className="w-5 h-5 text-primary" />
            <span>Access Control</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground mb-4">
            DataSwift is built with security and privacy as core principles. We implement 
            industry-leading security measures to protect your data throughout its lifecycle, 
            from upload to analysis to storage.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <Lock className="w-6 h-6 text-green-600 mb-2" />
              <h3 className="font-semibold text-green-800">End-to-End Encryption</h3>
              <p className="text-sm text-green-700">Data encrypted in transit and at rest</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Shield className="w-6 h-6 text-blue-600 mb-2" />
              <h3 className="font-semibold text-blue-800">SOC 2 Compliant</h3>
              <p className="text-sm text-blue-700">Industry-standard security certification</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <Users className="w-6 h-6 text-purple-600 mb-2" />
              <h3 className="font-semibold text-purple-800">Role-Based Access</h3>
              <p className="text-sm text-purple-700">Granular permission controls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section id="data-security" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Encryption Standards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data in Transit</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• TLS 1.3 encryption for all communications</li>
                  <li>• HTTPS-only access to the platform</li>
                  <li>• Secure API endpoints with authentication</li>
                  <li>• Certificate pinning for mobile apps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Data at Rest</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AES-256 encryption for stored data</li>
                  <li>• Encrypted database storage</li>
                  <li>• Encrypted backup systems</li>
                  <li>• Key management with AWS KMS</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Infrastructure Security</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Cloud Security</div>
                  <div className="text-xs text-muted-foreground">AWS security best practices</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Network Security</div>
                  <div className="text-xs text-muted-foreground">Firewalls and DDoS protection</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Application Security</div>
                  <div className="text-xs text-muted-foreground">Regular security audits</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Protection */}
      <section id="privacy" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Privacy Protection</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Data Privacy Principles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Data Minimization</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Only collect necessary data</li>
                  <li>• Automatic data retention policies</li>
                  <li>• Right to data deletion</li>
                  <li>• Anonymization options</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">User Control</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Export your data anytime</li>
                  <li>• Control data sharing settings</li>
                  <li>• Manage privacy preferences</li>
                  <li>• Opt-out of analytics</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Privacy Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Eye className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">Data Masking</div>
                    <div className="text-sm text-muted-foreground">Hide sensitive fields</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Database className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Data Isolation</div>
                    <div className="text-sm text-muted-foreground">Tenant separation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Key className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Encryption Keys</div>
                    <div className="text-sm text-muted-foreground">Customer-managed keys</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section id="compliance" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Compliance Standards</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Certifications & Standards</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">SOC 2 Type II</div>
                    <div className="text-sm text-muted-foreground">Security, availability, confidentiality</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">GDPR Compliance</div>
                    <div className="text-sm text-muted-foreground">EU data protection regulation</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <div className="font-medium">CCPA Compliance</div>
                    <div className="text-sm text-muted-foreground">California privacy law</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="font-medium">HIPAA Ready</div>
                    <div className="text-sm text-muted-foreground">Healthcare data protection</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium">ISO 27001</div>
                    <div className="text-sm text-muted-foreground">Information security management</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="font-medium">FedRAMP</div>
                    <div className="text-sm text-muted-foreground">Federal government compliance</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Audit & Monitoring</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Regular third-party security audits</li>
                <li>• Continuous security monitoring</li>
                <li>• Automated vulnerability scanning</li>
                <li>• Penetration testing</li>
                <li>• Compliance reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Access Control */}
      <section id="access-control" className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Access Control</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Authentication & Authorization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Multi-Factor Authentication</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• SMS/Email verification codes</li>
                  <li>• Authenticator app support</li>
                  <li>• Hardware security keys</li>
                  <li>• Biometric authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Role-Based Access Control</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Admin: Full system access</li>
                  <li>• Manager: Team and project management</li>
                  <li>• Analyst: Data analysis and modeling</li>
                  <li>• Viewer: Read-only access</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-3">Session Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Session Timeout</div>
                  <div className="text-xs text-muted-foreground">Automatic logout after inactivity</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">Device Management</div>
                  <div className="text-xs text-muted-foreground">Track and manage active sessions</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm mb-1">IP Restrictions</div>
                  <div className="text-xs text-muted-foreground">Limit access to specific IP ranges</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Security Best Practices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">For Users</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use strong, unique passwords</li>
              <li>• Enable two-factor authentication</li>
              <li>• Regularly review access permissions</li>
              <li>• Log out from shared devices</li>
              <li>• Report suspicious activity</li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">For Organizations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Implement SSO integration</li>
              <li>• Regular security training</li>
              <li>• Monitor user access patterns</li>
              <li>• Establish data retention policies</li>
              <li>• Conduct security assessments</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Incident Response</h2>
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Security Incident Handling</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Detection & Response</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 24/7 security monitoring</li>
                  <li>• Automated threat detection</li>
                  <li>• Rapid incident response</li>
                  <li>• Customer notification process</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Recovery & Lessons</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Data backup and recovery</li>
                  <li>• Post-incident analysis</li>
                  <li>• Security improvements</li>
                  <li>• Customer support</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Report Security Issues</h4>
                  <p className="text-sm text-yellow-700">
                    If you discover a security vulnerability, please report it immediately to 
                    our security team at security@dataswift.com
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
            <Database className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Data Upload & Connections</div>
              <div className="text-sm text-muted-foreground">Secure data import methods</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
          <Link href="/dashboard/knowledgehub/documentation/integrations" className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <div className="font-semibold">Data Export & Sharing</div>
              <div className="text-sm text-muted-foreground">Secure sharing practices</div>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>
      </section>
    </div>
  );
} 