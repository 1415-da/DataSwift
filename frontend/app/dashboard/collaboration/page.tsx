'use client';

import React from 'react';
import { Users, MessageSquare, Share2, GitBranch, Calendar, Zap, ArrowRight } from 'lucide-react';
import TestingCard from '@/components/dashboard/TestingCard';

export default function CollaborationPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-10 px-4 animate-fade-in motion-safe:animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
          <Users className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Team Collaboration</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Work together seamlessly with your team. Share datasets, collaborate on models, and track experiments in real-time.
        </p>
      </div>

      {/* Coming Soon Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold">
          <Zap className="w-4 h-4" />
          Coming Soon
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <TestingCard title="Real-time Collaboration">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat & Comments</h3>
                <p className="text-sm text-muted-foreground">Discuss insights and share feedback in real-time</p>
              </div>
            </div>
          </div>
        </TestingCard>

        <TestingCard title="Shared Workspaces">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Team Projects</h3>
                <p className="text-sm text-muted-foreground">Create shared workspaces for your team projects</p>
              </div>
            </div>
          </div>
        </TestingCard>

        <TestingCard title="Version Control">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Model Versioning</h3>
                <p className="text-sm text-muted-foreground">Track changes and collaborate on model iterations</p>
              </div>
            </div>
          </div>
        </TestingCard>

        <TestingCard title="Team Permissions">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Role-based Access</h3>
                <p className="text-sm text-muted-foreground">Control who can view and edit your projects</p>
              </div>
            </div>
          </div>
        </TestingCard>

        <TestingCard title="Activity Tracking">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Project Timeline</h3>
                <p className="text-sm text-muted-foreground">Track team activity and project milestones</p>
              </div>
            </div>
          </div>
        </TestingCard>

        <TestingCard title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Smart Alerts</h3>
                <p className="text-sm text-muted-foreground">Get notified about important updates and changes</p>
              </div>
            </div>
          </div>
        </TestingCard>
      </div>

      {/* Call to Action */}
      <TestingCard title="Stay Updated">
        <div className="text-center space-y-6">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-3">Be the first to know when collaboration features launch</h3>
            <p className="text-muted-foreground mb-6">
              We're working hard to bring you powerful collaboration tools. Sign up to get notified when they're ready.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2">
                Notify Me
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </TestingCard>

      {/* Progress Section */}
      <TestingCard title="Development Progress">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-sm text-muted-foreground">Core Features</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">60%</div>
              <div className="text-sm text-muted-foreground">UI/UX Design</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Testing</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <span className="font-medium">Real-time collaboration</span>
              <span className="text-green-600 font-semibold">In Progress</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <span className="font-medium">Team permissions</span>
              <span className="text-yellow-600 font-semibold">Planning</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <span className="font-medium">Version control</span>
              <span className="text-blue-600 font-semibold">Designing</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <span className="font-medium">Activity tracking</span>
              <span className="text-gray-600 font-semibold">Queued</span>
            </div>
          </div>
        </div>
      </TestingCard>
    </div>
  );
} 