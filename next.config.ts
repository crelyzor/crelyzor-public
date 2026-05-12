import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Point to this repo's own root so Next.js doesn't pick up the parent monorepo lockfile
  outputFileTracingRoot: path.join(__dirname, './'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  async headers() {
    return [
      {
        // Allow schedule pages to be embedded in iframes from any origin.
        // Next.js sets X-Frame-Options: SAMEORIGIN by default — this overrides it.
        source: '/schedule/:path*',
        headers: [
          // X-Frame-Options does not support ALLOWALL — use CSP frame-ancestors instead.
          // Next.js sets X-Frame-Options: SAMEORIGIN by default; remove it for embed routes.
          { key: 'X-Frame-Options', value: '' },
          { key: 'Content-Security-Policy', value: 'frame-ancestors *' },
        ],
      },
    ];
  },
};

export default nextConfig;
