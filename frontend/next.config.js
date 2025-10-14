/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/',
    API_KEY: process.env.NEXT_PUBLIC_API_KEY || 'jq7Ccsu8WCg5cQ4XDxXA8IVNrMIJCOm4eUWUlQYd'
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'https://eu0agbxch5.execute-api.us-east-1.amazonaws.com/dev/'}/:path*`
      }
    ]
  }
}

module.exports = nextConfig