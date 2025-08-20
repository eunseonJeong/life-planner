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
  AlertCircle,
  Activity,
  Award,
  Star,
  DollarSign,
  BarChart3
} from 'lucide-react'
import { dashboardItems } from '@/lib/data/settings-items'
import { Label } from '@/components/ui/label'

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

interface DashboardSettings {
  [key: string]: boolean
}

export default function DashboardPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([])
  const [dashboardSettings, setDashboardSettings] = useState<DashboardSettings>({})
  const [filters, setFilters] = useState({
    year: 'all',
    category: 'all',
    priority: 'all',
    status: 'all'
  })

  useEffect(() => {
    // localStorage에서 대시보드 설정 불러오기
    const savedDashboardSettings = localStorage.getItem('dashboardSettings')
    if (savedDashboardSettings) {
      setDashboardSettings(JSON.parse(savedDashboardSettings))
    } else {
      // 기본값: 모든 항목 활성화
      const defaultSettings = dashboardItems.reduce((acc, item) => {
        acc[item.key] = item.enabled
        return acc
      }, {} as DashboardSettings)
      setDashboardSettings(defaultSettings)
    }

    // 설정 변경 이벤트 리스너
    const handleDashboardSettingsChanged = (event: CustomEvent) => {
      setDashboardSettings(event.detail)
    }

    window.addEventListener('dashboardSettingsChanged', handleDashboardSettingsChanged as EventListener)

    return () => {
      window.removeEventListener('dashboardSettingsChanged', handleDashboardSettingsChanged as EventListener)
    }
  }, [])

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'PLANNING':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CAREER':
        return <TrendingUp className="h-4 w-4" />
      case 'REAL_ESTATE':
        return <Target className="h-4 w-4" />
      case 'RELATIONSHIP':
        return <Calendar className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR')
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // 대시보드 설정에 따라 항목 렌더링 여부 결정
  const shouldShowSection = (key: string) => {
    return dashboardSettings[key] !== false
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">전체 현황을 한눈에 확인하세요</p>
        </div>
      </div>

      {/* 전체 진행률 */}
      {shouldShowSection('overallProgress') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              전체 진행률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">68%</span>
                <span className="text-sm text-gray-600">전체 목표 달성률</span>
              </div>
              <Progress value={68} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">총 목표</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">진행중</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">4</div>
                  <div className="text-sm text-gray-600">완료</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 카테고리별 진행률 */}
      {shouldShowSection('categoryProgress') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              카테고리별 진행률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: '커리어', progress: 75, color: 'bg-blue-500' },
                { category: '재무', progress: 60, color: 'bg-green-500' },
                { category: '관계', progress: 85, color: 'bg-pink-500' },
                { category: '부동산', progress: 45, color: 'bg-orange-500' },
                { category: '여행', progress: 30, color: 'bg-purple-500' }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.category}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 목표 */}
      {shouldShowSection('recentGoals') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              최근 목표
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlans.slice(0, 3).map((plan) => (
                <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(plan.category)}
                    <div>
                      <div className="font-medium">{plan.title}</div>
                      <div className="text-sm text-gray-600">{formatDate(plan.dueDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(plan.priority)}>
                      {plan.priority}
                    </Badge>
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 다가오는 마감일 */}
      {shouldShowSection('upcomingDeadlines') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              다가오는 마감일
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans
                .filter(plan => getDaysRemaining(plan.dueDate) <= 30 && getDaysRemaining(plan.dueDate) > 0)
                .slice(0, 3)
                .map((plan) => {
                  const daysRemaining = getDaysRemaining(plan.dueDate)
                  return (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <div>
                          <div className="font-medium">{plan.title}</div>
                          <div className="text-sm text-gray-600">{formatDate(plan.dueDate)}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600">
                        {daysRemaining}일 남음
                      </Badge>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 성취 */}
      {shouldShowSection('achievements') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              최근 성취
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: '중급 개발자 승진', date: '2024-06-15', category: '커리어' },
                { title: '5천만원 자산 달성', date: '2024-12-31', category: '재무' },
                { title: '프로포즈 성공', date: '2024-12-25', category: '관계' }
              ].map((achievement, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-gray-600">{achievement.date} • {achievement.category}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">달성</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 추천사항 */}
      {shouldShowSection('recommendations') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              추천사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: '집 구매 준비 강화',
                  description: '부동산 목표 달성률이 낮습니다. 청약 정보를 더 적극적으로 수집해보세요.',
                  priority: 'high'
                },
                {
                  title: '투자 포트폴리오 점검',
                  description: '재무 목표 달성을 위해 투자 수익률을 개선할 수 있는 방법을 검토해보세요.',
                  priority: 'medium'
                }
              ].map((recommendation, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{recommendation.title}</div>
                    <Badge className={recommendation.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                      {recommendation.priority === 'high' ? '높음' : '보통'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 재무 요약 */}
      {shouldShowSection('financialSummary') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              재무 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-green-600">5,000만원</div>
                <div className="text-sm text-gray-600">총 자산</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-blue-600">150만원</div>
                <div className="text-sm text-gray-600">월 저축액</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-purple-600">7.2%</div>
                <div className="text-sm text-gray-600">투자 수익률</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold text-orange-600">1,000만원</div>
                <div className="text-sm text-gray-600">비상금</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 월별 트렌드 */}
      {shouldShowSection('monthlyTrends') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              월별 트렌드
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { month: '1월', progress: 45 },
                { month: '2월', progress: 52 },
                { month: '3월', progress: 58 },
                { month: '4월', progress: 62 },
                { month: '5월', progress: 65 },
                { month: '6월', progress: 68 }
              ].map((trend, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{trend.month}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={trend.progress} className="w-32 h-2" />
                    <span className="text-sm font-medium">{trend.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium">연도</Label>
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">카테고리</Label>
              <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="CAREER">커리어</SelectItem>
                  <SelectItem value="REAL_ESTATE">부동산</SelectItem>
                  <SelectItem value="RELATIONSHIP">관계</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">우선순위</Label>
              <Select value={filters.priority} onValueChange={(value) => setFilters({...filters, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="HIGH">높음</SelectItem>
                  <SelectItem value="MEDIUM">보통</SelectItem>
                  <SelectItem value="LOW">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium">상태</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="PLANNING">계획</SelectItem>
                  <SelectItem value="IN_PROGRESS">진행중</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
