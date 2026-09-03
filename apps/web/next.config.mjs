/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  // Static export for CDN hosting (no Node.js server needed)
  output: 'export',
  // basePath for GitHub Pages (/floodguard) or empty for Surge (root)
  basePath,
  assetPrefix: basePath,
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Trailing slash ensures CDNs serve /map/ and /map identically
  trailingSlash: true,
};

export default nextConfig;
