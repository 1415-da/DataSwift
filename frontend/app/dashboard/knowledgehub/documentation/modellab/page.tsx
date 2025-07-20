import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function ModelLabArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ModelLab</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>ModelLab lets you train, compare, and test machine learning models with ease.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Key Features</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>One-click model training for common algorithms.</li>
            <li>AI-generated advice for model selection.</li>
            <li>Compare model performance and download results.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">How to Use</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Go to the ModelLab section.</li>
            <li>Click 'New Model' and select your dataset and target variable.</li>
            <li>Choose a model type or let AI recommend one.</li>
            <li>Review results and download reports.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 