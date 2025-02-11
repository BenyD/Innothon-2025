/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.ico',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig 