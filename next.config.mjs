/* next.config.mjs | No Caching Configuration | Sree | 14 Aug 2024 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Disable page caching
    headers: async () => [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ],
  };
  
  export default nextConfig;
  
// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;