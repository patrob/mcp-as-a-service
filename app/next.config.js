const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  ...(process.env.NODE_ENV === "test" && {
    experimental: {
      isrMemoryCacheSize: 0,
    },
  }),
};

module.exports = nextConfig;

