const tutorials = [
  {
    title: "Onboarding: Your First Project",
    steps: [
      "Sign up and create your workspace.",
      "Upload your first dataset.",
      "Run automated EDA.",
      "Train your first model in ModelLab.",
      "Explore results and download reports.",
    ],
  },
  {
    title: "Connecting to an API Data Source",
    steps: [
      "Navigate to Data Upload.",
      "Select 'Connect API'.",
      "Enter your API credentials and endpoint.",
      "Test the connection and import data.",
    ],
  },
  {
    title: "Troubleshooting: Common Data Upload Issues",
    steps: [
      "Check file format and size limits.",
      "Ensure required columns are present.",
      "Review error messages for details.",
      "Contact support if issues persist.",
    ],
  },
];

export default function TutorialsPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Step-by-Step Tutorials</h2>
      <p className="mb-6 text-muted-foreground">Follow these guides to master DataSwift features and troubleshoot common issues.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutorials.map((tut) => (
          <div key={tut.title} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold mb-1">{tut.title}</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground">
              {tut.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
} 