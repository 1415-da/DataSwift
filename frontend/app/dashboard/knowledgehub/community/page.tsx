const resources = [
  {
    title: "Community Forum",
    description: "Ask questions, share knowledge, and connect with other users.",
    link: "https://community.dataswift.com",
  },
  {
    title: "Support Center",
    description: "Get help from our support team and browse FAQs.",
    link: "https://support.dataswift.com",
  },
  {
    title: "Contribute to Docs",
    description: "Learn how to contribute to our documentation and knowledge base.",
    link: "/docs/contribute",
  },
  {
    title: "Release Notes",
    description: "Stay up to date with the latest features and updates.",
    link: "/docs/release-notes",
  },
];

export default function CommunityPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Community & Resources</h2>
      <p className="mb-6 text-muted-foreground">Connect with other users, get support, and contribute to DataSwift.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {resources.map((res) => (
          <div key={res.title} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold mb-1">{res.title}</h3>
            <p className="text-muted-foreground mb-2">{res.description}</p>
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm w-fit">Visit</a>
          </div>
        ))}
      </div>
    </div>
  );
} 