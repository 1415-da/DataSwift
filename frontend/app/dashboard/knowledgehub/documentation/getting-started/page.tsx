import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function GettingStartedArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Getting Started with DataSwift</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Welcome</h2>
          <p>Welcome to DataSwift! This guide will help you set up your account, connect your first data source, and start exploring your data.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Create Your Account</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Sign up with your email or use a social login (Google, GitHub, Twitter).</li>
            <li>Verify your email address if prompted.</li>
            <li>Complete your profile and set your workspace preferences.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Connect a Data Source</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Go to the <b>Data Upload</b> section from the dashboard.</li>
            <li>Choose to upload a file, connect an API, or link a database.</li>
            <li>Follow the prompts to provide credentials and import your data.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Explore with Automated EDA</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>After uploading, select your dataset and click <b>Run EDA</b>.</li>
            <li>Review the summary statistics, visualizations, and data quality insights.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">4. Next Steps</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Try training your first model in <b>ModelLab</b>.</li>
            <li>Invite team members to collaborate.</li>
            <li>Visit the <b>Knowledge Hub</b> for more guides and best practices.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Need Help?</h2>
          <p>Check out our <Link href="/dashboard/knowledgehub/community" className="underline text-primary">Community & Resources</Link> or <Link href="/dashboard/knowledgehub/documentation" className="underline text-primary">return to Documentation</Link>.</p>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 