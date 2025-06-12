import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disable strict mode to prevent double rendering in development
  output: "export", // Use static export mode
  distDir:"out", // Output directory for the static export
  images: {
    unoptimized: true, // Disable image optimization for static export
  },
  basePath: "", // Set base path to empty for root deployment
  assetPrefix: "./", // Set asset prefix to empty for root deployment
  trailingSlash: true, // Add trailing slashes to URLs
};

export default nextConfig;
