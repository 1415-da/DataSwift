'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Undo2, Save } from 'lucide-react';

export interface DatasetPreview {
  id: string;
  name: string;
  columns: { name: string; type: string }[];
  rows: string[][];
  rowCount: number;
  colCount: number;
  stats?: Record<string, any>;
}

interface DatasetPreviewCardProps {
  dataset: DatasetPreview;
  onClean: (id: string, method: string) => void;
  onSave: (id: string) => void;
  onRevert: (id: string) => void;
  showSaveRevert?: boolean;
}

const typeColors: Record<string, string> = {
  number: 'bg-blue-100 text-blue-800',
  string: 'bg-green-100 text-green-800',
  date: 'bg-yellow-100 text-yellow-800',
  boolean: 'bg-purple-100 text-purple-800',
  default: 'bg-muted text-foreground',
};

export default function DatasetPreviewCard({ dataset, onClean, onSave, onRevert, showSaveRevert }: DatasetPreviewCardProps) {
  return (
    <Card gradient className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{dataset.name} Preview</CardTitle>
          <Badge variant="secondary">{dataset.rowCount} rows × {dataset.colCount} cols</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded border bg-muted mb-4">
          <table className="min-w-full text-xs">
            <thead>
              <tr>
                {dataset.columns.map(col => (
                  <th key={col.name} className={`px-2 py-1 border-b border-border whitespace-nowrap ${typeColors[col.type] || typeColors.default}`}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-2 py-1 border-b border-border whitespace-nowrap">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => onClean(dataset.id, 'auto')}>Auto Clean</Button>
          <Button variant="outline" size="sm" onClick={() => onClean(dataset.id, 'manual')}>Manual Clean</Button>
        </div>
        <div className="mb-2">
          <div className="font-semibold mb-1">Metadata</div>
          <div
            className="text-xs text-muted-foreground max-h-32 min-h-[6rem] bg-muted rounded p-2 border border-border overflow-y-auto w-full"
            style={{ minWidth: 0 }}
          >
            <div>Schema: {dataset.columns.map(col => `${col.name} (${col.type})`).join(', ')}</div>
            <div>Rows: {dataset.rowCount}, Columns: {dataset.colCount}</div>
            {dataset.stats && <div>Sample Stats: {JSON.stringify(dataset.stats)}</div>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-2 flex-wrap">
        {showSaveRevert && (
          <>
            <Button variant="secondary" size="sm" onClick={() => onSave(dataset.id)}><Save className="w-4 h-4 mr-1" />Save</Button>
            <Button variant="outline" size="sm" onClick={() => onRevert(dataset.id)}><Undo2 className="w-4 h-4 mr-1" />Revert</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
} 