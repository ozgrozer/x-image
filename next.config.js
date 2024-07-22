const withTM = require('next-transpile-modules')(['rfv'])

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium'
    ]
  }
}

module.exports = withTM(nextConfig)
