import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

const withNextIntl = createNextIntlPlugin("./shared/config/i18n/request.ts");

export default withNextIntl(nextConfig);
