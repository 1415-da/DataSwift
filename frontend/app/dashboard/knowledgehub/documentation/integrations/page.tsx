import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function IntegrationsArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>Connect DataSwift to your favorite tools, APIs, and databases.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Supported Integrations</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>APIs: REST, GraphQL, and more.</li>
            <li>Databases: Postgres, MySQL, SQL Server, MongoDB, etc.</li>
            <li>Third-party tools: Slack, Zapier, and more.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">How to Integrate</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Go to the Integrations section in Settings.</li>
            <li>Choose the integration type and follow the prompts.</li>
            <li>Manage API keys and webhooks as needed.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 