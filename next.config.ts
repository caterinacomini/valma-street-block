import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The embedded Studio pulls in swr, whose react-server build has no default
  // export — keep `sanity` out of the server bundle so it loads at runtime.
  serverExternalPackages: ["sanity"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
