'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Terminal } from 'lucide-react';

let MonacoEditor: any = null;
if (typeof window !== 'undefined') {
  try {
    MonacoEditor = require('react-monaco-editor').default;
  } catch {}
}

interface CodeEditorModalProps {
  open: boolean;
  code: string;
  language: string;
  onChange: (code: string) => void;
  onClose: () => void;
  onRun: () => void;
  error?: string;
  success?: string;
}

export default function CodeEditorModal({ open, code, language, onChange, onClose, onRun, error, success }: CodeEditorModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background rounded shadow-lg p-0 min-w-[600px] max-w-[95vw] border border-border text-foreground">
        {/* Jupyter-like cell */}
        <div className="flex items-start">
          <div className="flex flex-col items-center px-3 pt-6 bg-muted border-r border-border rounded-l-lg">
            <span className="text-xs text-muted-foreground font-mono">In&nbsp;[&nbsp;]:</span>
            <Terminal className="h-4 w-4 text-muted-foreground mt-2" />
          </div>
          <div className="flex-1 p-6">
            <div className="mb-2" style={{ height: 300 }}>
              {MonacoEditor ? (
                <MonacoEditor
                  width="100%"
                  height="300"
                  language={language}
                  theme="vs-dark"
                  value={code}
                  onChange={onChange}
                  options={{ fontSize: 16, fontFamily: 'Fira Mono, monospace', minimap: { enabled: false } }}
                />
              ) : (
                <textarea
                  value={code}
                  onChange={e => onChange(e.target.value)}
                  className="w-full h-full border border-border rounded p-2 text-sm font-mono bg-muted text-foreground"
                  rows={16}
                />
              )}
            </div>
            {/* Output/Error below the cell */}
            {error && <div className="bg-destructive/10 text-destructive text-xs rounded p-2 mb-2 font-mono">Error: {error}</div>}
            {success && <div className="bg-success/10 text-success text-xs rounded p-2 mb-2 font-mono">{success}</div>}
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button variant="secondary" size="sm" onClick={onRun}>Run</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 