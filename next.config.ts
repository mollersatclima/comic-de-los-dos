import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  allowedDevOrigins: [
    "127.0.0.1",
    "crucial-ind-characteristics-currency.trycloudflare.com",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
