/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    collectionId: process.env.collectionId,
    apiKey: process.env.apiKey
  }
}

module.exports = nextConfig
