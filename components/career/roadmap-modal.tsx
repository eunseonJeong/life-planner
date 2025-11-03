'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Target, 
  Calendar,
  X
} from 'lucide-react'
import { RoadmapItem } from '@/types/career'
import { saveRoadmap } from '@/lib/api/roadmap'
import { getCurrentUserId } from '@/lib/auth'

interface RoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (roadmap: RoadmapItem[]) => void
  initialRoadmap: RoadmapItem[]
}

export function RoadmapModal({
  isOpen,
  onClose,
  onSave,
  initialRoadmap
}: RoadmapModalProps) {
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(initialRoadmap)
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    setRoadmap(initialRoadmap)
  }, [initialRoadmap])

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)
  const quarterOptions = [1, 2, 3, 4]
  const statusOptions = [
    { value: 'planned', label: '계획', icon: Calendar },
    { value: 'in-progress', label: '진행중', icon: Target },
    { value: 'completed', label: '완료', icon: CheckCircle }
  ]

  const getStatusIcon = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status)
    if (statusOption) {
      const IconComponent = statusOption.icon
      return <IconComponent className="h-4 w-4" />
    }
    return <Calendar className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'planned':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddItem = () => {
    const newItem: RoadmapItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      year: currentYear,
      quarter: 1,
      status: 'planned',
      skills: []
    }
    setEditingItem(newItem)
    setIsAdding(true)
  }

  const handleEditItem = (item: RoadmapItem) => {
    setEditingItem(item)
    setIsAdding(false)
  }

  const handleDeleteItem = (id: string) => {
    setRoadmap(prev => prev.filter(item => item.id !== id))
  }

  const handleSaveItem = () => {
    if (!editingItem || !editingItem.title.trim()) return

    if (isAdding) {
      setRoadmap(prev => [...prev, editingItem])
    } else {
      setRoadmap(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ))
    }
    setEditingItem(null)
    setIsAdding(false)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setIsAdding(false)
  }

  const handleSaveRoadmap = async () => {
    try {
      const userId = getCurrentUserId()
      const response = await saveRoadmap(roadmap, userId)
      if (response.data) {
        onSave(response.data)
        onClose()
        alert(response.message || '로드맵이 성공적으로 저장되었습니다.')
      }
    } catch (error) {
      console.error('로드맵 저장 실패:', error)
      alert(error instanceof Error ? error.message : '로드맵 저장에 실패했습니다.')
    }
  }

  const handleSkillChange = (skills: string) => {
    if (!editingItem) return
    const skillArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    setEditingItem(prev => prev ? { ...prev, skills: skillArray } : null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="성장 로드맵 관리"
      size="xl"
    >
      <div className="space-y-6">
        {/* 로드맵 목록 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">로드맵 단계</h3>
            <Button onClick={handleAddItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              단계 추가
            </Button>
          </div>

          <div className="space-y-3">
            {roadmap.map((item, index) => (
              <div key={item.id} className="relative border rounded-lg p-4">
                {index < roadmap.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {statusOptions.find(opt => opt.value === item.status)?.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {item.year}년 {item.quarter}분기
                      </span>
                      <div className="flex space-x-2">
                      {Array.isArray(item?.skills) && item.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 편집 폼 */}
        {editingItem && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {isAdding ? '새 단계 추가' : '단계 수정'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem(prev => 
                    prev ? { ...prev, title: e.target.value } : null
                  )}
                  placeholder="예: React 마스터하기"
                />
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="예: React의 핵심 개념들을 완전히 이해하고 실무에 적용할 수 있도록 학습"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">연도</Label>
                  <Select
                    value={editingItem.year.toString()}
                    onValueChange={(value) => setEditingItem(prev => 
                      prev ? { ...prev, year: parseInt(value) } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
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

                <div>
                  <Label htmlFor="quarter">분기</Label>
                  <Select
                    value={editingItem.quarter.toString()}
                    onValueChange={(value) => setEditingItem(prev => 
                      prev ? { ...prev, quarter: parseInt(value) } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {quarterOptions.map(quarter => (
                        <SelectItem key={quarter} value={quarter.toString()}>
                          {quarter}분기
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">상태</Label>
                  <Select
                    value={editingItem.status}
                    onValueChange={(value) => setEditingItem(prev => 
                      prev ? { ...prev, status: value as 'planned' | 'in-progress' | 'completed' } : null
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(option.value)}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="skills">필요 기술 (쉼표로 구분)</Label>
                <Input
                  id="skills"
                  value={editingItem.skills.join(', ')}
                  onChange={(e) => handleSkillChange(e.target.value)}
                  placeholder="예: React, TypeScript, Next.js"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCancelEdit}>
                  취소
                </Button>
                <Button onClick={handleSaveItem}>
                  저장
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSaveRoadmap}>
            로드맵 저장
          </Button>
        </div>
      </div>
    </Modal>
  )
}
