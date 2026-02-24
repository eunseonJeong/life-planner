import { NextRequest } from 'next/server'
import { FinancialData } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { AccountSummary } from '@/types/account'

const toAmount = (value: number | null | undefined): number => value ?? 0

export const resolveUserIdFromRequest = (request: NextRequest): string | null => {
  const headerUserId = request.headers.get('x-user-id') || request.headers.get('user-id')
  if (headerUserId) return headerUserId

  const { searchParams } = new URL(request.url)
  return searchParams.get('userId')
}

export const findLatestFinancialSnapshot = async (userId: string): Promise<FinancialData | null> => {
  return prisma.financialData.findFirst({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })
}

export const buildAccountsFromSnapshot = (snapshot: FinancialData | null): AccountSummary[] => {
  if (!snapshot) return []

  const accounts: AccountSummary[] = [
    {
      id: 'total-assets',
      type: 'TOTAL_ASSETS',
      name: '총 자산 계좌',
      balance: toAmount(snapshot.currentAssets),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
    {
      id: 'cash-reserve',
      type: 'CASH_RESERVE',
      name: '비상금 계좌',
      balance: toAmount(snapshot.monthlySavingsEmergency),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
    {
      id: 'stock-portfolio',
      type: 'INVESTMENT_STOCK',
      name: '주식 포트폴리오',
      balance: toAmount(snapshot.investmentPortfolioStocks),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
    {
      id: 'real-estate-portfolio',
      type: 'INVESTMENT_REAL_ESTATE',
      name: '부동산 포트폴리오',
      balance: toAmount(snapshot.investmentPortfolioRealEstate),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
    {
      id: 'cash-account',
      type: 'CASH_ACCOUNT',
      name: '현금성 계좌',
      balance: toAmount(snapshot.investmentPortfolioCash),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
    {
      id: 'other-investments',
      type: 'INVESTMENT_OTHER',
      name: '기타 투자 계좌',
      balance: toAmount(snapshot.investmentPortfolioOther),
      currency: 'KRW',
      lastUpdated: snapshot.updatedAt.toISOString(),
    },
  ]

  return accounts.filter((account) => account.balance > 0)
}
