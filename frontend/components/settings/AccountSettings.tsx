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
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [twoFASuccess, setTwoFASuccess] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState("");
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
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatarUrl }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();
      setUser(updatedUser); // Optionally update context/state here
      setSuccess("Profile updated!");
      setEditMode(false);
      // If email changed, sign out to re-authenticate
      if (email !== user?.email) {
        setTimeout(() => signOut({ callbackUrl: "/" }), 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    try {
      const res = await fetch("/api/account/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, password }),
      });
      if (!res.ok) throw new Error("Failed to update password");
      setPasswordSuccess("Password updated!");
      setPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setTwoFALoading(true);
    setTwoFAError("");
    setTwoFASuccess("");
    try {
      const res = await fetch("/api/account/2fa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, enable: !twoFAEnabled }),
      });
      if (!res.ok) throw new Error("Failed to update 2FA");
      setTwoFAEnabled(!twoFAEnabled);
      setTwoFASuccess(twoFAEnabled ? "2FA disabled." : "2FA enabled!");
    } catch (err) {
      setTwoFAError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setTwoFALoading(false);
    }
  };

  const handleDownloadAccountData = async () => {
    setDownloadLoading(true);
    setDownloadError("");
    setDownloadSuccess("");
    try {
      const res = await fetch(`/api/account/export?email=${user?.email}`);
      if (!res.ok) throw new Error("Failed to export account data");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `account_data.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setDownloadSuccess("Account data downloaded!");
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDownloadLoading(false);
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
                <AvatarFallback>{(name && name[0]) ? name[0].toUpperCase() : (email && email[0]) ? email[0].toUpperCase() : "?"}</AvatarFallback>
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
                <Button onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)} disabled={loading}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit Profile</Button>
            )}
          </div>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          {error && <div className="text-destructive text-sm mt-2">{error}</div>}
        </div>
        {/* Change password */}
        <div>
          <label className="block font-medium mb-1">Change Password</label>
          <Input type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button className="mt-2" onClick={handlePasswordChange} disabled={passwordLoading || !password}>{passwordLoading ? "Updating..." : "Update Password"}</Button>
          {passwordSuccess && <div className="text-green-600 text-sm mt-2">{passwordSuccess}</div>}
          {passwordError && <div className="text-destructive text-sm mt-2">{passwordError}</div>}
        </div>
        {/* Two-factor authentication */}
        <div>
          <label className="block font-medium mb-1">Two-Factor Authentication</label>
          <Button variant="outline" onClick={handleToggle2FA} disabled={twoFALoading}>{twoFALoading ? (twoFAEnabled ? "Disabling..." : "Enabling...") : (twoFAEnabled ? "Disable 2FA" : "Enable 2FA")}</Button>
          {twoFASuccess && <div className="text-green-600 text-sm mt-2">{twoFASuccess}</div>}
          {twoFAError && <div className="text-destructive text-sm mt-2">{twoFAError}</div>}
        </div>
        {/* Connected accounts (OAuth) */}
        <div>
          <label className="block font-medium mb-1">Connected Accounts</label>
          <div className="flex gap-2">
            <Button variant="outline" disabled>Manage OAuth/SSO (stub)</Button>
          </div>
        </div>
        {/* Download account data */}
        <div>
          <Button variant="outline" onClick={handleDownloadAccountData} disabled={downloadLoading}>{downloadLoading ? "Downloading..." : "Download Account Data"}</Button>
          {downloadSuccess && <div className="text-green-600 text-sm mt-2">{downloadSuccess}</div>}
          {downloadError && <div className="text-destructive text-sm mt-2">{downloadError}</div>}
        </div>
      </CardContent>
    </Card>
  );
} 