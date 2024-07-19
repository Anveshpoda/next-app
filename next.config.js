/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    collectionId: process.env.collectionId,
    apiKey: process.env.apiKey,
    DOMAIN: process.env.domain + '/',
    API_DOMAIN_CLIENT: process.env.domain + '/api/',
    API_DOMAIN_SERVER: process.env.domain_ip + '/api/'
  }
}

module.exports = nextConfig
