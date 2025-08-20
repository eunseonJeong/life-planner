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
import { FinancialData, FinancialFormData } from '@/types/finance'
import { saveFinancialData } from '@/lib/api/finance'
import { getCurrentUserId } from '@/lib/auth'

interface FinanceModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FinancialFormData) => void
  initialData?: FinancialData
  mode: 'create' | 'edit'
}

export function FinanceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}: FinanceModalProps) {
  const [formData, setFormData] = useState<FinancialFormData>({
    year: new Date().getFullYear(),
    totalAssets: 0,
    monthlyIncome: 0,
    monthlyExpenses: {
      fixed: 0,
      living: 0,
      other: 0
    },
    monthlySavings: {
      etf: 0,
      cma: 0,
      isa: 0,
      pension: 0,
      stock: 0,
      crypto: 0,
      housing: 0,
      youth: 0
    },
    investmentReturn: 5.0,
    emergencyFund: 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        year: initialData.year || new Date().getFullYear(),
        totalAssets: initialData.totalAssets || 0,
        monthlyIncome: initialData.monthlyIncome || 0,
        monthlyExpenses: {
          fixed: initialData.monthlyExpenses?.fixed || 0,
          living: initialData.monthlyExpenses?.living || 0,
          other: initialData.monthlyExpenses?.other || 0
        },
        monthlySavings: {
          etf: initialData.monthlySavings?.etf || 0,
          cma: initialData.monthlySavings?.cma || 0,
          isa: initialData.monthlySavings?.isa || 0,
          pension: initialData.monthlySavings?.pension || 0,
          stock: initialData.monthlySavings?.stock || 0,
          crypto: initialData.monthlySavings?.crypto || 0,
          housing: initialData.monthlySavings?.housing || 0,
          youth: initialData.monthlySavings?.youth || 0
        },
        investmentReturn: initialData.investmentReturn || 5.0,
        emergencyFund: initialData.emergencyFund || 0
      })
    }
  }, [initialData, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 모든 필드가 선택값이므로 검증 로직 제거
    setErrors(newErrors)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const userId = getCurrentUserId()
      const response = await saveFinancialData(formData, userId)
      
      if (response.success) {
        onSave(formData)
        onClose()
        alert(response.message || '자산 정보가 성공적으로 저장되었습니다.')
      } else {
        throw new Error(response.error || '자산 정보 저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('자산 정보 저장 실패:', error)
      alert(error instanceof Error ? error.message : '자산 정보 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FinancialFormData, value: string | number) => {
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

  const handleExpensesChange = (subField: 'fixed' | 'living' | 'other', value: number) => {
    setFormData(prev => ({
      ...prev,
      monthlyExpenses: {
        ...prev.monthlyExpenses,
        [subField]: value
      }
    }))
  }

  const handleSavingsChange = (subField: 'etf' | 'cma' | 'isa' | 'pension' | 'stock' | 'crypto' | 'housing' | 'youth', value: number) => {
    setFormData(prev => ({
      ...prev,
      monthlySavings: {
        ...prev.monthlySavings,
        [subField]: value
      }
    }))
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '자산 정보 등록' : '자산 정보 수정'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* 연도 선택 */}
        <div>
          <Label htmlFor="year">기준 연도 (선택)</Label>
          <Select
            value={formData.year?.toString() || ''}
            onValueChange={(value) => handleInputChange('year', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="연도를 선택하세요 (선택사항)" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 총 자산 */}
        <div>
          <Label htmlFor="totalAssets">총 자산 (원) (선택)</Label>
          <NumberInput
            id="totalAssets"
            value={formData.totalAssets || 0}
            onChange={(value) => handleInputChange('totalAssets', value)}
            placeholder="총 자산을 입력하세요"
          />
        </div>

        {/* 월 수입 */}
        <div>
          <Label htmlFor="monthlyIncome">월 수입 (원) (선택)</Label>
          <NumberInput
            id="monthlyIncome"
            value={formData.monthlyIncome || 0}
            onChange={(value) => handleInputChange('monthlyIncome', value)}
            placeholder="월 수입을 입력하세요"
          />
        </div>

        {/* 월 지출 */}
        <div>
          <Label>월 지출 (원) (선택)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fixedExpenses" className="text-sm">고정비</Label>
              <NumberInput
                id="fixedExpenses"
                value={formData.monthlyExpenses?.fixed || 0}
                onChange={(value) => handleExpensesChange('fixed', value)}
                placeholder="고정비"
              />
            </div>
            <div>
              <Label htmlFor="livingExpenses" className="text-sm">생활비</Label>
              <NumberInput
                id="livingExpenses"
                value={formData.monthlyExpenses?.living || 0}
                onChange={(value) => handleExpensesChange('living', value)}
                placeholder="생활비"
              />
            </div>
            <div>
              <Label htmlFor="otherExpenses" className="text-sm">기타</Label>
              <NumberInput
                id="otherExpenses"
                value={formData.monthlyExpenses?.other || 0}
                onChange={(value) => handleExpensesChange('other', value)}
                placeholder="기타 지출"
              />
            </div>
          </div>
        </div>

        {/* 월 저축액 */}
        <div>
          <Label>월 저축액 (원) (선택)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="etf" className="text-sm">ETF</Label>
              <NumberInput
                id="etf"
                value={formData.monthlySavings?.etf || 0}
                onChange={(value) => handleSavingsChange('etf', value)}
                placeholder="ETF"
              />
            </div>
            <div>
              <Label htmlFor="cma" className="text-sm">CMA</Label>
              <NumberInput
                id="cma"
                value={formData.monthlySavings?.cma || 0}
                onChange={(value) => handleSavingsChange('cma', value)}
                placeholder="CMA"
              />
            </div>
            <div>
              <Label htmlFor="isa" className="text-sm">ISA</Label>
              <NumberInput
                id="isa"
                value={formData.monthlySavings?.isa || 0}
                onChange={(value) => handleSavingsChange('isa', value)}
                placeholder="ISA"
              />
            </div>
            <div>
              <Label htmlFor="pension" className="text-sm">연금저축</Label>
              <NumberInput
                id="pension"
                value={formData.monthlySavings?.pension || 0}
                onChange={(value) => handleSavingsChange('pension', value)}
                placeholder="연금저축"
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm">주식</Label>
              <NumberInput
                id="stock"
                value={formData.monthlySavings?.stock || 0}
                onChange={(value) => handleSavingsChange('stock', value)}
                placeholder="주식"
              />
            </div>
            <div>
              <Label htmlFor="crypto" className="text-sm">코인</Label>
              <NumberInput
                id="crypto"
                value={formData.monthlySavings?.crypto || 0}
                onChange={(value) => handleSavingsChange('crypto', value)}
                placeholder="코인"
              />
            </div>
            <div>
              <Label htmlFor="housing" className="text-sm">주택청약</Label>
              <NumberInput
                id="housing"
                value={formData.monthlySavings?.housing || 0}
                onChange={(value) => handleSavingsChange('housing', value)}
                placeholder="주택청약"
              />
            </div>
            <div>
              <Label htmlFor="youth" className="text-sm">청년도약계좌</Label>
              <NumberInput
                id="youth"
                value={formData.monthlySavings?.youth || 0}
                onChange={(value) => handleSavingsChange('youth', value)}
                placeholder="청년도약계좌"
              />
            </div>
          </div>
        </div>

        {/* 투자 수익률 */}
        <div>
          <Label htmlFor="investmentReturn">투자 수익률 (%) (선택)</Label>
          <Input
            id="investmentReturn"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.investmentReturn || ''}
            onChange={(e) => handleInputChange('investmentReturn', parseFloat(e.target.value) || 0)}
            placeholder="연간 예상 투자 수익률"
          />
        </div>

        {/* 비상금 */}
        <div>
          <Label htmlFor="emergencyFund">비상금 (원) (선택)</Label>
          <NumberInput
            id="emergencyFund"
            value={formData.emergencyFund || 0}
            onChange={(value) => handleInputChange('emergencyFund', value)}
            placeholder="비상금을 입력하세요"
          />
        </div>

        {/* 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : (mode === 'create' ? '등록' : '수정')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
