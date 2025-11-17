import type { NextConfig } from "next";

const getEnvConfig = () => {
  switch (process.env.ENV) {
    case "dev": {
      return {
        env: "dev",
        apiUrl: "http://localhost:3000",
        frontendUrl: "http://localhost:3001",
      };
    }
  }
};


const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {
    externalDir: true,
  },
  images: { unoptimized: true },
  env: getEnvConfig() as any, // Using env instead of publicRuntimeConfig
};

export default nextConfig;
