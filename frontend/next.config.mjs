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
    ];
  },
}

export default nextConfig
