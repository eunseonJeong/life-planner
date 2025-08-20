'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { CalculatorData, CalculatorFormData } from '@/types/calculator'
import { addCalculatorData, updateCalculatorData } from '@/lib/api/calculator'
import { getCurrentUserId } from '@/lib/auth'

interface CalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CalculatorFormData) => void
  initialData?: CalculatorData
  mode: 'create' | 'edit'
}

export function CalculatorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}: CalculatorModalProps) {
  const [formData, setFormData] = useState<CalculatorFormData>({
    name: '',
    currentAge: 28,
    currentSalary: 35000000,
    monthlyExpenses: 2000000,
    monthlySavings: 1000000,
    investmentReturn: 7.0,
    targetAmount: 100000000,
    targetAge: 35,
    portfolio: {
      etf: 70,
      stocks: 15,
      realEstate: 5,
      cash: 10
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        name: initialData.name,
        currentAge: initialData.currentAge,
        currentSalary: initialData.currentSalary,
        monthlyExpenses: initialData.monthlyExpenses,
        monthlySavings: initialData.monthlySavings,
        investmentReturn: initialData.investmentReturn,
        targetAmount: initialData.targetAmount,
        targetAge: initialData.targetAge,
        portfolio: initialData.portfolio
      })
    } else {
      setFormData({
        name: '',
        currentAge: 28,
        currentSalary: 35000000,
        monthlyExpenses: 2000000,
        monthlySavings: 1000000,
        investmentReturn: 7.0,
        targetAmount: 100000000,
        targetAge: 35,
        portfolio: {
          etf: 70,
          stocks: 15,
          realEstate: 5,
          cash: 10
        }
      })
    }
  }, [initialData, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 검증
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = '계산기 이름을 입력해주세요'
    }
    if (formData.currentAge <= 0) {
      newErrors.currentAge = '현재 나이를 입력해주세요'
    }
    if (formData.currentSalary <= 0) {
      newErrors.currentSalary = '현재 연봉을 입력해주세요'
    }
    if (formData.monthlyExpenses < 0) {
      newErrors.monthlyExpenses = '월 지출을 입력해주세요'
    }
    if (formData.monthlySavings < 0) {
      newErrors.monthlySavings = '월 저축을 입력해주세요'
    }
    if (formData.investmentReturn <= 0) {
      newErrors.investmentReturn = '투자 수익률을 입력해주세요'
    }
    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = '목표 금액을 입력해주세요'
    }
    if (formData.targetAge <= formData.currentAge) {
      newErrors.targetAge = '목표 나이는 현재 나이보다 커야 합니다'
    }

    // 포트폴리오 합계 검증
    const portfolioSum = Object.values(formData.portfolio).reduce((sum, val) => sum + val, 0)
    if (Math.abs(portfolioSum - 100) > 0.1) {
      newErrors.portfolio = '포트폴리오 비율의 합계가 100%가 되어야 합니다'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const userId = getCurrentUserId()
      let response
      if (mode === 'create') {
        const { id, ...newData } = formData
        response = await addCalculatorData(newData, userId)
      } else {
        response = await updateCalculatorData(formData, userId)
      }

      if (response.success && response.data) {
        onSave(formData)
        onClose()
        alert(mode === 'create' ? '새 계산기가 추가되었습니다.' : '계산기가 수정되었습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CalculatorFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePortfolioChange = (field: keyof typeof formData.portfolio, value: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [field]: value
      }
    }))

    // 포트폴리오 에러 메시지 제거
    if (errors.portfolio) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.portfolio
        return newErrors
      })
    }
  }

  const portfolioSum = Object.values(formData.portfolio).reduce((sum, val) => sum + val, 0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '새 계산기 추가' : '계산기 수정'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">계산기 이름 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="예: 1억 달성 계획"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">현재 나이 *</Label>
                <NumberInput
                  id="currentAge"
                  value={formData.currentAge}
                  onChange={(value) => handleInputChange('currentAge', value)}
                  placeholder="28"
                />
                {errors.currentAge && (
                  <p className="text-sm text-red-600 mt-1">{errors.currentAge}</p>
                )}
              </div>
              <div>
                <Label htmlFor="currentSalary">현재 연봉 *</Label>
                <NumberInput
                  id="currentSalary"
                  value={formData.currentSalary}
                  onChange={(value) => handleInputChange('currentSalary', value)}
                  placeholder="35000000"
                />
                {errors.currentSalary && (
                  <p className="text-sm text-red-600 mt-1">{errors.currentSalary}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyExpenses">월 지출 *</Label>
                <NumberInput
                  id="monthlyExpenses"
                  value={formData.monthlyExpenses}
                  onChange={(value) => handleInputChange('monthlyExpenses', value)}
                  placeholder="2000000"
                />
                {errors.monthlyExpenses && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthlyExpenses}</p>
                )}
              </div>
              <div>
                <Label htmlFor="monthlySavings">월 저축 *</Label>
                <NumberInput
                  id="monthlySavings"
                  value={formData.monthlySavings}
                  onChange={(value) => handleInputChange('monthlySavings', value)}
                  placeholder="1000000"
                />
                {errors.monthlySavings && (
                  <p className="text-sm text-red-600 mt-1">{errors.monthlySavings}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="investmentReturn">투자 수익률 (%) *</Label>
                <NumberInput
                  id="investmentReturn"
                  value={formData.investmentReturn}
                  onChange={(value) => handleInputChange('investmentReturn', value)}
                  placeholder="7.0"
                />
                {errors.investmentReturn && (
                  <p className="text-sm text-red-600 mt-1">{errors.investmentReturn}</p>
                )}
              </div>
              <div>
                <Label htmlFor="targetAmount">목표 금액 *</Label>
                <NumberInput
                  id="targetAmount"
                  value={formData.targetAmount}
                  onChange={(value) => handleInputChange('targetAmount', value)}
                  placeholder="100000000"
                />
                {errors.targetAmount && (
                  <p className="text-sm text-red-600 mt-1">{errors.targetAmount}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="targetAge">목표 나이 *</Label>
              <NumberInput
                id="targetAge"
                value={formData.targetAge}
                onChange={(value) => handleInputChange('targetAge', value)}
                placeholder="35"
              />
              {errors.targetAge && (
                <p className="text-sm text-red-600 mt-1">{errors.targetAge}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 포트폴리오 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>포트폴리오 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="etf">ETF (%)</Label>
                <NumberInput
                  id="etf"
                  value={formData.portfolio.etf}
                  onChange={(value) => handlePortfolioChange('etf', value)}
                  placeholder="70"
                />
              </div>
              <div>
                <Label htmlFor="stocks">주식 (%)</Label>
                <NumberInput
                  id="stocks"
                  value={formData.portfolio.stocks}
                  onChange={(value) => handlePortfolioChange('stocks', value)}
                  placeholder="15"
                />
              </div>
              <div>
                <Label htmlFor="realEstate">부동산 (%)</Label>
                <NumberInput
                  id="realEstate"
                  value={formData.portfolio.realEstate}
                  onChange={(value) => handlePortfolioChange('realEstate', value)}
                  placeholder="5"
                />
              </div>
              <div>
                <Label htmlFor="cash">현금 (%)</Label>
                <NumberInput
                  id="cash"
                  value={formData.portfolio.cash}
                  onChange={(value) => handlePortfolioChange('cash', value)}
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">포트폴리오 합계</span>
                <span className={`text-sm font-bold ${Math.abs(portfolioSum - 100) > 0.1 ? 'text-red-600' : 'text-green-600'}`}>
                  {portfolioSum.toFixed(1)}%
                </span>
              </div>
              {Math.abs(portfolioSum - 100) > 0.1 && (
                <p className="text-xs text-red-600 mt-1">포트폴리오 비율의 합계가 100%가 되어야 합니다</p>
              )}
            </div>
            
            {errors.portfolio && (
              <p className="text-sm text-red-600">{errors.portfolio}</p>
            )}
          </CardContent>
        </Card>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            취소
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '저장 중...' : (mode === 'create' ? '추가' : '수정')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
