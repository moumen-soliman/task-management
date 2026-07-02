import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the Turbopack workspace root to this project so a stray lockfile
  // in a parent directory doesn't cause Next to infer the wrong root.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
