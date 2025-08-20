'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Heart, 
  Calendar, 
  DollarSign, 
  Target, 
  Users,
  Gift,
  Camera,
  Car,
  Plane,
  Home,
  CheckCircle,
  Clock
} from 'lucide-react'

interface WeddingPlan {
  category: string
  items: WeddingItem[]
  totalBudget: number
  spentAmount: number
  priority: 'high' | 'medium' | 'low'
}

interface WeddingItem {
  name: string
  budget: number
  spent: number
  status: 'completed' | 'in-progress' | 'planned'
  dueDate: string
  notes: string
}

interface DatePlan {
  month: string
  budget: number
  spent: number
  activities: string[]
  status: 'completed' | 'in-progress' | 'planned'
}

export default function RelationshipPage() {
  const [weddingPlans] = useState<WeddingPlan[]>([
    {
      category: '웨딩홀',
      totalBudget: 50000000,
      spentAmount: 30000000,
      priority: 'high',
      items: [
        {
          name: '웨딩홀 예약금',
          budget: 30000000,
          spent: 30000000,
          status: 'completed',
          dueDate: '2024-12-15',
          notes: '강남 웨딩홀 예약 완료'
        },
        {
          name: '웨딩홀 잔금',
          budget: 20000000,
          spent: 0,
          status: 'planned',
          dueDate: '2025-06-15',
          notes: '결혼식 1주일 전 납부'
        }
      ]
    },
    {
      category: '드레스 & 턱시도',
      totalBudget: 3000000,
      spentAmount: 1500000,
      priority: 'high',
      items: [
        {
          name: '웨딩드레스',
          budget: 2000000,
          spent: 1500000,
          status: 'in-progress',
          dueDate: '2025-05-01',
          notes: '드레스 피팅 완료, 수정 중'
        },
        {
          name: '턱시도',
          budget: 1000000,
          spent: 0,
          status: 'planned',
          dueDate: '2025-05-15',
          notes: '턱시도 대여 예약'
        }
      ]
    },
    {
      category: '스냅 & 영상',
      totalBudget: 2000000,
      spentAmount: 500000,
      priority: 'medium',
      items: [
        {
          name: '스냅사진',
          budget: 1200000,
          spent: 500000,
          status: 'in-progress',
          dueDate: '2025-04-15',
          notes: '스냅 촬영 완료, 편집 중'
        },
        {
          name: '영상촬영',
          budget: 800000,
          spent: 0,
          status: 'planned',
          dueDate: '2025-06-20',
          notes: '결혼식 당일 촬영'
        }
      ]
    },
    {
      category: '기타 준비물',
      totalBudget: 5000000,
      spentAmount: 2000000,
      priority: 'low',
      items: [
        {
          name: '반지',
          budget: 2000000,
          spent: 2000000,
          status: 'completed',
          dueDate: '2024-11-30',
          notes: '커플링 구매 완료'
        },
        {
          name: '화환',
          budget: 1000000,
          spent: 0,
          status: 'planned',
          dueDate: '2025-06-20',
          notes: '결혼식 당일 배송'
        },
        {
          name: '기타 소품',
          budget: 2000000,
          spent: 0,
          status: 'planned',
          dueDate: '2025-06-10',
          notes: '장식품, 소품 구매'
        }
      ]
    }
  ])

  const [datePlans] = useState<DatePlan[]>([
    {
      month: '2024년 12월',
      budget: 500000,
      spent: 450000,
      status: 'completed',
      activities: ['크리스마스 데이트', '겨울 휴가', '선물 구매'],
    },
    {
      month: '2025년 1월',
      budget: 400000,
      spent: 380000,
      status: 'completed',
      activities: ['신년 데이트', '스키장', '새해 계획'],
    },
    {
      month: '2025년 2월',
      budget: 600000,
      spent: 520000,
      status: 'completed',
      activities: ['발렌타인 데이트', '온천 여행', '선물'],
    },
    {
      month: '2025년 3월',
      budget: 500000,
      spent: 300000,
      status: 'in-progress',
      activities: ['봄 나들이', '벚꽃 구경', '피크닉'],
    },
    {
      month: '2025년 4월',
      budget: 800000,
      spent: 0,
      status: 'planned',
      activities: ['스냅 촬영', '웨딩 준비', '봄 여행'],
    },
    {
      month: '2025년 5월',
      budget: 1000000,
      spent: 0,
      status: 'planned',
      activities: ['최종 준비', '드레스 피팅', '리허설'],
    }
  ])

  const [relationshipStats] = useState({
    datingPeriod: '2년 3개월',
    weddingDate: '2025년 6월 21일',
    totalBudget: 60000000,
    spentBudget: 37000000,
    remainingDays: 180
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'planned':
        return <Calendar className="h-4 w-4 text-gray-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const totalBudget = weddingPlans.reduce((sum, plan) => sum + plan.totalBudget, 0)
  const totalSpent = weddingPlans.reduce((sum, plan) => sum + plan.spentAmount, 0)
  const budgetProgress = (totalSpent / totalBudget) * 100

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">관계/결혼</h1>
          <p className="text-gray-600">결혼 준비와 데이트 계획을 체계적으로 관리하세요</p>
        </div>
        <Button>계획 수정</Button>
      </div>

      {/* 관계 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">교제 기간</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipStats.datingPeriod}</div>
            <p className="text-xs text-muted-foreground">함께한 시간</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">결혼식</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{relationshipStats.weddingDate}</div>
            <p className="text-xs text-muted-foreground">D-{relationshipStats.remainingDays}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예산</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(relationshipStats.totalBudget)}원</div>
            <p className="text-xs text-muted-foreground">결혼 준비 예산</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">사용 예산</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(relationshipStats.spentBudget)}원</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((relationshipStats.spentBudget / relationshipStats.totalBudget) * 100)}% 사용
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 결혼 준비 계획 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            결혼 준비 계획
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {weddingPlans.map((plan, planIndex) => (
              <div key={planIndex} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{plan.category}</h3>
                    <p className="text-sm text-gray-600">
                      예산: {formatCurrency(plan.totalBudget)}원 | 
                      사용: {formatCurrency(plan.spentAmount)}원
                    </p>
                  </div>
                  <Badge className={getPriorityColor(plan.priority)}>
                    {plan.priority === 'high' ? '높음' : 
                     plan.priority === 'medium' ? '보통' : '낮음'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {plan.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.notes}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {formatCurrency(item.spent)} / {formatCurrency(item.budget)}원
                        </div>
                        <div className="text-xs text-gray-500">{item.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>진행률</span>
                    <span>{Math.round((plan.spentAmount / plan.totalBudget) * 100)}%</span>
                  </div>
                  <Progress value={(plan.spentAmount / plan.totalBudget) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">전체 예산 진행률</span>
              <span className="text-lg font-bold">{Math.round(budgetProgress)}%</span>
            </div>
            <Progress value={budgetProgress} className="mt-2" />
            <div className="mt-2 text-sm text-gray-600">
              남은 예산: {formatCurrency(relationshipStats.totalBudget - relationshipStats.spentBudget)}원
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 데이트 예산 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            데이트 예산 관리
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datePlans.map((plan, index) => {
              const progress = (plan.spent / plan.budget) * 100
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{plan.month}</h3>
                    <Badge className={getPriorityColor(plan.status === 'completed' ? 'low' : 
                                                      plan.status === 'in-progress' ? 'medium' : 'high')}>
                      {plan.status === 'completed' ? '완료' : 
                       plan.status === 'in-progress' ? '진행중' : '계획'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span>예산</span>
                      <span>{formatCurrency(plan.budget)}원</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>사용</span>
                      <span>{formatCurrency(plan.spent)}원</span>
                    </div>
                  </div>
                  
                  <Progress value={progress} className="h-2 mb-3" />
                  
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-700">활동</h4>
                    {plan.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="text-xs text-gray-600">• {activity}</div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 결혼식 예산 세부 계획 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              예산 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>웨딩홀</span>
                </div>
                <span className="font-medium">83%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>드레스 & 턱시도</span>
                </div>
                <span className="font-medium">5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span>스냅 & 영상</span>
                </div>
                <span className="font-medium">3%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>기타 준비물</span>
                </div>
                <span className="font-medium">9%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              남은 일정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">스냅 촬영</span>
                <span className="text-sm font-medium">D-45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">드레스 피팅</span>
                <span className="text-sm font-medium">D-30</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">리허설</span>
                <span className="text-sm font-medium">D-7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">결혼식</span>
                <span className="text-sm font-medium text-red-600">D-Day</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
