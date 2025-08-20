'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react'

interface Plan {
  id: string
  title: string
  category: string
  year: number
  priority: string
  status: string
  progress: number
  dueDate: string
}

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([])
  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    priority: 'all',
    status: 'all'
  })

  useEffect(() => {
    // 실제로는 API에서 데이터를 가져옴
    const mockPlans: Plan[] = [
      {
        id: '1',
        title: '시니어 개발자 진급',
        category: 'CAREER',
        year: 2025,
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        progress: 60,
        dueDate: '2025-12-31'
      },
      {
        id: '2',
        title: '강남 아파트 구매',
        category: 'REAL_ESTATE',
        year: 2026,
        priority: 'HIGH',
        status: 'PLANNING',
        progress: 20,
        dueDate: '2026-06-30'
      },
      {
        id: '3',
        title: '결혼 준비',
        category: 'RELATIONSHIP',
        year: 2025,
        priority: 'MEDIUM',
        status: 'PLANNING',
        progress: 30,
        dueDate: '2025-12-31'
      }
    ]
    setPlans(mockPlans)
    setFilteredPlans(mockPlans)
  }, [])

  useEffect(() => {
    let filtered = plans

    if (filters.year !== 'all') {
      filtered = filtered.filter(plan => plan.year === parseInt(filters.year))
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(plan => plan.category === filters.category)
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(plan => plan.priority === filters.priority)
    }
    if (filters.status !== 'all') {
      filtered = filtered.filter(plan => plan.status === filters.status)
    }

    setFilteredPlans(filtered)
  }, [plans, filters])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'PLANNING':
        return <Target className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'LOW':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'CAREER':
        return 'bg-blue-100 text-blue-800'
      case 'REAL_ESTATE':
        return 'bg-purple-100 text-purple-800'
      case 'RELATIONSHIP':
        return 'bg-pink-100 text-pink-800'
      case 'FINANCE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const totalProgress = plans.length > 0 
    ? plans.reduce((sum, plan) => sum + plan.progress, 0) / plans.length 
    : 0

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">전체 계획 현황을 한눈에 확인하세요</p>
        </div>
        <Button>새 계획 추가</Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 진행률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 계획</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">개 계획</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">진행 중</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter(p => p.status === 'IN_PROGRESS').length}
            </div>
            <p className="text-xs text-muted-foreground">개 진행 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter(p => p.status === 'COMPLETED').length}
            </div>
            <p className="text-xs text-muted-foreground">개 완료</p>
          </CardContent>
        </Card>
      </div>

      {/* 계획 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>계획 목록</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
              <SelectTrigger>
                <SelectValue placeholder="연도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 연도</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="영역 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 영역</SelectItem>
                <SelectItem value="CAREER">커리어</SelectItem>
                <SelectItem value="REAL_ESTATE">부동산</SelectItem>
                <SelectItem value="RELATIONSHIP">관계/결혼</SelectItem>
                <SelectItem value="FINANCE">자산 관리</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
              <SelectTrigger>
                <SelectValue placeholder="우선순위 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 우선순위</SelectItem>
                <SelectItem value="HIGH">높음</SelectItem>
                <SelectItem value="MEDIUM">보통</SelectItem>
                <SelectItem value="LOW">낮음</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger>
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 상태</SelectItem>
                <SelectItem value="PLANNING">계획</SelectItem>
                <SelectItem value="IN_PROGRESS">진행 중</SelectItem>
                <SelectItem value="COMPLETED">완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 mt-4">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(plan.status)}
                  <div>
                    <h3 className="font-medium">{plan.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getCategoryColor(plan.category)}>
                        {plan.category}
                      </Badge>
                      <Badge className={getPriorityColor(plan.priority)}>
                        {plan.priority}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {plan.year}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{plan.progress}%</div>
                    <Progress value={plan.progress} className="w-24" />
                  </div>
                  <Button variant="outline" size="sm">
                    상태 변경
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
