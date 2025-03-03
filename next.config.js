/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/dashboard/admin/:userId",
        destination: "/dashboard/admin/[userId]", // Map dynamic route
      },
      {
        source: "/dashboard/institute/:userId",
        destination: "/dashboard/institute/[userId]", // Map dynamic route
      },
      {
        source: "/dashboard/verifier/:userId",
        destination: "/dashboard/verifier/[userId]", // Map dynamic route
      },
      {
        source: "/dashboard/guest/:userId",
        destination: "/dashboard/guest/[userId]", // Map dynamic route
      },
    ];
  },
  images: {
    domains: ["utfs.io"],
  },
};

module.exports = nextConfig;
