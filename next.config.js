/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdfrenderer config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack}) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  }
}

module.exports = nextConfig
