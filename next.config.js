/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, HEAD, OPTIONS',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
