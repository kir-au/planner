/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh', 'lh3.googleusercontent.com']
  },
  generateBuildId: async () => null,
  experimental: {
    serverComponentsExternalPackages: ['@tremor/react']
  }
};

module.exports = nextConfig;
