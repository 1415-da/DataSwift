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
