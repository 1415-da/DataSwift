'use client';

import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface UploadedFile {
  name: string;
  status: 'pending' | 'cleaning' | 'ready';
  preview?: string[][];
  datasetId?: string;
  columns?: string[];
  selectedColumns?: string[];
}

const DB_TYPES = ['Postgres', 'MySQL', 'MongoDB', 'SQLite'];

interface DataUploadCardProps {
  onUpload?: (file: File, previewRows: string[][]) => void;
}

export default function DataUploadCard({ onUpload }: DataUploadCardProps) {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [preview, setPreview] = useState<string[][] | null>(null);
  const [selectedFileIdx, setSelectedFileIdx] = useState<number | null>(null);
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [columnSelection, setColumnSelection] = useState<string[]>([]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [apiHeaders, setApiHeaders] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbType, setDbType] = useState(DB_TYPES[0]);
  const [dbHost, setDbHost] = useState('');
  const [dbPort, setDbPort] = useState('');
  const [dbUser, setDbUser] = useState('');
  const [dbPassword, setDbPassword] = useState('');
  const [dbName, setDbName] = useState('');
  const [dbTables, setDbTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to get columns from preview
  const getColumns = (rows: string[][]) => (rows && rows[0] ? rows[0] : []);

  // Upload file to backend
  const handleCleanData = async (idx: number) => {
    const file = uploads[idx];
    if (!file) return;
    setUploads(prev => prev.map((f, i) => i === idx ? { ...f, status: 'cleaning' } : f));
    // Find the file in the input (simulate, as we don't keep the File object)
    // For demo, re-prompt file input
    fileInputRef.current?.click();
    // In real app, keep the File object in state for upload
  };

  // Handle file input and upload to backend
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onload = async (event) => {
      let rows: string[][] = [];
      try {
        if (ext === 'csv') {
          const text = event.target?.result as string;
          rows = text.split('\n').slice(0, 5).map(row => row.split(','));
        } else if (ext === 'json') {
          const text = event.target?.result as string;
          const json = JSON.parse(text);
          if (Array.isArray(json)) {
            const cols = Object.keys(json[0] || {});
            rows = [cols, ...json.slice(0, 4).map((row: any) => cols.map(col => String(row[col] ?? '')))];
          }
        } else if (ext === 'xlsx' || ext === 'xls') {
          // Use SheetJS for Excel preview
          const XLSX = await import('xlsx');
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          rows = (json as string[][]).slice(0, 5);
        }
      } catch (err) {
        rows = [['Error reading file']];
      }
      setPreview(rows);
      // Upload to backend
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/data/upload', { method: 'POST', body: formData });
      const data = await res.json();
      setUploads(prev => [
        ...prev,
        {
          name: file.name,
          status: 'ready',
          preview: rows,
          datasetId: data.dataset_id,
          columns: rows[0],
          selectedColumns: rows[0],
        },
      ]);
      if (onUpload) onUpload(file, rows);
    };
    if (ext === 'xlsx' || ext === 'xls') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Open column selection modal
  const handleSelectColumns = (idx: number) => {
    setSelectedFileIdx(idx);
    setColumnSelection(uploads[idx].selectedColumns || uploads[idx].columns || []);
    setShowColumnsModal(true);
  };

  // Save selected columns
  const handleSaveColumns = () => {
    if (selectedFileIdx === null) return;
    setUploads(prev => prev.map((f, i) => i === selectedFileIdx ? { ...f, selectedColumns: columnSelection } : f));
    setShowColumnsModal(false);
  };

  // Download cleaned data from backend
  const handleDownload = async (idx: number) => {
    const file = uploads[idx];
    if (!file?.datasetId) return;
    const params = new URLSearchParams({ dataset_id: file.datasetId });
    const res = await fetch(`/api/data/export?${params.toString()}`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, '')}_cleaned.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Connect API logic
  const handleConnectApi = async () => {
    setApiLoading(true);
    setApiError('');
    try {
      // For demo: fetch CSV/JSON from API
      const headers = apiHeaders
        ? Object.fromEntries(apiHeaders.split('\n').map(line => line.split(':').map(s => s.trim())))
        : {};
      const res = await fetch(apiUrl, { headers });
      const text = await res.text();
      // Try to parse as CSV or JSON
      let rows: string[][] = [];
      if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
        // JSON
        const json = JSON.parse(text);
        if (Array.isArray(json)) {
          const cols = Object.keys(json[0] || {});
          rows = [cols, ...json.slice(0, 4).map((row: any) => cols.map(col => String(row[col] ?? '')))];
        }
      } else {
        // CSV
        rows = text.split('\n').slice(0, 5).map(row => row.split(','));
      }
      setPreview(rows);
      setUploads(prev => [
        ...prev,
        {
          name: apiUrl.split('/').pop() || 'API Data',
          status: 'ready',
          preview: rows,
          columns: rows[0],
          selectedColumns: rows[0],
        },
      ]);
      setShowApiModal(false);
      setApiUrl('');
      setApiHeaders('');
    } catch (err: any) {
      setApiError('Failed to fetch data from API.');
    }
    setApiLoading(false);
  };

  // Link Database logic (mocked)
  const handleConnectDb = async () => {
    setDbLoading(true);
    setDbError('');
    try {
      // For demo: mock table list
      setTimeout(() => {
        setDbTables(['users', 'transactions', 'products']);
        setDbLoading(false);
      }, 1000);
    } catch (err: any) {
      setDbError('Failed to connect to database.');
      setDbLoading(false);
    }
  };

  // Fetch table data (mocked)
  const handleSelectTable = async (table: string) => {
    setSelectedTable(table);
    // For demo: mock preview
    const mockRows = [
      ['id', 'name', 'value'],
      ['1', 'Alice', '100'],
      ['2', 'Bob', '200'],
      ['3', 'Carol', '300'],
      ['4', 'Dave', '400'],
    ];
    setPreview(mockRows);
    setUploads(prev => [
      ...prev,
      {
        name: `${table} (${dbType})`,
        status: 'ready',
        preview: mockRows,
        columns: mockRows[0],
        selectedColumns: mockRows[0],
      },
    ]);
    setShowDbModal(false);
    setDbTables([]);
    setSelectedTable('');
  };

  return (
    <Card gradient>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>Data Upload</CardTitle>
          <Badge variant="secondary">New</Badge>
        </div>
        <CardDescription>Upload files, connect APIs, or link databases.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Upload File</Button>
          <Button variant="secondary" onClick={() => setShowApiModal(true)}>Connect API</Button>
          <Button variant="secondary" onClick={() => setShowDbModal(true)}>Link Database</Button>
          <Input type="file" accept=".csv,.xlsx,.xls,.json" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        </div>
        {/* Remove preview, uploads, and action buttons here */}
        {/* Column selection modal */}
        {showColumnsModal && selectedFileIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
              <div className="font-semibold mb-2">Select Columns</div>
              <div className="flex flex-col gap-2 mb-4">
                {uploads[selectedFileIdx].columns?.map(col => (
                  <label key={col} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={columnSelection.includes(col)}
                      onChange={e => {
                        if (e.target.checked) setColumnSelection(prev => [...prev, col]);
                        else setColumnSelection(prev => prev.filter(c => c !== col));
                      }}
                    />
                    {col}
                  </label>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowColumnsModal(false)}>Cancel</Button>
                <Button variant="secondary" size="sm" onClick={handleSaveColumns}>Save</Button>
              </div>
            </div>
          </div>
        )}
        {/* Connect API Modal */}
        {showApiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded shadow-lg p-6 min-w-[350px] border border-border text-foreground">
              <div className="font-semibold mb-2">Connect to API</div>
              <div className="mb-2">
                <Input
                  placeholder="API Endpoint URL"
                  value={apiUrl}
                  onChange={e => setApiUrl(e.target.value)}
                  className="mb-2 bg-muted border-border text-foreground"
                />
                <textarea
                  placeholder="Headers (one per line: Key: Value)"
                  value={apiHeaders}
                  onChange={e => setApiHeaders(e.target.value)}
                  className="w-full border border-border rounded p-2 text-xs mb-2 bg-muted text-foreground"
                  rows={3}
                />
                {apiError && <div className="text-destructive text-xs mb-2">{apiError}</div>}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowApiModal(false)}>Cancel</Button>
                <Button variant="secondary" size="sm" onClick={handleConnectApi} disabled={apiLoading}>{apiLoading ? 'Connecting...' : 'Connect'}</Button>
              </div>
            </div>
          </div>
        )}
        {/* Link Database Modal */}
        {showDbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background rounded shadow-lg p-6 min-w-[350px] border border-border text-foreground">
              <div className="font-semibold mb-2">Link Database</div>
              <div className="mb-2 flex flex-col gap-2">
                <select value={dbType} onChange={e => setDbType(e.target.value)} className="border border-border rounded p-2 bg-muted text-foreground">
                  {DB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
                <Input placeholder="Host" value={dbHost} onChange={e => setDbHost(e.target.value)} className="bg-muted border-border text-foreground" />
                <Input placeholder="Port" value={dbPort} onChange={e => setDbPort(e.target.value)} className="bg-muted border-border text-foreground" />
                <Input placeholder="User" value={dbUser} onChange={e => setDbUser(e.target.value)} className="bg-muted border-border text-foreground" />
                <Input placeholder="Password" type="password" value={dbPassword} onChange={e => setDbPassword(e.target.value)} className="bg-muted border-border text-foreground" />
                <Input placeholder="Database Name" value={dbName} onChange={e => setDbName(e.target.value)} className="bg-muted border-border text-foreground" />
                {dbError && <div className="text-destructive text-xs mb-2">{dbError}</div>}
                {dbTables.length === 0 ? (
                  <Button variant="secondary" size="sm" onClick={handleConnectDb} disabled={dbLoading}>{dbLoading ? 'Connecting...' : 'Connect'}</Button>
                ) : (
                  <>
                    <div className="font-semibold mt-2">Select Table</div>
                    <ul className="mb-2">
                      {dbTables.map(table => (
                        <li key={table}>
                          <Button variant="outline" size="sm" className="w-full mb-1" onClick={() => handleSelectTable(table)}>{table}</Button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <Button variant="outline" size="sm" onClick={() => { setShowDbModal(false); setDbTables([]); setSelectedTable(''); }}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end gap-2 flex-wrap">
        {/* Remove footer action buttons here */}
      </CardFooter>
    </Card>
  );
} 