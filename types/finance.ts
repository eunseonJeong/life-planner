export interface FinancialData {
  year?: number
  totalAssets?: number
  monthlyIncome?: number
  monthlyExpenses?: {
    fixed?: number
    living?: number
    other?: number
  }
  monthlySavings?: {
    etf?: number
    cma?: number
    isa?: number
    pension?: number
    stock?: number
    crypto?: number
    housing?: number
    youth?: number
  }
  investmentReturn?: number
  emergencyFund?: number
}

export interface LifeStage {
  id: string
  stage: string
  age: number
  description: string
  targetAmount: number
  currentAmount: number
  priority: 'high' | 'medium' | 'low'
}

export interface LifeStageFormData {
  id: string
  stage: string
  age: number
  description: string
  targetAmount: number
  currentAmount: number
  priority: 'high' | 'medium' | 'low'
}

export interface FinancialFormData {
  year?: number
  totalAssets?: number
  monthlyIncome?: number
  monthlyExpenses?: {
    fixed?: number
    living?: number
    other?: number
  }
  monthlySavings?: {
    etf?: number
    cma?: number
    isa?: number
    pension?: number
    stock?: number
    crypto?: number
    housing?: number
    youth?: number
  }
  investmentReturn?: number
  emergencyFund?: number
}

export interface PortfolioItem {
  type: string
  percentage: number
  amount: number
  description?: string
}

export interface CashFlow {
  income: number
  expenses: number
  savings: number
}
