import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ExportDeleteAccount() {
  const { user } = useAuth();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/export?email=${user?.email}`);
      if (!res.ok) throw new Error("Failed to export data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my_data_export.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setSuccess("Data export started!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = () => {
    setConfirm(true);
  };
  const handleConfirmDelete = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      });
      if (!res.ok) throw new Error("Failed to delete account");
      setSuccess("Account deleted. You will be logged out.");
      setTimeout(() => window.location.href = "/", 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };
  const handleCancel = () => {
    setConfirm(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export & Delete Account</CardTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Download your data or permanently delete your account.
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section aria-labelledby="export-data">
          <h2 id="export-data" className="font-semibold mb-2 flex items-center gap-2">
            Download My Data <span title="Export your data for compliance or backup." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" onClick={handleDownload} aria-label="Download My Data" disabled={loading}>{loading ? "Exporting..." : "Download My Data"}</Button>
        </section>
        <section aria-labelledby="delete-account">
          <h2 id="delete-account" className="font-semibold mb-2 flex items-center gap-2">
            Delete Account <span title="This action is irreversible." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="destructive" onClick={handleDelete} aria-label="Delete Account" disabled={loading} className="font-bold hover:bg-red-700 hover:text-white">Delete Account</Button>
          <div className="text-xs text-muted-foreground mt-2">Warning: This action is irreversible. You will be asked to confirm before deletion.</div>
          {confirm && (
            <div className="bg-destructive/10 p-4 rounded mt-2">
              <div className="mb-2">Are you sure you want to delete your account? This cannot be undone.</div>
              <Button variant="destructive" onClick={handleConfirmDelete} aria-label="Confirm Delete" disabled={loading} className="font-bold hover:bg-red-700 hover:text-white">Yes, Delete</Button>
              <Button variant="outline" className="ml-2" onClick={handleCancel} aria-label="Cancel Delete" disabled={loading}>Cancel</Button>
            </div>
          )}
        </section>
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
        {error && <div className="text-destructive text-sm mt-2" role="alert">{error}</div>}
      </CardContent>
    </Card>
  );
} 