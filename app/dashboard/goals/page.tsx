'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  Award,
  Users,
  Home,
  DollarSign,
  Plane
} from 'lucide-react'
import { GoalModal } from '@/components/goals/goal-modal'
import { Goal, GoalFormData, Milestone } from '@/types/goals'
import { getGoals, deleteGoal } from '@/lib/api/goals'
import { getCurrentUserId } from '@/lib/auth'
import { calculateGoalProgress, calculateGoalsProgress } from '@/lib/utils/progress'

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [selectedPriority, setSelectedPriority] = useState('전체')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)

  const categories = ['전체', '커리어', '재무', '관계', '부동산', '여행']
  const priorities = ['전체', 'high', 'medium', 'low']

  // 초기 데이터 로드
  useEffect(() => {
    const loadGoals = async () => {
      setIsLoading(true)
      try {
        const userId = getCurrentUserId()
        const response = await getGoals(userId)
        if (response.success && response.data) {
          setGoals(response.data)
        }
      } catch (error) {
        console.error('목표 목록 로드 실패:', error)
        // 에러가 발생해도 빈 배열로 초기화
        setGoals([])
      } finally {
        setIsLoading(false)
      }
    }

    loadGoals()
  }, [])

  const handleOpenModal = (mode: 'create' | 'edit', goal?: Goal) => {
    setModalMode(mode)
    setSelectedGoal(goal)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedGoal(undefined)
  }

  const handleSaveGoal = async (data: GoalFormData) => {
    try {
      // 목표 저장 후 목록을 다시 로드
      const userId = getCurrentUserId()
      const response = await getGoals(userId)
      if (response.success && response.data) {
        setGoals(response.data)
      }
    } catch (error) {
      console.error('목표 저장 실패:', error)
    }
  }

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('정말로 이 목표를 삭제하시겠습니까?')) return

    try {
      const userId = getCurrentUserId()
      const response = await deleteGoal(id, userId)
      if (response.success && response.data) {
        setGoals(response.data)
        alert('목표가 삭제되었습니다.')
      }
    } catch (error) {
      console.error('목표 삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'paused':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '커리어':
        return <TrendingUp className="h-4 w-4" />
      case '재무':
        return <DollarSign className="h-4 w-4" />
      case '관계':
        return <Users className="h-4 w-4" />
      case '부동산':
        return <Home className="h-4 w-4" />
      case '여행':
        return <Plane className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = selectedCategory === '전체' || goal.category === selectedCategory
    const priorityMatch = selectedPriority === '전체' || goal.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  const calculateProgress = (goal: Goal) => {
    return calculateGoalProgress(goal)
  }

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date()
    const target = new Date(targetDate)
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const { completed: completedGoals, total: totalGoals, progress: overallProgress } = calculateGoalsProgress(goals)
  const activeGoals = goals.filter(goal => goal.status === 'active').length

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">목표 관리</h1>
          <p className="text-gray-600">인생 목표를 설정하고 체계적으로 추적하세요</p>
        </div>
        <Button onClick={() => handleOpenModal('create')}>
          <Plus className="mr-2 h-4 w-4" />
          새 목표 추가
        </Button>
      </div>

      {/* 목표 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 목표</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}개</div>
            <p className="text-xs text-muted-foreground">설정된 목표</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행중</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals}개</div>
            <p className="text-xs text-muted-foreground">활성 목표</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedGoals}개</div>
            <p className="text-xs text-muted-foreground">달성된 목표</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">달성률</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
            <p className="text-xs text-muted-foreground">전체 진행률</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <Label className="text-sm font-medium">카테고리</Label>
              <div className="flex gap-2 mt-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">우선순위</Label>
              <div className="flex gap-2 mt-2">
                {priorities.map((priority) => (
                  <Button
                    key={priority}
                    variant={selectedPriority === priority ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedPriority(priority)}
                  >
                    {priority === 'high' ? '높음' : 
                     priority === 'medium' ? '보통' : 
                     priority === 'low' ? '낮음' : '전체'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 목표 목록 */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">목표 목록을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => {
          const progress = calculateProgress(goal)
          const daysRemaining = getDaysRemaining(goal.targetDate)
          const isOverdue = daysRemaining < 0
          
          return (
            <Card key={goal.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(goal.category)}
                    <div>
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority === 'high' ? '높음' : 
                       goal.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status === 'active' ? '진행중' : 
                       goal.status === 'completed' ? '완료' : '일시정지'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">목표값</div>
                    <div className="font-semibold">
                      {goal.unit === '원' ? formatCurrency(goal.targetValue) : goal.targetValue}{goal.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">현재값</div>
                    <div className="font-semibold">
                      {goal.unit === '원' ? formatCurrency(goal.currentValue) : goal.currentValue}{goal.unit}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">목표일</div>
                    <div className={`font-semibold ${isOverdue ? 'text-red-600' : ''}`}>
                      {formatDate(goal.targetDate)}
                      {isOverdue ? ` (${Math.abs(daysRemaining)}일 지연)` : ` (${daysRemaining}일 남음)`}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>진행률</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                {/* 마일스톤 */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">마일스톤</h4>
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm">{milestone.title}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(milestone.dueDate)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenModal('edit', goal)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    수정
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">목표가 없습니다</h3>
              <p className="text-gray-600 mb-4">새로운 목표를 추가해보세요!</p>
              <Button onClick={() => handleOpenModal('create')}>
                <Plus className="mr-2 h-4 w-4" />
                목표 추가하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 목표 모달 */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        initialData={selectedGoal}
        mode={modalMode}
      />
    </div>
  )
}
