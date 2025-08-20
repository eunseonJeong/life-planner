'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Calendar,
  Users,
  Home,
  Plane,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Star,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  overallProgress: number
  categoryProgress: {
    career: number
    finance: number
    relationship: number
    realEstate: number
    travel: number
  }
  monthlyTrends: {
    month: string
    progress: number
    goals: number
    completed: number
  }[]
  topGoals: {
    id: string
    title: string
    category: string
    progress: number
    priority: string
  }[]
  achievements: {
    id: string
    title: string
    date: string
    category: string
    impact: number
  }[]
  recommendations: {
    id: string
    title: string
    description: string
    priority: 'high' | 'medium' | 'low'
    category: string
  }[]
}

export default function AnalyticsPage() {
  const [analyticsData] = useState<AnalyticsData>({
    overallProgress: 68,
    categoryProgress: {
      career: 75,
      finance: 60,
      relationship: 85,
      realEstate: 45,
      travel: 30
    },
    monthlyTrends: [
      { month: '1월', progress: 45, goals: 8, completed: 2 },
      { month: '2월', progress: 52, goals: 8, completed: 3 },
      { month: '3월', progress: 58, goals: 8, completed: 3 },
      { month: '4월', progress: 62, goals: 8, completed: 4 },
      { month: '5월', progress: 65, goals: 8, completed: 4 },
      { month: '6월', progress: 68, goals: 8, completed: 5 }
    ],
    topGoals: [
      { id: '1', title: '연봉 8,000만원 달성', category: '커리어', progress: 75, priority: 'high' },
      { id: '2', title: '1억 자산 달성', category: '재무', progress: 60, priority: 'high' },
      { id: '3', title: '결혼', category: '관계', progress: 85, priority: 'high' },
      { id: '4', title: '집 구매', category: '부동산', progress: 45, priority: 'medium' },
      { id: '5', title: '유럽 여행', category: '여행', progress: 30, priority: 'low' }
    ],
    achievements: [
      { id: '1', title: '중급 개발자 승진', date: '2024-06-15', category: '커리어', impact: 8 },
      { id: '2', title: '5천만원 자산 달성', date: '2024-12-31', category: '재무', impact: 7 },
      { id: '3', title: '프로포즈 성공', date: '2024-12-25', category: '관계', impact: 9 },
      { id: '4', title: '청약 자격 획득', date: '2025-01-15', category: '부동산', impact: 6 }
    ],
    recommendations: [
      {
        id: '1',
        title: '집 구매 준비 강화',
        description: '부동산 목표 달성률이 낮습니다. 청약 정보를 더 적극적으로 수집하고 자격 요건을 점검해보세요.',
        priority: 'high',
        category: '부동산'
      },
      {
        id: '2',
        title: '여행 계획 구체화',
        description: '여행 목표가 가장 낮은 진행률을 보입니다. 구체적인 계획과 예산을 세워보세요.',
        priority: 'medium',
        category: '여행'
      },
      {
        id: '3',
        title: '재무 목표 재검토',
        description: '재무 목표 달성률이 평균 이하입니다. 투자 전략을 재검토하고 저축 계획을 강화해보세요.',
        priority: 'high',
        category: '재무'
      }
    ]
  })

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

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (current < previous) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">분석 리포트</h1>
          <p className="text-gray-600">목표 달성 현황과 트렌드를 종합적으로 분석하세요</p>
        </div>
        <Button>리포트 다운로드</Button>
      </div>

      {/* 전체 진행률 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 진행률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overallProgress}%</div>
            <p className="text-xs text-muted-foreground">목표 달성률</p>
            <Progress value={analyticsData.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 목표</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8개</div>
            <p className="text-xs text-muted-foreground">진행중인 목표</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 목표</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5개</div>
            <p className="text-xs text-muted-foreground">달성된 목표</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 달성률</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">월 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* 카테고리별 진행률 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            카테고리별 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(analyticsData.categoryProgress).map(([category, progress]) => (
              <div key={category} className="text-center">
                <div className="flex justify-center mb-2">
                  {getCategoryIcon(category === 'career' ? '커리어' : 
                                  category === 'finance' ? '재무' :
                                  category === 'relationship' ? '관계' :
                                  category === 'realEstate' ? '부동산' : '여행')}
                </div>
                <div className={`text-2xl font-bold ${getProgressColor(progress)}`}>
                  {progress}%
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {category === 'career' ? '커리어' : 
                   category === 'finance' ? '재무' :
                   category === 'relationship' ? '관계' :
                   category === 'realEstate' ? '부동산' : '여행'}
                </div>
                <Progress value={progress} className="mt-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 월별 트렌드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            월별 진행률 트렌드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.monthlyTrends.map((trend, index) => {
              const previousProgress = index > 0 ? analyticsData.monthlyTrends[index - 1].progress : trend.progress
              return (
                <div key={trend.month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-medium">{trend.month}</div>
                    {getTrendIcon(trend.progress, previousProgress)}
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">진행률</div>
                      <div className="font-semibold">{trend.progress}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">목표</div>
                      <div className="font-semibold">{trend.goals}개</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">완료</div>
                      <div className="font-semibold">{trend.completed}개</div>
                    </div>
                  </div>
                  <Progress value={trend.progress} className="w-32" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 상위 목표 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="mr-2 h-5 w-5" />
            상위 목표 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getCategoryIcon(goal.category)}
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600">{goal.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge className={getPriorityColor(goal.priority)}>
                    {goal.priority === 'high' ? '높음' : 
                     goal.priority === 'medium' ? '보통' : '낮음'}
                  </Badge>
                  <div className="text-right">
                    <div className="font-semibold">{goal.progress}%</div>
                    <Progress value={goal.progress} className="w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 최근 성과 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-5 w-5" />
            최근 성과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.category}</p>
                  <p className="text-xs text-gray-500">{achievement.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">+{achievement.impact}</div>
                  <div className="text-xs text-gray-600">영향도</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 추천사항 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            개선 추천사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recommendations.map((recommendation) => (
              <div key={recommendation.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority === 'high' ? '높음' : 
                     recommendation.priority === 'medium' ? '보통' : '낮음'}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <p className="text-sm text-gray-600">{recommendation.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {getCategoryIcon(recommendation.category)}
                    <span className="text-xs text-gray-500">{recommendation.category}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  자세히 보기
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
