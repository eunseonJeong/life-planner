/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prisma와 Next.js 호환성을 위한 설정
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig;
