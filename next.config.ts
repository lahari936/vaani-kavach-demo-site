import type { NextConfig } from "next";

// The deployed Vaani Kavach detector (FastAPI + AASIST ONNX). Same-origin
// /api/vaani/* is proxied there, so the browser needs no CORS and no key.
const VAANI_API_URL = (process.env.VAANI_API_URL ?? "https://vaani-kavach-five.vercel.app").replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/api/vaani/health", destination: `${VAANI_API_URL}/health` },
      { source: "/api/vaani/:path*", destination: `${VAANI_API_URL}/api/v1/:path*` },
    ];
  },
};

export default nextConfig;
