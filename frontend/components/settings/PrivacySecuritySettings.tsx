import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockTokens = [
  { id: 1, name: "API Token 1", lastUsed: "2024-06-01" },
];
const mockDevices = [
  { id: 1, name: "Chrome on Mac", lastActive: "2024-06-10" },
];

export default function PrivacySecuritySettings() {
  const [tokens, setTokens] = useState(mockTokens);
  const [devices, setDevices] = useState(mockDevices);
  const [privacy, setPrivacy] = useState(true);
  const [success, setSuccess] = useState("");
  const [confirmToken, setConfirmToken] = useState<number|null>(null);
  const [confirmDevice, setConfirmDevice] = useState<number|null>(null);

  const handleRevokeToken = (id: number) => {
    setConfirmToken(id);
  };
  const confirmRevokeToken = () => {
    setTokens(tokens.filter(t => t.id !== confirmToken));
    setSuccess("Token revoked.");
    setTimeout(() => setSuccess(""), 2000);
    setConfirmToken(null);
  };
  const handleRemoveDevice = (id: number) => {
    setConfirmDevice(id);
  };
  const confirmRemoveDevice = () => {
    setDevices(devices.filter(d => d.id !== confirmDevice));
    setSuccess("Device removed.");
    setTimeout(() => setSuccess(""), 2000);
    setConfirmDevice(null);
  };
  const handlePrivacy = () => {
    setPrivacy(!privacy);
    setSuccess("Privacy preferences updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy & Security</CardTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Manage your tokens, sessions, privacy, and trusted devices.
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section aria-labelledby="tokens">
          <h2 id="tokens" className="font-semibold mb-2 flex items-center gap-2">
            Access Tokens <span title="Revoke tokens to remove access." className="text-xs cursor-help">?</span>
          </h2>
          <ul className="mb-2">
            {tokens.map(t => (
              <li key={t.id} className="flex items-center gap-2 mb-1">
                <span>{t.name} (Last used: {t.lastUsed})</span>
                <Button size="sm" variant="outline" onClick={() => handleRevokeToken(t.id)} aria-label={`Revoke ${t.name}`}>Revoke</Button>
              </li>
            ))}
          </ul>
          {confirmToken !== null && (
            <div className="bg-destructive/10 p-4 rounded mt-2">
              <div className="mb-2">Are you sure you want to revoke this token?</div>
              <Button variant="destructive" onClick={confirmRevokeToken}>Yes, Revoke</Button>
              <Button variant="outline" className="ml-2" onClick={() => setConfirmToken(null)}>Cancel</Button>
            </div>
          )}
        </section>
        <section aria-labelledby="sessions">
          <h2 id="sessions" className="font-semibold mb-2 flex items-center gap-2">
            Active Sessions <span title="Revoke sessions to log out from other devices." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" disabled aria-label="Revoke Sessions">Revoke Sessions (stub)</Button>
        </section>
        <section aria-labelledby="privacy">
          <h2 id="privacy" className="font-semibold mb-2 flex items-center gap-2">
            Data Privacy Preferences <span title="Control how your data is used." className="text-xs cursor-help">?</span>
          </h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={privacy} onChange={handlePrivacy} aria-label="Allow data processing for analytics" />
            Allow data processing for analytics
          </label>
        </section>
        <section aria-labelledby="security">
          <h2 id="security" className="font-semibold mb-2 flex items-center gap-2">
            Security Settings <span title="Review your security settings." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" disabled aria-label="Review Security Settings">Review (stub)</Button>
        </section>
        <section aria-labelledby="devices">
          <h2 id="devices" className="font-semibold mb-2 flex items-center gap-2">
            Trusted Devices <span title="Remove devices you no longer use." className="text-xs cursor-help">?</span>
          </h2>
          <ul className="mb-2">
            {devices.map(d => (
              <li key={d.id} className="flex items-center gap-2 mb-1">
                <span>{d.name} (Last active: {d.lastActive})</span>
                <Button size="sm" variant="outline" onClick={() => handleRemoveDevice(d.id)} aria-label={`Remove ${d.name}`}>Remove</Button>
              </li>
            ))}
          </ul>
          {confirmDevice !== null && (
            <div className="bg-destructive/10 p-4 rounded mt-2">
              <div className="mb-2">Are you sure you want to remove this device?</div>
              <Button variant="destructive" onClick={confirmRemoveDevice}>Yes, Remove</Button>
              <Button variant="outline" className="ml-2" onClick={() => setConfirmDevice(null)}>Cancel</Button>
            </div>
          )}
        </section>
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
      </CardContent>
    </Card>
  );
} 