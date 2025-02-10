/** @type {import('next').NextConfig} */
const moment = require('moment');
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase) => {

  const isProd = (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) && process.env.STAGING !== '1' && process.env.SANDBOX !== '1'
  // const isStaging = (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) && process.env.STAGING === '1'
  const isSandbox = process.env.SANDBOX === '1'
  const isDev = phase === PHASE_DEVELOPMENT_SERVER

  console.log(`isDev:${isDev}  isProd:${isProd} isSandbox:${isSandbox}`)

  const BASE_PATH = '';
  let domain = 'http://localhost:2024'
  let domain_ip = 'https://127.0.0.1:2024'

  if (isSandbox) {
    domain = 'http://anveshpoda.blrsoftware.jd:2024'
    domain_ip = 'http://192.168.40.172:2024'
  }

  const env = {
    env: isProd ? 'production' : isSandbox ? 'sandbox' : 'development',
    origin: domain,
    DOMAIN: domain + BASE_PATH + '/',
    API_DOMAIN_CLIENT: domain + BASE_PATH + '/api/',
    API_DOMAIN_SERVER: domain_ip + BASE_PATH + '/api/',

    collectionId: process.env.collectionId,
    apiKey: process.env.apiKey,
  }

  console.log('env >>> ', env);
  const Images = {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      }
    ],
  };

  return {
    env,
    // basePath: BASE_PATH,
    images: Images,
    eslint: { ignoreDuringBuilds: true },
    // reactStrictMode: true,
    // generateBuildId: async () => {
    //   return moment().format('YYYYMMDD-HHmmss')
    // }
  }
}
