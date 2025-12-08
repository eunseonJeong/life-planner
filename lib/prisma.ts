import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// DATABASE_URL이 없으면 SQLite 사용 (로컬 개발)
// DATABASE_URL이 있으면 PostgreSQL 사용 (프로덕션)
// 서버 사이드에서는 DATABASE_URL이 없으면 SQLite 스키마를 사용해야 함
const hasDatabaseUrl = !!process.env.DATABASE_URL

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    errorFormat: 'pretty',
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
