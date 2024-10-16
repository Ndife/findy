/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gravatar.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/sign-in',
        destination: '/api/auth/login',
        permanent: true,
      },
      {
        source: '/sign-up',
        destination: '/api/auth/register',
        permanent: true,
      },
      {
        source: '/sign-out',
        destination: '/api/auth/logout',
        permanent: true,
      },

    ]
  },
  // pdfrenderer config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack}) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  }
}

module.exports = nextConfig
