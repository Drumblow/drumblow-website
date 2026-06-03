import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  // output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/seed/**',
      },
    ],
  },
  // Redirects for locale-less paths to default locale
  async redirects() {
    return [
      { source: '/projetos', destination: '/en/projetos', permanent: true },
      { source: '/about', destination: '/en/about', permanent: true },
      { source: '/contact', destination: '/en/contact', permanent: true },
      { source: '/products', destination: '/en/products', permanent: true },
      { source: '/blog', destination: '/en/blog', permanent: true },
      { source: '/blog/:slug', destination: '/en/blog/:slug', permanent: true },
      { source: '/projetos/:slug', destination: '/en/projetos/:slug', permanent: true },
    ]
  },

  // Force webpack for build to support custom webpack config (ws fallback).
  // Turbopack is default in Next 16; can migrate later in PR 1b if desired.
  // See: https://nextjs.org/docs/app/api-reference/next-config-js/turbopack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ws: false,
      }
    }
    return config
  },
}

export default withNextIntl(nextConfig)