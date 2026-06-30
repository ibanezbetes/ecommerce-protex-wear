import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'forli.es',
      },
      {
        protocol: 'http',
        hostname: 'anbor.eu',
      },
      {
        protocol: 'https',
        hostname: 'anbor.eu',
      }
    ],
  },
};

export default nextConfig;
