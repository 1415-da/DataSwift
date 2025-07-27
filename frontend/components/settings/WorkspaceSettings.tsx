import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockWorkspaces = [
  { id: 1, name: "Acme Inc.", description: "Main workspace", logo: "" },
  { id: 2, name: "Personal", description: "Personal projects", logo: "" },
];
const mockTeam = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Owner" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Member" },
];

export default function WorkspaceSettings() {
  const [workspaces, setWorkspaces] = useState(mockWorkspaces);
  const [currentWorkspace, setCurrentWorkspace] = useState(mockWorkspaces[0]);
  const [name, setName] = useState(currentWorkspace.name);
  const [description, setDescription] = useState(currentWorkspace.description);
  const [logo, setLogo] = useState(currentWorkspace.logo);
  const [team, setTeam] = useState(mockTeam);
  const [success, setSuccess] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Member");

  const handleSaveWorkspace = () => {
    setCurrentWorkspace({ ...currentWorkspace, name, description, logo });
    setSuccess("Workspace updated!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleSwitchWorkspace = (id: number) => {
    const ws = workspaces.find(w => w.id === id);
    if (ws) {
      setCurrentWorkspace(ws);
      setName(ws.name);
      setDescription(ws.description);
      setLogo(ws.logo);
      setSuccess("Switched workspace!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  const handleInvite = () => {
    if (!inviteEmail) return;
    setTeam([...team, { id: Date.now(), name: inviteEmail.split("@")[0], email: inviteEmail, role: inviteRole }]);
    setInviteEmail("");
    setInviteRole("Member");
    setSuccess("Team member invited!");
    setTimeout(() => setSuccess(""), 2000);
  };

  const handleRemove = (id: number) => {
    setTeam(team.filter(m => m.id !== id));
    setSuccess("Team member removed.");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workspace & Organization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Edit workspace info */}
        <div>
          <label className="block font-medium mb-1">Workspace Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
          <label className="block font-medium mb-1 mt-2">Description</label>
          <Input value={description} onChange={e => setDescription(e.target.value)} />
          <label className="block font-medium mb-1 mt-2">Logo</label>
          <Input type="file" accept="image/*" onChange={e => setLogo(e.target.value)} className="file:!bg-primary/10 file:!text-primary file:!border-primary/50 file:!ring-2 file:!ring-primary/30" />
          <Button className="mt-2" onClick={handleSaveWorkspace}>Save Workspace</Button>
        </div>
        {/* Switch workspace */}
        <div>
          <label className="block font-medium mb-1">Switch Workspace</label>
          <select
            className="border rounded px-2 py-1"
            value={currentWorkspace.id}
            onChange={e => handleSwitchWorkspace(Number(e.target.value))}
          >
            {workspaces.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
        </div>
        {/* Team management */}
        <div>
          <label className="block font-medium mb-1">Team Members</label>
          <ul className="mb-2">
            {team.map(m => (
              <li key={m.id} className="flex items-center gap-2 mb-1">
                <span>{m.name} ({m.email}) - {m.role}</span>
                <Button size="sm" variant="outline" onClick={() => handleRemove(m.id)}>Remove</Button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Invite email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
            />
            <select
              className="border rounded px-2"
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
            >
              <option>Member</option>
              <option>Admin</option>
            </select>
            <Button size="sm" onClick={handleInvite}>Invite</Button>
          </div>
        </div>
        {/* Preferences (stub) */}
        <div>
          <label className="block font-medium mb-1">Preferences</label>
          <Button variant="outline" disabled>Customize (stub)</Button>
        </div>
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </CardContent>
    </Card>
  );
} 