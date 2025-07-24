'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EDACard() {
  const [edaRun, setEdaRun] = useState(false);

  // Placeholder stats and insights
  const stats = [
    { label: 'Rows', value: 1000 },
    { label: 'Columns', value: 12 },
    { label: 'Missing Values', value: 3 },
    { label: 'Numeric Features', value: 8 },
    { label: 'Categorical Features', value: 4 },
  ];
  const insights = [
    'No major outliers detected.',
    'Feature X is highly correlated with target.',
    'Consider normalizing Feature Y.',
  ];

  return (
    <Card gradient>
      <CardHeader>
        <CardTitle>Automated EDA</CardTitle>
        <CardDescription>One-click profiling, stats, and visualizations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button variant="secondary" size="sm" onClick={() => setEdaRun(true)}>Run EDA</Button>
          <Button variant="outline" size="sm">Download Report</Button>
        </div>
        {edaRun && (
          <>
            <div className="mb-4">
              <div className="font-semibold mb-2">Key Statistics</div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-muted rounded p-2 text-center">
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">Visualizations</div>
              <div className="flex flex-wrap gap-4">
                <div className="w-40 h-28 bg-gradient-to-br from-primary/10 to-muted rounded shadow flex items-center justify-center text-xs text-muted-foreground">Histogram</div>
                <div className="w-40 h-28 bg-gradient-to-br from-primary/10 to-muted rounded shadow flex items-center justify-center text-xs text-muted-foreground">Boxplot</div>
                <div className="w-40 h-28 bg-gradient-to-br from-primary/10 to-muted rounded shadow flex items-center justify-center text-xs text-muted-foreground">Scatterplot</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold mb-2">AI Insights</div>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                {insights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">Download Cleaned Data</Button>
      </CardFooter>
    </Card>
  );
} 