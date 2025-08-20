export interface PortfolioItem {
  key: string
  label: string
  color: string
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  { key: 'etf', label: 'ETF', color: 'bg-blue-500' },
  { key: 'stock', label: '주식', color: 'bg-green-500' },
  { key: 'cma', label: 'CMA', color: 'bg-purple-500' },
  { key: 'isa', label: 'ISA', color: 'bg-yellow-500' },
  { key: 'pension', label: '연금저축', color: 'bg-orange-500' },
  { key: 'crypto', label: '코인', color: 'bg-red-500' },
  { key: 'housing', label: '주택청약', color: 'bg-indigo-500' },
  { key: 'youth', label: '청년도약계좌', color: 'bg-teal-500' }
]
