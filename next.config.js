/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["cdn.discordapp.com", "github.com"],
    unoptimized: true
  }
}

module.exports = nextConfig
