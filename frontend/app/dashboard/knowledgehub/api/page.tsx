const apis = [
  {
    group: "Authentication",
    endpoints: [
      { method: "POST", path: "/api/auth/login", description: "User login with email and password." },
      { method: "POST", path: "/api/auth/logout", description: "Logout current user session." },
    ],
  },
  {
    group: "Data Upload",
    endpoints: [
      { method: "POST", path: "/api/data/upload", description: "Upload a new dataset (CSV, JSON, etc.)." },
      { method: "GET", path: "/api/data/list", description: "List all uploaded datasets." },
    ],
  },
  {
    group: "ModelLab",
    endpoints: [
      { method: "POST", path: "/api/model/train", description: "Train a new machine learning model." },
      { method: "GET", path: "/api/model/list", description: "List all trained models." },
    ],
  },
];

export default function APIReferencePage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">API Reference</h2>
      <p className="mb-6 text-muted-foreground">Integrate with DataSwift using our RESTful API. Below are the main endpoints and usage examples.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api) => (
          <div key={api.group} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <h3 className="text-lg font-bold mb-1">{api.group}</h3>
            <ul className="text-sm">
              {api.endpoints.map((ep) => (
                <li key={ep.path} className="mb-1">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded mr-2 text-xs">{ep.method}</span>
                  <span className="font-mono text-xs">{ep.path}</span>
                  <span className="ml-2 text-muted-foreground">{ep.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h4 className="font-semibold mb-2">Sample: Fetch Datasets (JavaScript)</h4>
        <pre className="bg-muted rounded p-4 text-xs overflow-x-auto">
{`fetch('/api/data/list', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
  .then(res => res.json())
  .then(data => console.log(data));`}
        </pre>
      </div>
    </div>
  );
} 