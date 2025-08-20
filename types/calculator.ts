export interface CalculatorData {
  id?: string
  name: string
  currentAge: number
  currentSalary: number
  monthlyExpenses: number
  monthlySavings: number
  investmentReturn: number
  targetAmount: number
  targetAge: number
  portfolio: {
    etf: number
    stocks: number
    realEstate: number
    cash: number
  }
  createdAt?: string
  updatedAt?: string
}

export interface CalculatorFormData {
  id?: string
  name: string
  currentAge: number
  currentSalary: number
  monthlyExpenses: number
  monthlySavings: number
  investmentReturn: number
  targetAmount: number
  targetAge: number
  portfolio: {
    etf: number
    stocks: number
    realEstate: number
    cash: number
  }
}

export interface CalculationResult {
  targetYear: number
  targetMonth: number
  currentAmount: number
  yearlyData: Array<{
    year: number
    age: number
    amount: number
    monthlySavings: number
  }>
  monthlySavings: number
  totalMonths: number
}
