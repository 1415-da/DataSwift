'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface ColumnSelectModalProps {
  open: boolean;
  columns: string[];
  selectedColumns: string[];
  onChange: (cols: string[]) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function ColumnSelectModal({ open, columns, selectedColumns, onChange, onClose, onSave }: ColumnSelectModalProps) {
  if (!open) return null;
  const allSelected = columns.length === selectedColumns.length;
  const handleToggle = (col: string) => {
    if (selectedColumns.includes(col)) {
      onChange(selectedColumns.filter(c => c !== col));
    } else {
      onChange([...selectedColumns, col]);
    }
  };
  const handleSelectAll = () => {
    if (allSelected) onChange([]);
    else onChange([...columns]);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded shadow-lg p-6 min-w-[300px] border border-border text-foreground">
        <div className="font-semibold mb-2">Select Columns to Export</div>
        <div className="flex flex-col gap-2 mb-4 max-h-60 overflow-y-auto">
          <label className="flex items-center gap-2 font-medium">
            <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
            Select All
          </label>
          {columns.map(col => (
            <label key={col} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => handleToggle(col)}
              />
              {col}
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="secondary" size="sm" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );
} 