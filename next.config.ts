import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  serverExternalPackages: ["better-sqlite3"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-to-uploads.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.dev.to",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./shared/config/i18n/request.ts");

export default withNextIntl(nextConfig);
