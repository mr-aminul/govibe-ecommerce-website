import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.storage.inventivelab.bd',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'govibe-api.inventivelab.bd',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
}

export default nextConfig
