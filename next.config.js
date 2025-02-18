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
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
}

module.exports = nextConfig 