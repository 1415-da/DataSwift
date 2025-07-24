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
        <div className="mb-2 text-xs text-muted-foreground">
          <div><span className="font-semibold">Name:</span> {dataset.name}</div>
          <div><span className="font-semibold">Source:</span> {dataset.sourceType}</div>
          <div><span className="font-semibold">Uploaded:</span> {new Date(dataset.uploadDate).toLocaleString()}</div>
          <div><span className="font-semibold">Rows:</span> {dataset.rowCount}, <span className="font-semibold">Columns:</span> {dataset.colCount}</div>
          <div>
            <span className="font-semibold">Schema:</span>
            <div className="inline-block align-top max-h-16 overflow-y-auto ml-1 px-1 bg-muted rounded border border-border w-full max-w-xs" style={{ minWidth: 120, overflowX: 'hidden' }}>
              <ul className="list-disc pl-4">
                {visibleSchema.map((item, idx) => (
                  <li key={idx} className="truncate whitespace-normal break-words text-xs leading-tight">{item}</li>
                ))}
              </ul>
              {schemaList.length > 3 && (
                <button className="ml-2 text-primary underline text-xs" onClick={() => setShowAllSchema(v => !v)}>
                  {showAllSchema ? 'Show Less' : `+${schemaList.length - 3} more`}
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {/* No action buttons here; they are shown in the main Data page only */}
      </CardFooter>
    </Card>
  );
} 