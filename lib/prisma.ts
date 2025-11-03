import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// DATABASE_URL이 없을 경우 명확한 에러 메시지 제공
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL 환경 변수가 설정되지 않았습니다. Vercel 대시보드에서 환경 변수를 확인하세요.'
  )
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
