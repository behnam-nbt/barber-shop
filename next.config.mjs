/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true, // Enable experimental app directory support
    },
    async redirects() {
        return [
            {
                source: '/old-route',
                destination: '/new-route',
                permanent: true,
            },
        ];
    },
    // Optional: Revalidate on a specific path to force reloading of content
    revalidate: 0, // This will prevent caching issues with Vercel edge functions
};

export default nextConfig;
