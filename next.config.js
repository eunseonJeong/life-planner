/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma와 Next.js 호환성을 위한 설정
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}
module.exports = nextConfig
