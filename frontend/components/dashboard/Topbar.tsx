'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const { user, logout } = useAuth();
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur z-10 sticky top-0">
      <div className="flex-1 max-w-xl">
        <Input type="search" placeholder="Search across dashboard..." className="w-full text-base" />
      </div>
      <div className="flex items-center gap-4 ml-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <Avatar>
                {user?.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name || user.email} />
                ) : (
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                )}
              </Avatar>
              <span className="hidden md:inline text-sm font-medium text-foreground/80">{user?.email}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 