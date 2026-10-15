/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@vercel/blob'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('undici');
    }
    return config;
  },
};

export default nextConfig;