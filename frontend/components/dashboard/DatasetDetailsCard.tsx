'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart2, FlaskConical, FileText } from 'lucide-react';

interface DatasetDetails {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rowCount: number;
  colCount: number;
  stats?: Record<string, any>;
  uploadDate: string;
  sourceType: 'file' | 'api' | 'db';
  status: 'pending' | 'cleaning' | 'ready';
}

interface DatasetDetailsCardProps {
  dataset: DatasetDetails;
  onRunEDA: (id: string) => void;
  onSendToModelLab: (id: string) => void;
  onViewReports: (id: string) => void;
}

export default function DatasetDetailsCard({ dataset, onRunEDA, onSendToModelLab, onViewReports }: DatasetDetailsCardProps) {
  const [showAllSchema, setShowAllSchema] = useState(false);
  const schemaList = dataset.columns.map(col => `${col.name} (${col.type})`);
  const visibleSchema = showAllSchema ? schemaList : schemaList.slice(0, 3);

  // Always collapse schema after cleaning (when columns change)
  useEffect(() => {
    setShowAllSchema(false);
  }, [schemaList.join()]);

  return (
    <Card gradient className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Dataset Details</CardTitle>
          <Badge variant={dataset.status === 'ready' ? 'default' : dataset.status === 'cleaning' ? 'destructive' : 'secondary'}>{dataset.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-muted-foreground mb-4">
          <div>
            <div className="font-semibold text-base mb-1">Name</div>
            <div className="truncate" title={dataset.name}>{dataset.name}</div>
          </div>
          <div>
            <div className="font-semibold text-base mb-1">Source</div>
            <div className="capitalize">{dataset.sourceType}</div>
          </div>
          <div>
            <div className="font-semibold text-base mb-1">Uploaded</div>
            <div>{new Date(dataset.uploadDate).toLocaleString()}</div>
          </div>
          <div>
            <div className="font-semibold text-base mb-1">Shape</div>
            <div>{dataset.rowCount} rows × {dataset.colCount} columns</div>
          </div>
        </div>
        <div className="mt-4">
          <div className="font-semibold text-base mb-2">Schema</div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto bg-muted rounded border border-border p-2">
            {dataset.columns.map((col, idx) => (
              <span key={idx} className="px-2 py-1 rounded bg-card border text-xs font-medium whitespace-nowrap shadow-sm">
                {col.name} <span className="text-muted-foreground">({col.type})</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {/* No action buttons here; they are shown in the main Data page only */}
      </CardFooter>
    </Card>
  );
} 