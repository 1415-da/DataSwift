import Link from "next/link";

const docs = [
  {
    title: "Getting Started",
    description: "Learn how to set up your account, connect data sources, and start using DataSwift.",
    link: "/dashboard/knowledgehub/documentation/getting-started",
  },
  {
    title: "Data Upload & Connections",
    description: "Step-by-step guides for uploading files, connecting APIs, and linking databases.",
    link: "/dashboard/knowledgehub/documentation/data-upload",
  },
  {
    title: "Automated EDA",
    description: "How to run automated exploratory data analysis and interpret results.",
    link: "/dashboard/knowledgehub/documentation/eda",
  },
  {
    title: "ModelLab",
    description: "Train, compare, and test machine learning models with AI guidance.",
    link: "/dashboard/knowledgehub/documentation/modellab",
  },
  {
    title: "Model Testing",
    description: "Learn how to test deployed models, make predictions, and evaluate performance metrics.",
    link: "/dashboard/knowledgehub/documentation/testing",
  },
  {
    title: "Data Export & Sharing",
    description: "Export results, share reports, and collaborate with stakeholders.",
    link: "/dashboard/knowledgehub/documentation/integrations",
  },
  {
    title: "Security & Compliance",
    description: "Understand platform security, privacy, and compliance features.",
    link: "/dashboard/knowledgehub/documentation/security",
  },
];

export default function DocumentationPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Platform Documentation</h2>
      <p className="mb-6 text-muted-foreground">Browse documentation for every feature and process in DataSwift.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docs.map((doc) => (
          <div key={doc.title} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold mb-1">{doc.title}</h3>
            <p className="text-muted-foreground mb-2">{doc.description}</p>
            <Link href={doc.link}>
              <button className="text-primary underline text-sm w-fit">Read More</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 