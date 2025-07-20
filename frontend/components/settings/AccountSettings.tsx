import React, { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useSession, signOut, getProviders, unlink } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function AccountSettings() {
  const { user, setUser } = useAuth();
  const { data: session } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Connected accounts (OAuth)
  const connectedAccounts = session?.user?.accounts || [];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatarUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    // In a real app, call backend API to update user info
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
    setUser({ ...user, name, email, avatarUrl });
    setSuccess("Profile updated!");
    setTimeout(() => setSuccess(""), 2000);
    setEditMode(false);
    // If email changed, sign out to re-authenticate
    if (email !== user?.email) {
      setTimeout(() => signOut({ callbackUrl: "/" }), 1200);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Edit personal info */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Avatar className="w-16 h-16">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={name || email} />
              ) : (
                <AvatarFallback>{name ? name[0].toUpperCase() : email[0].toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            {editMode ? (
              <>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  Change Avatar
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </>
            ) : null}
          </div>
          <div className="space-y-2">
            <label className="block font-medium mb-1">Name</label>
            {editMode ? (
              <Input value={name} onChange={e => setName(e.target.value)} />
            ) : (
              <div>{name}</div>
            )}
            <label className="block font-medium mb-1 mt-2">Email Address</label>
            {editMode ? (
              <Input value={email} onChange={e => setEmail(e.target.value)} />
            ) : (
              <div>{email}</div>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            {editMode ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </div>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-destructive text-sm mt-2">{error}</div>}
        </div>
        {/* Change password (stub) */}
        <div>
          <label className="block font-medium mb-1">Change Password</label>
          <Input type="password" placeholder="New password" />
          <Button className="mt-2" disabled>Update Password (stub)</Button>
        </div>
        {/* Two-factor authentication (stub) */}
        <div>
          <label className="block font-medium mb-1">Two-Factor Authentication</label>
          <Button variant="outline" disabled>Set Up 2FA (stub)</Button>
        </div>
        {/* Connected accounts (OAuth) */}
        <div>
          <label className="block font-medium mb-1">Connected Accounts</label>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Manage OAuth/SSO (stub)</Button>
          </div>
        </div>
        {/* Download account data (stub) */}
        <div>
          <Button variant="outline" disabled>Download Account Data (stub)</Button>
        </div>
      </CardContent>
    </Card>
  );
} 