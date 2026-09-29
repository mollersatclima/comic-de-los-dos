import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "booth-probe-carter-sie.trycloudflare.com",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
