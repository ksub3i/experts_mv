import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Temporary stock placeholders (src/content/images.ts). Remove once real photos are in /public.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
        search: "?auto=format&fit=crop&w=2400&q=80",
      },
    ],
  },
};

export default nextConfig;
