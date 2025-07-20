import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function DataUploadArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Data Upload & Connections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>Learn how to bring your data into DataSwift using files, APIs, or databases.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">1. Upload a File</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Go to the Data Upload section.</li>
            <li>Click 'Upload File' and select your CSV, Excel, or JSON file.</li>
            <li>Review the data preview and confirm import.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">2. Connect an API</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Click 'Connect API'.</li>
            <li>Enter your API endpoint and credentials.</li>
            <li>Test the connection and import data.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">3. Link a Database</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Choose your database type (Postgres, MySQL, etc.).</li>
            <li>Enter connection details and credentials.</li>
            <li>Browse and select tables to import.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Troubleshooting</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Check file format and size limits.</li>
            <li>Ensure required columns are present.</li>
            <li>Contact support for help with API/database connections.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 