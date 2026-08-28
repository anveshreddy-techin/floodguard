/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export for Netlify/GitHub Pages CDN hosting (no Node.js server needed)
  output: 'export',
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  // Trailing slash ensures Netlify serves /map/ and /map identically
  trailingSlash: true,
};

export default nextConfig;
