export default function DebugPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Debug Page</h1>
        <p className="text-lg text-muted-foreground mb-8">
          If you can see this, Next.js is working correctly.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <h2 className="font-semibold text-green-800 dark:text-green-200">✅ Server Status</h2>
            <p className="text-green-700 dark:text-green-300">Frontend is running on localhost:3000</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <h2 className="font-semibold text-blue-800 dark:text-blue-200">🔧 Next Steps</h2>
            <p className="text-blue-700 dark:text-blue-300">
              Go back to <a href="/" className="underline">homepage</a> to access the full application
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 