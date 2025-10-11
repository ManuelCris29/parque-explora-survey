/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-api-gateway-url.amazonaws.com/dev',
    API_KEY: process.env.NEXT_PUBLIC_API_KEY || 'parque-explora-api-key-2024'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      }
    ]
  }
}

module.exports = nextConfig