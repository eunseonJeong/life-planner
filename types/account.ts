export type AccountType =
  | 'TOTAL_ASSETS'
  | 'CASH_RESERVE'
  | 'INVESTMENT_STOCK'
  | 'INVESTMENT_REAL_ESTATE'
  | 'CASH_ACCOUNT'
  | 'INVESTMENT_OTHER'

export interface AccountSummary {
  id: string
  type: AccountType
  name: string
  balance: number
  currency: 'KRW'
  lastUpdated: string
}

export interface AccountsPayload {
  accounts: AccountSummary[]
  totalBalance: number
  currency: 'KRW'
}
