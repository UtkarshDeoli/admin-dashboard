/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'citysync.utkarshdeoli.in',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;
