import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card gradient>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-lg py-8 text-center">
            Settings page coming soon.<br />
            Here you will be able to manage your account, notifications, integrations, and more.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 