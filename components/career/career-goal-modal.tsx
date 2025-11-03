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
import { Textarea } from '../ui/textarea'
import { CareerGoal, CareerGoalFormData } from '@/types/career'
import { TechStackSelector } from './tech-stack-selector'
import { createCareerGoal, updateCareerGoal } from '@/lib/api/career-goals'
import { getCurrentUserId } from '@/lib/auth'

interface CareerGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CareerGoalFormData) => void
  initialData?: CareerGoal
  mode: 'create' | 'edit'
}

export function CareerGoalModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}: CareerGoalModalProps) {
  const [formData, setFormData] = useState<CareerGoalFormData>({
    year: new Date().getFullYear(),
    targetSalary: 0,
    currentSalary: 0,
    sideIncomeTarget: 0,
    techStack: [],
    portfolioCount: 0,
    networkingGoals: '',
    learningGoals: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        year: initialData.year,
        targetSalary: initialData.targetSalary,
        currentSalary: initialData.currentSalary,
        sideIncomeTarget: initialData.sideIncomeTarget,
        techStack: initialData.techStack,
        portfolioCount: initialData.portfolioCount,
        networkingGoals: initialData.networkingGoals,
        learningGoals: initialData.learningGoals
      })
    }
  }, [initialData, mode])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.year || formData.year < new Date().getFullYear()) {
      newErrors.year = '올바른 연도를 입력해주세요'
    }

    if (!formData.targetSalary || formData.targetSalary <= 0) {
      newErrors.targetSalary = '목표 연봉을 입력해주세요'
    }

    if (!formData.currentSalary || formData.currentSalary < 0) {
      newErrors.currentSalary = '현재 연봉을 입력해주세요'
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = '기술 스택을 선택해주세요'
    }

    if (!formData.networkingGoals.trim()) {
      newErrors.networkingGoals = '네트워킹 목표를 입력해주세요'
    }

    if (!formData.learningGoals.trim()) {
      newErrors.learningGoals = '학습 목표를 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const userId = getCurrentUserId()
      let response
      
      if (mode === 'create') {
        response = await createCareerGoal(formData, userId)
      } else if (mode === 'edit' && initialData) {
        response = await updateCareerGoal({ ...formData, id: initialData.id }, userId)
      }
      
      if (response?.data) {
        onSave(formData)
        onClose()
        // 성공 메시지 표시 (선택사항)
        alert(response.message || '커리어 목표가 성공적으로 저장되었습니다.')
      }
    } catch (error) {
      console.error('커리어 목표 저장 실패:', error)
      alert(error instanceof Error ? error.message : '커리어 목표 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof CareerGoalFormData, value: string | number | string[]) => {
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



  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '커리어 목표 등록' : '커리어 목표 수정'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 연도 선택 */}
        <div>
          <Label htmlFor="year">목표 연도</Label>
          <Select
            value={formData.year.toString()}
            onValueChange={(value) => handleInputChange('year', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="연도를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}년
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.year && (
            <p className="text-sm text-red-600 mt-1">{errors.year}</p>
          )}
        </div>

        {/* 연봉 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
             <Label htmlFor="currentSalary">현재 연봉 (원)</Label>
             <NumberInput
               id="currentSalary"
               value={formData.currentSalary}
               onChange={(value) => handleInputChange('currentSalary', value)}
             />
             {errors.currentSalary && (
               <p className="text-sm text-red-600 mt-1">{errors.currentSalary}</p>
             )}
           </div>
          
            <div>
             <Label htmlFor="targetSalary">목표 연봉 (원)</Label>
             <NumberInput
               id="targetSalary"
               value={formData.targetSalary}
               onChange={(value) => handleInputChange('targetSalary', value)}
             />
             {errors.targetSalary && (
               <p className="text-sm text-red-600 mt-1">{errors.targetSalary}</p>
             )}
           </div>
          
             <div>
             <Label htmlFor="sideIncomeTarget">부업 수입 목표 (원)</Label>
             <NumberInput
               id="sideIncomeTarget"
               value={formData.sideIncomeTarget}
               onChange={(value) => handleInputChange('sideIncomeTarget', value)}
             />
           </div>
        </div>

        {/* 기술 스택 */}
        <div>
          <TechStackSelector
            selectedTechs={formData.techStack}
            onTechsChange={(techs) => handleInputChange('techStack', techs)}
          />
          {errors.techStack && (
            <p className="text-sm text-red-600 mt-1">{errors.techStack}</p>
          )}
        </div>

       {/* 포트폴리오 목표 */}
       <div>
          <Label htmlFor="portfolioCount">포트폴리오 목표 개수</Label>
          <Input
            id="portfolioCount"
            type="number"
            value={formData.portfolioCount || ''}
            onChange={(e) => handleInputChange('portfolioCount', parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        {/* 네트워킹 목표 */}
        <div>
          <Label htmlFor="networkingGoals">네트워킹 목표</Label>
          <Textarea
            id="networkingGoals"
            value={formData.networkingGoals}
            onChange={(e) => handleInputChange('networkingGoals', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            쉼표로 구분하여 여러 목표를 입력하세요. 각 목표는 별도의 항목으로 표시됩니다.
          </p>
          {errors.networkingGoals && (
            <p className="text-sm text-red-600 mt-1">{errors.networkingGoals}</p>
          )}
        </div>

        {/* 학습 목표 */}
        <div>
          <Label htmlFor="learningGoals">학습 목표</Label>
          <Textarea
            id="learningGoals"
            value={formData.learningGoals}
            onChange={(e) => handleInputChange('learningGoals', e.target.value)}
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            쉼표로 구분하여 여러 목표를 입력하세요. 각 목표는 별도의 항목으로 표시됩니다.
          </p>
          {errors.learningGoals && (
            <p className="text-sm text-red-600 mt-1">{errors.learningGoals}</p>
          )}
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