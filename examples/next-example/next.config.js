/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    swcPlugins: [['typewind/swc', {}]],
  },
};

module.exports = nextConfig;
