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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X
} from 'lucide-react'
import { Goal, GoalFormData, Milestone, MilestoneFormData } from '@/types/goals'
import { addGoal, updateGoal, deleteGoal } from '@/lib/api/goals'
import { getCurrentUserId } from '@/lib/auth'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: GoalFormData) => void
  initialData?: Goal
  mode: 'create' | 'edit'
}

export function GoalModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}: GoalModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    category: '커리어',
    targetDate: '',
    targetValue: 0,
    currentValue: 0,
    unit: '원',
    priority: 'medium',
    status: 'active',
    milestones: []
  })

  const [editingMilestone, setEditingMilestone] = useState<MilestoneFormData | null>(null)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        id: initialData.id,
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        targetDate: initialData.targetDate,
        targetValue: initialData.targetValue,
        currentValue: initialData.currentValue,
        unit: initialData.unit,
        priority: initialData.priority,
        status: initialData.status,
        milestones: initialData.milestones
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: '커리어',
        targetDate: '',
        targetValue: 0,
        currentValue: 0,
        unit: '원',
        priority: 'medium',
        status: 'active',
        milestones: []
      })
    }
  }, [initialData, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 검증
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = '목표 제목을 입력해주세요'
    }
    if (!formData.description.trim()) {
      newErrors.description = '목표 설명을 입력해주세요'
    }
    if (!formData.targetDate) {
      newErrors.targetDate = '목표 날짜를 선택해주세요'
    }
    if (formData.targetValue <= 0) {
      newErrors.targetValue = '목표값을 입력해주세요'
    }
    if (formData.currentValue < 0) {
      newErrors.currentValue = '현재값을 입력해주세요'
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
        const { id, ...newGoalData } = formData
        response = await addGoal(newGoalData, userId)
      } else {
        response = await updateGoal(formData, userId)
      }

      if (response.success && response.data) {
        onSave(formData)
        onClose()
        alert(mode === 'create' ? '새 목표가 추가되었습니다.' : '목표가 수정되었습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof GoalFormData, value: string | number) => {
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

  const handleAddMilestone = () => {
    setEditingMilestone({
      title: '',
      targetValue: 0,
      currentValue: 0,
      dueDate: '',
      status: 'planned'
    })
    setIsAddingMilestone(true)
  }

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setIsAddingMilestone(false)
  }

  const handleDeleteMilestone = (id: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }))
  }

  const handleSaveMilestone = () => {
    if (!editingMilestone) return

    // 검증
    if (!editingMilestone.title.trim()) {
      alert('마일스톤 제목을 입력해주세요')
      return
    }
    if (!editingMilestone.dueDate) {
      alert('마일스톤 날짜를 선택해주세요')
      return
    }

    if (isAddingMilestone) {
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        ...editingMilestone
      }
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === editingMilestone.id ? editingMilestone as Milestone : m
        )
      }))
    }

    setEditingMilestone(null)
    setIsAddingMilestone(false)
  }

  const handleCancelMilestone = () => {
    setEditingMilestone(null)
    setIsAddingMilestone(false)
  }

  const handleMilestoneInputChange = (field: keyof MilestoneFormData, value: string | number) => {
    if (!editingMilestone) return

    setEditingMilestone(prev => ({
      ...prev!,
      [field]: value
    }))
  }

  const categories = ['커리어', '재무', '관계', '부동산', '여행']
  const units = ['원', '회', '단계', '개', '권', '시간']
  const priorities = ['high', 'medium', 'low']
  const statuses = ['active', 'completed', 'paused']

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '새 목표 추가' : '목표 수정'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* 기본 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">목표 제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="목표 제목을 입력하세요"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">목표 설명 *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="목표에 대한 상세한 설명을 입력하세요"
            rows={3}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="targetDate">목표 날짜 *</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleInputChange('targetDate', e.target.value)}
            />
            {errors.targetDate && (
              <p className="text-sm text-red-600 mt-1">{errors.targetDate}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="priority">우선순위</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange('priority', value as 'high' | 'medium' | 'low')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>
                    {priority === 'high' ? '높음' : 
                     priority === 'medium' ? '보통' : '낮음'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">상태</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value as 'active' | 'completed' | 'paused')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'active' ? '진행중' : 
                     status === 'completed' ? '완료' : '일시정지'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="targetValue">목표값 *</Label>
            <NumberInput
              id="targetValue"
              value={formData.targetValue}
              onChange={(value) => handleInputChange('targetValue', value)}
              placeholder="목표값"
            />
            {errors.targetValue && (
              <p className="text-sm text-red-600 mt-1">{errors.targetValue}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="currentValue">현재값</Label>
            <NumberInput
              id="currentValue"
              value={formData.currentValue}
              onChange={(value) => handleInputChange('currentValue', value)}
              placeholder="현재값"
            />
            {errors.currentValue && (
              <p className="text-sm text-red-600 mt-1">{errors.currentValue}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="unit">단위</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => handleInputChange('unit', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map(unit => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 마일스톤 관리 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>마일스톤</span>
              <Button type="button" onClick={handleAddMilestone} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                마일스톤 추가
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-sm text-gray-600">
                      {milestone.targetValue}{formData.unit} / {milestone.dueDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMilestone(milestone)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 마일스톤 편집 폼 */}
        {editingMilestone && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {isAddingMilestone ? '마일스톤 추가' : '마일스톤 수정'}
                <Button type="button" variant="ghost" size="sm" onClick={handleCancelMilestone}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="milestoneTitle">마일스톤 제목</Label>
                  <Input
                    id="milestoneTitle"
                    value={editingMilestone.title}
                    onChange={(e) => handleMilestoneInputChange('title', e.target.value)}
                    placeholder="마일스톤 제목"
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneDueDate">마일스톤 날짜</Label>
                  <Input
                    id="milestoneDueDate"
                    type="date"
                    value={editingMilestone.dueDate}
                    onChange={(e) => handleMilestoneInputChange('dueDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneTargetValue">목표값</Label>
                  <NumberInput
                    id="milestoneTargetValue"
                    value={editingMilestone.targetValue}
                    onChange={(value) => handleMilestoneInputChange('targetValue', value)}
                    placeholder="목표값"
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneCurrentValue">현재값</Label>
                  <NumberInput
                    id="milestoneCurrentValue"
                    value={editingMilestone.currentValue}
                    onChange={(value) => handleMilestoneInputChange('currentValue', value)}
                    placeholder="현재값"
                  />
                </div>
                <div>
                  <Label htmlFor="milestoneStatus">상태</Label>
                  <Select
                    value={editingMilestone.status}
                    onValueChange={(value) => handleMilestoneInputChange('status', value as 'completed' | 'in-progress' | 'planned')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">계획됨</SelectItem>
                      <SelectItem value="in-progress">진행중</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={handleCancelMilestone}>
                  취소
                </Button>
                <Button type="button" onClick={handleSaveMilestone}>
                  저장
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
