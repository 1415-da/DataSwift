'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Edit, Trash2, SlidersHorizontal } from 'lucide-react';

export interface DatasetMeta {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  sourceType: 'file' | 'api' | 'db';
  status: 'pending' | 'cleaning' | 'ready';
}

interface DatasetListCardProps {
  datasets: DatasetMeta[];
  onPreview: (id: string) => void;
  onEdit: (id: string) => void;
  onClean: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DatasetListCard({ datasets, onPreview, onEdit, onClean, onDownload, onDelete }: DatasetListCardProps) {
  return (
    <Card gradient className="mb-6">
      <CardHeader>
        <CardTitle>Recent/Active Datasets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-muted-foreground">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Size</th>
                <th className="px-2 py-1 text-left">Uploaded</th>
                <th className="px-2 py-1 text-left">Source</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(ds => (
                <tr key={ds.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-2 py-1 font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => onPreview(ds.id)} />
                    {ds.name}
                  </td>
                  <td className="px-2 py-1">{(ds.size / 1024).toFixed(1)} KB</td>
                  <td className="px-2 py-1">{new Date(ds.uploadDate).toLocaleString()}</td>
                  <td className="px-2 py-1 capitalize">{ds.sourceType}</td>
                  <td className="px-2 py-1">
                    <Badge variant={ds.status === 'ready' ? 'success' : ds.status === 'cleaning' ? 'warning' : 'secondary'}>{ds.status}</Badge>
                  </td>
                  <td className="px-2 py-1 flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(ds.id)} title="Edit"><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onClean(ds.id)} title="Clean"><SlidersHorizontal className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onDownload(ds.id)} title="Download"><Download className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => onDelete(ds.id)} title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
} 