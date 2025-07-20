import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button, Input } from "@/components/ui/button";

const mockInvoices = [
  { id: 1, date: "2024-05-01", amount: "$49.00" },
  { id: 2, date: "2024-04-01", amount: "$49.00" },
];

export default function BillingSettings() {
  const [plan, setPlan] = useState("Pro");
  const [payment, setPayment] = useState("**** **** **** 1234");
  const [invoices] = useState(mockInvoices);
  const [success, setSuccess] = useState("");

  const handleUpdatePayment = () => {
    setSuccess("Payment method updated!");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleDownloadInvoice = (id: number) => {
    setSuccess("Invoice downloaded!");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleManage = () => {
    setSuccess("Subscription management coming soon!");
    setTimeout(() => setSuccess(""), 2000);
  };
  const handleContact = () => {
    setSuccess("Support contacted!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <div className="text-muted-foreground text-sm mt-1">
          Manage your plan, payment methods, and billing history.
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <section aria-labelledby="plan">
          <h2 id="plan" className="font-semibold mb-2 flex items-center gap-2">
            Current Plan <span title="Your current subscription plan." className="text-xs cursor-help">?</span>
          </h2>
          <div className="mb-2">{plan}</div>
          <Button variant="outline" disabled aria-label="Change Plan">Change Plan (stub)</Button>
        </section>
        <section aria-labelledby="payment">
          <h2 id="payment" className="font-semibold mb-2 flex items-center gap-2">
            Payment Methods <span title="Update your payment method." className="text-xs cursor-help">?</span>
          </h2>
          <Input type="text" value={payment} onChange={e => setPayment(e.target.value)} aria-label="Payment Method" />
          <Button className="mt-2" onClick={handleUpdatePayment} aria-label="Update Payment">Update Payment</Button>
        </section>
        <section aria-labelledby="invoices">
          <h2 id="invoices" className="font-semibold mb-2 flex items-center gap-2">
            Invoices <span title="Download your past invoices." className="text-xs cursor-help">?</span>
          </h2>
          <ul className="mb-2">
            {invoices.map(inv => (
              <li key={inv.id} className="flex items-center gap-2 mb-1">
                <span>{inv.date} - {inv.amount}</span>
                <Button size="sm" variant="outline" onClick={() => handleDownloadInvoice(inv.id)} aria-label={`Download invoice ${inv.id}`}>Download</Button>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="manage">
          <h2 id="manage" className="font-semibold mb-2 flex items-center gap-2">
            Manage Subscription <span title="Manage or cancel your subscription." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" onClick={handleManage} aria-label="Manage Subscription">Manage/Cancel</Button>
        </section>
        <section aria-labelledby="support">
          <h2 id="support" className="font-semibold mb-2 flex items-center gap-2">
            Contact Support <span title="Contact support for billing issues." className="text-xs cursor-help">?</span>
          </h2>
          <Button variant="outline" onClick={handleContact} aria-label="Contact Support">Contact</Button>
        </section>
        {success && <div className="text-green-600 text-sm mt-2" role="status">{success}</div>}
      </CardContent>
    </Card>
  );
} 