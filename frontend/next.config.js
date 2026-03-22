/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'REPLACE_WITH_API_BASE_URL',
    API_KEY: process.env.NEXT_PUBLIC_API_KEY || 'REPLACE_WITH_API_KEY'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'REPLACE_WITH_API_BASE_URL'}/:path*`
      }
    ]
  }
}

module.exports = nextConfig