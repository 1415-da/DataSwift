'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Topbar from '@/components/dashboard/Topbar';
import { SidebarProvider } from '@/components/ui/sidebar';

const AppSidebar = dynamic(() => import('@/components/app-sidebar').then(mod => mod.AppSidebar), { ssr: false });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r">
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
} 