'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NumberInput } from '@/components/ui/number-input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X
} from 'lucide-react'
import { LifeStage, LifeStageFormData } from '@/types/finance'
import { 
  getLifeStages, 
  saveLifeStages, 
  addLifeStage, 
  updateLifeStage, 
  deleteLifeStage 
} from '@/lib/api/life-stages'
import { getCurrentUserId } from '@/lib/auth'

interface LifeStageModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LifeStageModal({
  isOpen,
  onClose
}: LifeStageModalProps) {
  const [lifeStages, setLifeStages] = useState<LifeStage[]>([])
  const [editingStage, setEditingStage] = useState<LifeStageFormData | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 초기 데이터 로드
  useEffect(() => {
    if (isOpen) {
      loadLifeStages()
    }
  }, [isOpen])

  const loadLifeStages = async () => {
    try {
      const userId = getCurrentUserId()
      const response = await getLifeStages(userId)
      if (response.success && response.data) {
        setLifeStages(response.data)
      }
    } catch (error) {
      console.error('생애주기별 자금 계획 로드 실패:', error)
    }
  }

  const handleAddNew = () => {
    setEditingStage({
      id: '',
      stage: '',
      age: 25,
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      priority: 'medium'
    })
    setIsAdding(true)
  }

  const handleEdit = (stage: LifeStage) => {
    setEditingStage(stage)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) {
      return
    }

    setIsLoading(true)
    try {
      const userId = getCurrentUserId()
      const response = await deleteLifeStage(id, userId)
      if (response.success && response.data) {
        setLifeStages(response.data)
        alert('항목이 성공적으로 삭제되었습니다.')
      }
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!editingStage) return

    // 검증
    const newErrors: Record<string, string> = {}
    if (!editingStage.stage.trim()) {
      newErrors.stage = '단계명을 입력해주세요'
    }
    if (editingStage.age < 0 || editingStage.age > 100) {
      newErrors.age = '올바른 나이를 입력해주세요'
    }
    if (!editingStage.description.trim()) {
      newErrors.description = '설명을 입력해주세요'
    }
    if (editingStage.targetAmount <= 0) {
      newErrors.targetAmount = '목표 금액을 입력해주세요'
    }
    if (editingStage.currentAmount < 0) {
      newErrors.currentAmount = '현재 금액을 입력해주세요'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    try {
      const userId = getCurrentUserId()
      let response
      if (isAdding) {
        const { id, ...newStageData } = editingStage
        response = await addLifeStage(newStageData, userId)
      } else {
        response = await updateLifeStage(editingStage, userId)
      }

      if (response.success && response.data) {
        setLifeStages(response.data)
        setEditingStage(null)
        setIsAdding(false)
        setErrors({})
        alert(isAdding ? '새 항목이 추가되었습니다.' : '항목이 수정되었습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingStage(null)
    setIsAdding(false)
    setErrors({})
  }

  const handleInputChange = (field: keyof LifeStageFormData, value: string | number) => {
    if (!editingStage) return

    setEditingStage(prev => ({
      ...prev!,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return '높음'
      case 'medium':
        return '보통'
      case 'low':
        return '낮음'
      default:
        return priority
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="생애주기별 자금 계획 관리"
      size="xl"
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* 헤더 */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">생애주기별 자금 계획</h2>
          <Button onClick={handleAddNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            새 항목 추가
          </Button>
        </div>

        {/* 편집 폼 */}
        {editingStage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {isAdding ? '새 항목 추가' : '항목 수정'}
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stage">단계명 *</Label>
                  <Input
                    id="stage"
                    value={editingStage.stage}
                    onChange={(e) => handleInputChange('stage', e.target.value)}
                    placeholder="예: 자취, 결혼, 육아"
                  />
                  {errors.stage && (
                    <p className="text-sm text-red-600 mt-1">{errors.stage}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">나이 *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="100"
                    value={editingStage.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                    placeholder="25"
                  />
                  {errors.age && (
                    <p className="text-sm text-red-600 mt-1">{errors.age}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">설명 *</Label>
                <Textarea
                  id="description"
                  value={editingStage.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="이 단계에서의 목표나 계획을 설명하세요"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetAmount">목표 금액 (원) *</Label>
                  <NumberInput
                    id="targetAmount"
                    value={editingStage.targetAmount}
                    onChange={(value) => handleInputChange('targetAmount', value)}
                    placeholder="목표 금액"
                  />
                  {errors.targetAmount && (
                    <p className="text-sm text-red-600 mt-1">{errors.targetAmount}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="currentAmount">현재 금액 (원) *</Label>
                  <NumberInput
                    id="currentAmount"
                    value={editingStage.currentAmount}
                    onChange={(value) => handleInputChange('currentAmount', value)}
                    placeholder="현재 금액"
                  />
                  {errors.currentAmount && (
                    <p className="text-sm text-red-600 mt-1">{errors.currentAmount}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  value={editingStage.priority}
                  onValueChange={(value) => handleInputChange('priority', value as 'high' | 'medium' | 'low')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="우선순위를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? '저장 중...' : (isAdding ? '추가' : '수정')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 생애주기 목록 */}
        <div className="space-y-4">
          {lifeStages.map((stage) => {
            const progress = (stage.currentAmount / stage.targetAmount) * 100
            return (
              <Card key={stage.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium">{stage.stage} ({stage.age}세)</h3>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                      <Badge className={getPriorityColor(stage.priority)}>
                        {getPriorityText(stage.priority)}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(stage)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(stage.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>목표: {formatCurrency(stage.targetAmount)}</span>
                      <span>현재: {formatCurrency(stage.currentAmount)}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-right text-sm text-gray-600">
                      {Math.round(progress)}% 달성
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 전체 진행률 */}
        {lifeStages.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">전체 진행률</span>
                <span className="text-lg font-bold">
                  {Math.round(
                    (lifeStages.reduce((sum, stage) => sum + stage.currentAmount, 0) /
                      lifeStages.reduce((sum, stage) => sum + stage.targetAmount, 0)) * 100
                  )}%
                </span>
              </div>
              <Progress 
                value={
                  (lifeStages.reduce((sum, stage) => sum + stage.currentAmount, 0) /
                    lifeStages.reduce((sum, stage) => sum + stage.targetAmount, 0)) * 100
                } 
                className="h-2" 
              />
            </CardContent>
          </Card>
        )}

        {/* 닫기 버튼 */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </Modal>
  )
}
