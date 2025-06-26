const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  ...(process.env.NODE_ENV === "test" && {
    experimental: {
      isrMemoryCacheSize: 0,
      serverComponentsExternalPackages: ['dockerode', 'ssh2', 'docker-modem'],
    },
  }),
  experimental: {
    serverComponentsExternalPackages: ['dockerode', 'ssh2', 'docker-modem'],
  },
};

module.exports = nextConfig;

