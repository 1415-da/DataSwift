import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

export default function EDAArticle() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Automated EDA</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <section>
          <h2 className="font-semibold text-lg mb-2">Overview</h2>
          <p>Automated Exploratory Data Analysis (EDA) helps you quickly understand your dataset.</p>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">How to Run EDA</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Upload or select a dataset.</li>
            <li>Click 'Run EDA' in the dashboard.</li>
            <li>Review the generated summary statistics, charts, and data quality checks.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">What You Get</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Descriptive statistics (mean, median, mode, etc.).</li>
            <li>Distribution plots and outlier detection.</li>
            <li>Missing value analysis and data quality insights.</li>
          </ul>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-2">Tips</h2>
          <ul className="list-disc list-inside ml-4 text-muted-foreground">
            <li>Use EDA before modeling to spot issues early.</li>
            <li>Download the EDA report for documentation or sharing.</li>
          </ul>
        </section>
      </CardContent>
      <CardFooter className="justify-end">
        <Link href="/dashboard/knowledgehub/documentation" className="text-primary underline text-sm">← Back to Documentation</Link>
      </CardFooter>
    </Card>
  );
} 