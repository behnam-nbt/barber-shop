/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGO_URL: process.env.MONGO_URI,
  },
  reactStrictMode: false,
};
export default nextConfig;
