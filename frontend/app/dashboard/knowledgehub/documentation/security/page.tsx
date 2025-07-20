import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function SecurityArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Security & Compliance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>DataSwift is built with security and privacy in mind, helping you comply with industry standards.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Features</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>End-to-end encryption for data in transit and at rest.</li>
            <li>Role-based access control and audit logs.</li>
            <li>GDPR, HIPAA, and SOC2 compliance support.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Best Practices</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Use strong passwords and enable 2FA.</li>
            <li>Review access permissions regularly.</li>
            <li>Contact support for compliance documentation.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 