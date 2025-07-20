"use client";
import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import AccountSettings from "@/components/settings/AccountSettings";
import WorkspaceSettings from "@/components/settings/WorkspaceSettings";
import NotificationsSettings from "@/components/settings/NotificationsSettings";
import IntegrationsSettings from "@/components/settings/IntegrationsSettings";
import PrivacySecuritySettings from "@/components/settings/PrivacySecuritySettings";
import BillingSettings from "@/components/settings/BillingSettings";
import ExportDeleteAccount from "@/components/settings/ExportDeleteAccount";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-2">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="account">
          <AccordionTrigger>Account Settings</AccordionTrigger>
          <AccordionContent>
            <AccountSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="workspace">
          <AccordionTrigger>Workspace & Organization</AccordionTrigger>
          <AccordionContent>
            <WorkspaceSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="notifications">
          <AccordionTrigger>Notifications & Preferences</AccordionTrigger>
          <AccordionContent>
            <NotificationsSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="integrations">
          <AccordionTrigger>Integrations</AccordionTrigger>
          <AccordionContent>
            <IntegrationsSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="privacy">
          <AccordionTrigger>Privacy & Security</AccordionTrigger>
          <AccordionContent>
            <PrivacySecuritySettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="billing">
          <AccordionTrigger>Billing & Subscription</AccordionTrigger>
          <AccordionContent>
            <BillingSettings />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="export">
          <AccordionTrigger>Export & Delete Account</AccordionTrigger>
          <AccordionContent>
            <ExportDeleteAccount />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 