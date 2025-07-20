import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function KnowledgeHubArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Knowledge Hub</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>The Knowledge Hub is your self-service resource for documentation, tutorials, best practices, and community support.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">What You Can Do</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Search for articles and guides on any topic.</li>
            <li>Browse best practices and troubleshooting tips.</li>
            <li>Access API reference and integration guides.</li>
            <li>Connect with the community and support.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Contributing</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Suggest edits or new articles via the Community page.</li>
            <li>Rate articles and provide feedback to improve content.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 