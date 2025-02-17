/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jycgacsicczslkfiazkw.supabase.co'
      },
      {
        protocol: 'https',
        hostname: 'vxybvvrsiujnqatmncjt.supabase.co'
      }
    ],
  },
}

module.exports = nextConfig 