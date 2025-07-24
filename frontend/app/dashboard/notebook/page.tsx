"use client";

import React, { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NotebookPage() {
  const router = useRouter();
  const params = useSearchParams();
  const datasetId = params.get("dataset_id");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Preload the dataset as data.csv in JupyterLite
  useEffect(() => {
    if (!datasetId) return;
    fetch(`/api/data/export?dataset_id=${datasetId}`)
      .then(res => res.blob())
      .then(blob => blob.text())
      .then(csv => {
        // Wait for the iframe to load, then send the file
        const sendFile = () => {
          iframeRef.current?.contentWindow?.postMessage({
            type: "jupyterlite:load-file",
            path: "data.csv",
            content: csv,
          }, "*");
        };
        if (iframeRef.current?.contentWindow) {
          sendFile();
        } else {
          setTimeout(sendFile, 1000);
        }
      });
  }, [datasetId]);

  // Save Cleaned Data: extract cleaned.csv from JupyterLite
  const handleSaveCleanedData = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "jupyterlite:save-file",
      path: "cleaned.csv",
    }, "*");
    window.addEventListener("message", (event) => {
      if (event.data?.type === "jupyterlite:file-content" && event.data.path === "cleaned.csv") {
        const csv = event.data.content;
        fetch(`/api/data/upload`, {
          method: "POST",
          body: new Blob([csv], { type: "text/csv" }),
        }).then(() => {
          alert("Cleaned data saved!");
          router.back();
        });
      }
    }, { once: true });
  };

  // Download Notebook: request .ipynb file
  const handleDownloadNotebook = () => {
    iframeRef.current?.contentWindow?.postMessage({
      type: "jupyterlite:save-file",
      path: "notebook.ipynb",
    }, "*");
    window.addEventListener("message", (event) => {
      if (event.data?.type === "jupyterlite:file-content" && event.data.path === "notebook.ipynb") {
        const blob = new Blob([event.data.content], { type: "application/x-ipynb+json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "notebook.ipynb";
        a.click();
        URL.revokeObjectURL(url);
      }
    }, { once: true });
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <h1 className="text-2xl font-semibold">Manual Clean Notebook</h1>
        <div className="flex gap-2">
          <button
            className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium"
            onClick={handleSaveCleanedData}
          >
            Save Cleaned Data
          </button>
          <button
            className="bg-muted text-foreground px-4 py-2 rounded font-medium border"
            onClick={handleDownloadNotebook}
          >
            Download Notebook
          </button>
          <button
            className="bg-destructive text-white px-4 py-2 rounded font-medium"
            onClick={() => router.back()}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      <div className="flex-1">
        <iframe
          ref={iframeRef}
          src="/jupyterlite/index.html?reset"
          title="JupyterLite"
          width="100%"
          height="100%"
          style={{ border: "none", borderRadius: "0 0 0.5rem 0.5rem" }}
        />
      </div>
    </div>
  );
} 