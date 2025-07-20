import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ExportDeleteAccount() {
  const [success, setSuccess] = useState("");
  const [confirm, setConfirm] = useState(false);

  const handleDownload = () => {
    setSuccess("Data export started!");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleDelete = () => {
    setConfirm(true);
  };
  const handleConfirmDelete = () => {
    setSuccess("Account deleted (simulated)");
    setTimeout(() => setSuccess(""), 2000);
    setConfirm(false);
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
          <Button variant="outline" onClick={handleDownload} aria-label="Download My Data">Download My Data</Button>
        </section>
        <section aria-labelledby="delete-account">
          <h2 id="delete-account" className="font-semibold mb-2 flex items-center gap-2">
            Delete Account <span title="This action is irreversible." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="destructive" onClick={handleDelete} aria-label="Delete Account">Delete Account</Button>
          <div className="text-xs text-muted-foreground mt-2">Warning: This action is irreversible. You will be asked to confirm before deletion.</div>
          {confirm && (
            <div className="bg-destructive/10 p-4 rounded mt-2">
              <div className="mb-2">Are you sure you want to delete your account? This cannot be undone.</div>
              <Button variant="destructive" onClick={handleConfirmDelete} aria-label="Confirm Delete">Yes, Delete</Button>
              <Button variant="outline" className="ml-2" onClick={handleCancel} aria-label="Cancel Delete">Cancel</Button>
            </div>
          )}
        </section>
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
      </CardContent>
    </Card>
  );
} 