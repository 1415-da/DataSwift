import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockIntegrations = [
  { id: 1, name: "Slack", status: "Connected" },
  { id: 2, name: "Zapier", status: "Not Connected" },
];

export default function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [apiKey, setApiKey] = useState("");
  const [success, setSuccess] = useState("");

  const handleConnect = (id: number) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, status: "Connected" } : i));
    setSuccess("Integration connected!");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleDisconnect = (id: number) => {
    setIntegrations(integrations.map(i => i.id === id ? { ...i, status: "Not Connected" } : i));
    setSuccess("Integration disconnected.");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleSaveApiKey = () => {
    setSuccess("API Key saved!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Connect third-party tools and manage API keys and webhooks.
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section aria-labelledby="integrations-list">
          <h2 id="integrations-list" className="font-semibold mb-2 flex items-center gap-2">
            Third-Party Integrations <span title="Connect or disconnect integrations." className="text-xs cursor-help">?</span>
          </h2>
          <ul className="mb-2">
            {integrations.map(i => (
              <li key={i.id} className="flex items-center gap-2 mb-1">
                <span>{i.name} - {i.status}</span>
                {i.status === "Connected" ? (
                  <Button size="sm" variant="outline" onClick={() => handleDisconnect(i.id)} aria-label={`Disconnect ${i.name}`}>Disconnect</Button>
                ) : (
                  <Button size="sm" onClick={() => handleConnect(i.id)} aria-label={`Connect ${i.name}`}>Connect</Button>
                )}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="api-keys">
          <h2 id="api-keys" className="font-semibold mb-2 flex items-center gap-2">
            API Keys <span title="Manage your API keys for integrations." className="text-xs cursor-help">?</span>
          </h2>
          <Input type="text" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} aria-label="API Key" />
          <Button className="mt-2" onClick={handleSaveApiKey} aria-label="Save API Key">Save</Button>
        </section>
        <section aria-labelledby="webhooks">
          <h2 id="webhooks" className="font-semibold mb-2 flex items-center gap-2">
            Webhooks <span title="Configure webhooks for real-time updates." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" disabled aria-label="Configure Webhooks">Configure (stub)</Button>
        </section>
        <section aria-labelledby="sso">
          <h2 id="sso" className="font-semibold mb-2 flex items-center gap-2">
            SSO <span title="Configure Single Sign-On." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" disabled aria-label="Configure SSO">Configure (stub)</Button>
        </section>
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
      </CardContent>
    </Card>
  );
} 