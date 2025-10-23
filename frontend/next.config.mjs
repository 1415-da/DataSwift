/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Increase body size limit for file uploads
  experimental: {
    serverComponentsExternalPackages: [],
    // Increase middleware body size limit
    middlewareClientMaxBodySize: '50mb',
  },
  // Configure API routes with larger body size
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
  async rewrites() {
    return [
      {
        source: '/api/data/:path*',
        destination: 'http://localhost:8000/api/data/:path*',
      },
      {
        source: '/api/model/:path*',
        destination: 'http://localhost:8000/api/model/:path*',
      },
      {
        source: '/api/predict/:path*',
        destination: 'http://localhost:8000/api/predict/:path*',
      },
      {
        source: '/api/knowledge/:path*',
        destination: 'http://localhost:8000/api/knowledge/:path*',
      },
      {
        source: '/api/user/:path*',
        destination: 'http://localhost:8000/api/user/:path*',
      },
    ];
  },
}

export default nextConfig
