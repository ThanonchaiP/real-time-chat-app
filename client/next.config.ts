import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["chatapp-media-assets.s3.ap-southeast-7.amazonaws.com"],
  },
};

export default nextConfig;
