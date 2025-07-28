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
  // Optimize for Vercel serverless functions
  experimental: {
    serverComponentsExternalPackages: ['pandas', 'numpy', 'scikit-learn'],
  },
  // Enable static exports for better performance
  trailingSlash: true,
  // Optimize for Vercel
  swcMinify: true,
  // Configure for serverless deployment
  output: 'standalone',
  // Increase function timeout for complex operations
  serverRuntimeConfig: {
    maxDuration: 30,
  },
}

export default nextConfig
