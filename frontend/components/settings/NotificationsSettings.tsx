import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsSettings() {
  const { user } = useAuth();
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [inAppNotif, setInAppNotif] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [activitySummaries, setActivitySummaries] = useState(false);
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("UTC");
  const [darkMode, setDarkMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          notificationPreferences: {
            emailNotif,
            pushNotif,
            inAppNotif,
            productUpdates,
            securityAlerts,
            activitySummaries,
            language,
            timezone,
            darkMode,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to update notification preferences");
      setSuccess("Preferences updated!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications & Preferences</CardTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Control how and when you receive notifications and customize your experience.
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section aria-labelledby="notif-types">
          <h2 id="notif-types" className="font-semibold mb-2 flex items-center gap-2">
            Notification Types <span title="Choose which notifications you want to receive." className="text-xs cursor-help">?</span>
          </h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={emailNotif} onChange={e => setEmailNotif(e.target.checked)} aria-label="Email Notifications" />
              Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} aria-label="Push Notifications" />
              Push Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={inAppNotif} onChange={e => setInAppNotif(e.target.checked)} aria-label="In-App Notifications" />
              In-App Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={productUpdates} onChange={e => setProductUpdates(e.target.checked)} aria-label="Product Updates" />
              Product Updates
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={securityAlerts} onChange={e => setSecurityAlerts(e.target.checked)} aria-label="Security Alerts" />
              Security Alerts
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={activitySummaries} onChange={e => setActivitySummaries(e.target.checked)} aria-label="Activity Summaries" />
              Activity Summaries
            </label>
          </div>
        </section>
        <section aria-labelledby="prefs">
          <h2 id="prefs" className="font-semibold mb-2 flex items-center gap-2">
            Preferences <span title="Set your language, timezone, and display options." className="text-xs cursor-help">?</span>
          </h2>
          <div className="flex gap-4 mt-2 flex-wrap">
            <div>
              <label htmlFor="language" className="block font-medium mb-1">Language</label>
              <select id="language" className="border rounded px-2 py-1" value={language} onChange={e => setLanguage(e.target.value)} aria-label="Language">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label htmlFor="timezone" className="block font-medium mb-1">Timezone</label>
              <select id="timezone" className="border rounded px-2 py-1" value={timezone} onChange={e => setTimezone(e.target.value)} aria-label="Timezone">
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
                <option>Asia/Kolkata</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <label htmlFor="darkmode" className="font-medium">Dark Mode</label>
            <input id="darkmode" type="checkbox" checked={darkMode} onChange={e => setDarkMode(e.target.checked)} aria-label="Dark Mode" />
          </div>
        </section>
        <Button className="mt-4" onClick={handleSave} aria-label="Save Preferences" disabled={loading}>
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
        {error && <div className="text-destructive text-sm mt-2" role="alert">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
      </CardContent>
    </Card>
  );
} 