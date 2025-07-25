'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Colors
} from 'chart.js';
import { AlertTriangle, Info, Lightbulb, Download } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Colors
  // DO NOT register zoomPlugin here!
);

interface DatasetMeta {
  dataset_id: string;
  filename: string;
  upload_date: string;
  status: string;
}

interface AnalyzeResult {
  preview?: Record<string, any>[];
  dtypes?: Record<string, string>;
  missing?: Record<string, number>;
  summary?: Record<string, Record<string, number | string | null>>;
}

interface Insight {
  type: string;
  message: string;
}

interface OutlierInfo {
  count: number;
  indices: number[];
  values: (number | null)[];
}

const Card = ({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) => (
  <section className="bg-gradient-to-br from-card/95 to-background/80 rounded-lg shadow-lg p-8 w-full box-border min-w-0 border-l-4 border-primary/40 transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl hover:border-primary/80 backdrop-blur-md bg-opacity-80 animate-fade-in motion-safe:animate-fade-in mb-8">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    <div>{children}</div>
  </section>
);

const EDAOverviewPage = () => {
  const [datasets, setDatasets] = useState<DatasetMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analyze, setAnalyze] = useState<AnalyzeResult | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [runEDA, setRunEDA] = useState(false);
  const [correlation, setCorrelation] = useState<Record<string, Record<string, number | null>> | null>(null);
  const [correlationLoading, setCorrelationLoading] = useState(false);
  const [correlationError, setCorrelationError] = useState<string | null>(null);
  const [outliers, setOutliers] = useState<Record<string, OutlierInfo> | null>(null);
  const [outliersLoading, setOutliersLoading] = useState(false);
  const [outliersError, setOutliersError] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const chartRefs = useRef<Record<string, any>>({});
  // Add a loading state for PDF export
  const [pdfExporting, setPdfExporting] = useState(false);

  useEffect(() => {
    const fetchDatasets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/data/list');
        if (!res.ok) throw new Error('Failed to fetch datasets');
        const data = await res.json();
        setDatasets(data);
        const paramId = searchParams?.get('dataset_id');
        if (paramId && data.some((d: DatasetMeta) => d.dataset_id === paramId)) {
          setSelectedId(paramId);
        }
      } catch (err: any) {
        setError(err?.message || 'Error fetching datasets');
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, [searchParams]);

  // Auto-run EDA if dataset_id is present in the URL and datasets are loaded
  useEffect(() => {
    const paramId = searchParams?.get('dataset_id');
    if (paramId && datasets.some((d: DatasetMeta) => d.dataset_id === paramId)) {
      setSelectedId(paramId);
      setRunEDA(true);
    }
  }, [searchParams, datasets]);

  const fetchAPI = useCallback(
    async (url: string, setter: (data: any) => void, errorSetter: (msg: string | null) => void, loadingSetter: (b: boolean) => void) => {
      loadingSetter(true);
      errorSetter(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setter(data);
      } catch (err: any) {
        errorSetter(err?.message || 'Error fetching data');
      } finally {
        loadingSetter(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedId || !runEDA) return;
    fetchAPI(`/api/data/analyze?dataset_id=${selectedId}`, setAnalyze, setAnalyzeError, setAnalyzeLoading);
    fetchAPI(`/api/data/correlation?dataset_id=${selectedId}`, setCorrelation, setCorrelationError, setCorrelationLoading);
    fetchAPI(`/api/data/outliers?dataset_id=${selectedId}`, setOutliers, setOutliersError, setOutliersLoading);
    fetchAPI(`/api/data/insights?dataset_id=${selectedId}`, setInsights, setInsightsError, setInsightsLoading);
  }, [selectedId, runEDA, fetchAPI]);

  // Dynamically import and register chartjs-plugin-zoom only on the client
  useEffect(() => {
    import('chartjs-plugin-zoom').then((mod) => {
      ChartJS.register(mod.default);
    });
  }, []);

  const handleDownloadReport = async (format: 'pdf' | 'html') => {
    if (!selectedId) return;
    if (format === 'pdf') setPdfExporting(true);
    const res = await fetch(`/api/data/export_report?dataset_id=${selectedId}&format=${format}`);
    if (!res.ok) {
      if (format === 'pdf') setPdfExporting(false);
      return alert('Failed to download report');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eda_report_${selectedId}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    if (format === 'pdf') setPdfExporting(false);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;
    const cols = Object.keys(data[0]);
    const csv = [cols.join(',')]
      .concat(data.map(row => cols.map(col => JSON.stringify(row[col] ?? '')).join(',')))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-8 px-4 py-10 animate-fade-in motion-safe:animate-fade-in">
      <h1 className="text-2xl font-bold mb-4">EDA Overview</h1>
      {/* 1. Dataset Selection Card */}
      <Card title="Select Dataset">
        <div className="space-y-4">
          {loading ? (
            <div>Loading datasets...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : datasets.length === 0 ? (
            <div>No datasets uploaded yet.</div>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="dataset-select" className="font-medium mb-1">Choose a dataset:</label>
              <select
                id="dataset-select"
                className="w-full max-w-md border border-border rounded px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={selectedId ?? ''}
                onChange={e => setSelectedId(e.target.value)}
              >
                <option value="" disabled>Select a dataset...</option>
                {datasets.map((ds: DatasetMeta) => (
                  <option key={ds.dataset_id} value={ds.dataset_id}>
                    {ds.filename} ({ds.status})
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedId && analyze && (
            <div className="flex flex-wrap gap-8 mt-4">
              <div>
                <div className="font-medium">Rows</div>
                <div>{analyze?.preview?.length ?? 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Columns</div>
                <div>{analyze?.dtypes ? Object.keys(analyze.dtypes).length : 'N/A'}</div>
              </div>
              <div>
                <div className="font-medium">Column Types</div>
                <div className="text-sm text-muted-foreground">
                  {analyze.dtypes && Object.entries(analyze.dtypes).map(([col, typ]) => `${col}: ${typ}`).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. Run EDA Card */}
      <Card title="Run Automated EDA">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 border border-primary text-primary font-semibold rounded bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center gap-2"
            aria-label="Run EDA"
            onClick={() => setRunEDA(true)}
            disabled={analyzeLoading || runEDA}
          >
            {analyzeLoading ? 'Running EDA...' : runEDA ? 'EDA Complete' : 'Run EDA'}
          </button>
          {analyzeLoading && <span className="ml-2 text-muted-foreground text-sm">Running EDA analysis...</span>}
        </div>
      </Card>

      {/* 3. Results Cards */}
      {runEDA && !analyzeLoading && (
        <section className="grid gap-8 md:grid-cols-2">
          {/* Summary Stats */}
          <Card title="Summary Stats">
            {analyze && analyze.dtypes && Object.entries(analyze.dtypes).filter(([_, typ]) => typ === 'number').length === 0 ? (
              <div className="text-muted-foreground">No numeric columns to visualize.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {analyze && analyze.dtypes && Object.entries(analyze.dtypes).filter(([_, typ]) => typ === 'number').map(([col]) => (
                  <div key={col} className="flex flex-col items-center">
                    <div className="font-medium mb-2">{col} Histogram</div>
                    <img
                      src={`/api/data/visualize?dataset_id=${selectedId}&column=${encodeURIComponent(col)}`}
                      alt={`Histogram of ${col}`}
                      className="w-full max-w-xs h-auto border shadow"
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>
          {/* Visualizations */}
          <Card title="Visualizations">
            {analyze && analyze.dtypes && Object.entries(analyze.dtypes).filter(([_, typ]) => typ === 'string').length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {analyze.dtypes && Object.entries(analyze.dtypes).filter(([_, typ]) => typ === 'string').map(([col]) => {
                  const counts: Record<string, number> = {};
                  (analyze.preview || []).forEach(row => {
                    const val = row[col];
                    if (val !== undefined && val !== null) {
                      counts[val] = (counts[val] || 0) + 1;
                    }
                  });
                  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
                  const data = {
                    labels: sorted.map(([v]) => v),
                    datasets: [
                      {
                        label: 'Count',
                        data: sorted.map(([_, c]) => c),
                        backgroundColor: 'rgba(59,130,246,0.7)',
                      },
                    ],
                  };
                  return (
                    <div key={col} className="flex flex-col items-center">
                      <div className="font-medium mb-2">{col} Value Counts</div>
                      {sorted.length === 0 ? (
                        <div className="text-muted-foreground">No data in preview.</div>
                      ) : (
                        <Bar ref={el => (chartRefs.current[col] = el)} data={data} options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            zoom: {
                              pan: { enabled: true, mode: 'xy' },
                              zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
                              limits: { x: { min: 0 }, y: { min: 0 } },
                            },
                          },
                          scales: { x: { title: { display: false } }, y: { beginAtZero: true } },
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : <div className="text-muted-foreground">No categorical columns to visualize.</div>}
          </Card>
          {/* Correlations */}
          <Card title="Correlations">
            {correlationLoading ? (
              <div>Loading correlation heatmap...</div>
            ) : correlationError ? (
              <div className="text-red-500">{correlationError}</div>
            ) : correlation && Object.keys(correlation).length > 1 ? (
              <CorrelationHeatmap correlation={correlation} />
            ) : <div className="text-muted-foreground">Not enough numeric columns for correlation.</div>}
          </Card>
          {/* Outliers */}
          <Card title="Outliers">
            {outliersLoading ? (
              <div>Loading outlier report...</div>
            ) : outliersError ? (
              <div className="text-red-500">{outliersError}</div>
            ) : outliers && Object.keys(outliers).length > 0 ? (
              <table className="min-w-max border text-xs">
                <thead>
                  <tr>
                    <th className="border px-2 py-1 bg-muted">Column</th>
                    <th className="border px-2 py-1 bg-muted">Outlier Count</th>
                    <th className="border px-2 py-1 bg-muted">Outlier Values (sample)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(outliers).map(([col, info]: [string, OutlierInfo]) => (
                    <tr key={col}>
                      <td className="border px-2 py-1">{col}</td>
                      <td className="border px-2 py-1">{info.count}</td>
                      <td className="border px-2 py-1">{(info.values || []).slice(0, 5).map((v: any, i: number) => <span key={i} className="inline-block mr-1">{v}</span>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <div className="text-muted-foreground">No outlier data.</div>}
          </Card>
          {/* Insights */}
          <Card title="AI Insights">
            {insightsLoading ? (
              <div>Loading insights...</div>
            ) : insightsError ? (
              <div className="text-red-500">{insightsError}</div>
            ) : insights && insights.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {insights.map((insight: Insight, i: number) => {
                  let color = 'text-blue-700';
                  let icon = <Info className="w-5 h-5 mr-2" />;
                  if (insight.type === 'warning') {
                    color = 'text-red-700';
                    icon = <AlertTriangle className="w-5 h-5 mr-2" />;
                  } else if (insight.type === 'suggestion') {
                    color = 'text-yellow-700';
                    icon = <Lightbulb className="w-5 h-5 mr-2" />;
                  }
                  return (
                    <li key={i} className="flex items-start gap-2">
                      {icon}
                      <div>
                        <span className={`font-semibold capitalize text-sm ${color}`}>{insight.type}</span>
                        <span className="ml-2 text-base leading-snug text-foreground">{insight.message}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : <div className="text-muted-foreground">No AI insights available.</div>}
          </Card>
        </section>
      )}

      {/* 4. Export & Collaboration Card (Download full report, feedback, etc.) */}
      {runEDA && !analyzeLoading && (
        <Card title="Export">
          <div className="flex gap-4 items-center">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded border border-primary text-primary font-semibold bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Download PDF Report"
              onClick={() => handleDownloadReport('pdf')}
              disabled={pdfExporting}
            >
              <Download className="w-4 h-4" />
              <span>{pdfExporting ? 'Preparing PDF...' : 'PDF Report'}</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded border border-primary text-primary font-semibold bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Download HTML Report"
              onClick={() => handleDownloadReport('html')}
            >
              <Download className="w-4 h-4" />
              <span>HTML Report</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EDAOverviewPage;

// --- Correlation Heatmap ---
function CorrelationHeatmap({
  correlation,
}: {
  correlation: Record<string, Record<string, number | null>>;
}): React.JSX.Element {
  const columns = Object.keys(correlation);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-max border text-xs">
        <thead>
          <tr>
            <th className="border px-2 py-1 bg-muted"> </th>
            {columns.map(col => (
              <th key={col} className="border px-2 py-1 bg-muted">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columns.map(rowCol => (
            <tr key={rowCol}>
              <th className="border px-2 py-1 bg-muted font-normal">{rowCol}</th>
              {columns.map(col => {
                const v = correlation[rowCol][col];
                const bg = v === null || isNaN(v)
                  ? '#eee'
                  : `rgb(${v > 0 ? 255 : 0},${255 - Math.abs(Math.round((v || 0) * 255))},${v < 0 ? 255 : 0})`;
                return (
                  <td
                    key={col}
                    className="border px-2 py-1 text-center"
                    style={{ background: bg, color: Math.abs(v || 0) > 0.5 ? '#fff' : '#222' }}
                  >
                    {v === null || isNaN(v) ? '-' : v.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}