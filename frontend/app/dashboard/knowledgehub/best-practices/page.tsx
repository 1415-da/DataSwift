const bestPractices = [
  {
    title: "Data Preparation",
    description: "Clean, validate, and preprocess your data before analysis or modeling.",
    example: "Remove duplicates, handle missing values, and normalize features for better model performance.",
  },
  {
    title: "Version Control",
    description: "Track changes to datasets, code, and models using version control systems.",
    example: "Use Git for code and DVC for data/model versioning.",
  },
  {
    title: "Reproducibility",
    description: "Ensure your analyses and models can be reliably reproduced by others.",
    example: "Document your workflow, use notebooks, and share environment files (requirements.txt, environment.yml).",
  },
  {
    title: "Collaboration",
    description: "Work effectively with your team using shared workspaces and clear communication.",
    example: "Assign roles, use comments, and set up review processes for critical changes.",
  },
  {
    title: "Security & Privacy",
    description: "Protect sensitive data and comply with privacy regulations.",
    example: "Anonymize personal data, use access controls, and follow GDPR best practices.",
  },
];

export default function BestPracticesPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
      <p className="mb-6 text-muted-foreground">Follow these best practices to get the most out of DataSwift and ensure robust, secure, and collaborative workflows.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bestPractices.map((bp) => (
          <div key={bp.title} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold mb-1">{bp.title}</h3>
            <p className="mb-1">{bp.description}</p>
            <div className="text-xs text-muted-foreground italic">Example: {bp.example}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 