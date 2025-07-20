import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Data Upload & Connections */}
      <Card gradient>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Data Upload</CardTitle>
            <Badge variant="secondary">New</Badge>
          </div>
          <CardDescription>Upload files, connect APIs, or link databases.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button variant="secondary">Upload File</Button>
            <Button variant="secondary">Connect API</Button>
            <Button variant="secondary">Link Database</Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" size="sm">View Datasets</Button>
        </CardFooter>
      </Card>

      {/* Automated EDA */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Automated EDA</CardTitle>
          <CardDescription>One-click profiling, stats, and visualizations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Run EDA</Button>
            <Button variant="outline" size="sm">Download Report</Button>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="outline" size="sm">Download Cleaned Data</Button>
        </CardFooter>
      </Card>

      {/* ModelLab */}
      <Card gradient>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>ModelLab</CardTitle>
            <Badge>AI</Badge>
          </div>
          <CardDescription>Train, compare, and test ML models with AI guidance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2">
            <Button variant="secondary" size="sm">New Model</Button>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="text-xs text-muted-foreground">AI-generated advice: <span className="font-medium">Try Random Forest for this dataset!</span></div>
        </CardContent>
      </Card>

      {/* Knowledge Hub */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Knowledge Hub</CardTitle>
          <CardDescription>AI-powered search, articles, and tutorials.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/knowledgehub/documentation" passHref legacyBehavior>
              <Button variant="secondary" size="sm">Documentation</Button>
            </Link>
            <Link href="/dashboard/knowledgehub/best-practices" passHref legacyBehavior>
              <Button variant="secondary" size="sm">Best Practices</Button>
            </Link>
            <Link href="/dashboard/knowledgehub/tutorials" passHref legacyBehavior>
              <Button variant="secondary" size="sm">Tutorials</Button>
            </Link>
            <Link href="/dashboard/knowledgehub/api" passHref legacyBehavior>
              <Button variant="secondary" size="sm">API Reference</Button>
            </Link>
            <Link href="/dashboard/knowledgehub/community" passHref legacyBehavior>
              <Button variant="secondary" size="sm">Community</Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Link href="/dashboard/knowledgehub/documentation" passHref legacyBehavior>
            <Button variant="outline" size="sm">Browse All</Button>
          </Link>
        </CardFooter>
      </Card>

      {/* Docs & Feedback */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Docs & Feedback</CardTitle>
          <CardDescription>Guides, FAQs, and feedback widget.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" size="sm">Give Feedback</Button>
        </CardContent>
      </Card>

      {/* Collaboration */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Collaboration</CardTitle>
          <CardDescription>Comments, team status, and activity log.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" size="sm">Open Comments</Button>
        </CardContent>
      </Card>

      {/* Settings/Account (optional) */}
      <Card gradient>
        <CardHeader>
          <CardTitle>Settings & Account</CardTitle>
          <CardDescription>Customize your workspace and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" size="sm">Go to Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
} 