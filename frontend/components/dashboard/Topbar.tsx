'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

function ProfileModal({ open, onOpenChange, user }: { open: boolean, onOpenChange: (open: boolean) => void, user: any }) {
  const { setUser } = useAuth() as any;
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [success, setSuccess] = useState('');

  const handleSave = () => {
    const updatedUser = { ...user, name, avatarUrl };
    setUser(updatedUser);
    localStorage.setItem('auth:user', JSON.stringify(updatedUser));
    setEditMode(false);
    setSuccess('Profile updated!');
    setTimeout(() => setSuccess(''), 2000);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>View and edit your profile information</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <Avatar className="w-20 h-20">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name || user?.email} />
            ) : (
              <AvatarFallback className="text-2xl">{(name || user?.email)?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            )}
          </Avatar>
          {editMode ? (
            <>
              <Input
                className="w-48 text-center"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Name"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Avatar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <Button variant="secondary" size="sm" className="mt-2" onClick={handleSave}>Save</Button>
              <Button variant="outline" size="sm" className="mt-1" onClick={() => setEditMode(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold">{name || 'No Name'}</div>
              <div className="text-muted-foreground">{user?.email}</div>
              <Button variant="secondary" size="sm" className="mt-2" onClick={() => setEditMode(true)}>Edit Profile</Button>
            </>
          )}
        </div>
        {success && <div className="text-green-600 text-sm text-center mt-2">{success}</div>}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Topbar() {
  const { user, logout, setUser, loading } = useAuth() as any;
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur z-10 sticky top-0">
      <div className="flex-1 max-w-xl">
        <Input type="search" placeholder="Search across dashboard..." className="w-full text-base" />
      </div>
      <div className="flex items-center gap-4 ml-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none" onClick={() => setProfileOpen(true)}>
              <Avatar>
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user?.name || user?.email || 'User'} />
                ) : (
                  <AvatarFallback>
                    {loading ? '' : (user?.name ? user.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || '?')}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-foreground/80">
                {loading ? ' ' : (user?.name || user?.email || '')}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setProfileOpen(true)}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ProfileModal open={profileOpen} onOpenChange={setProfileOpen} user={user} />
    </header>
  );
} 