import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/links": ["./app/generated/prisma/**/*"],
  },
};

export default nextConfig;
