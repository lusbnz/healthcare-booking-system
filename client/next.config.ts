import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/doctor',
        destination: '/doctor/dashboard',
        permanent: true,
      },
      {
        source: '/patient',
        destination: '/patient/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
