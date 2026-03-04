import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    // Point to this repo's own root so Next.js doesn't pick up the parent monorepo lockfile
    outputFileTracingRoot: path.join(__dirname, './'),
    // Allow images from any remote hostname (GCS, API, etc.)
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
