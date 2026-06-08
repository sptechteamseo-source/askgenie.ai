/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    // Allow Cloudinary URLs when unoptimized is later removed
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },

  // Prevent Next.js from bundling Node.js-only packages into the server bundle.
  // cloudinary uses Node.js built-ins (crypto, https, stream) that cannot run
  // in the Edge runtime or be webpack-bundled — they must stay as externals.
  serverExternalPackages: ['cloudinary'],
};

export default nextConfig;
