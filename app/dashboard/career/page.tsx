'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Code, 
  Users, 
  Award,
  Calendar,
  CheckCircle,
  Plus,
  Edit
} from 'lucide-react'
import { CareerGoalModal } from '@/components/career/career-goal-modal'
import { RoadmapModal } from '@/components/career/roadmap-modal'
import { CareerGoal, RoadmapItem, CareerGoalFormData } from '@/types/career'
import { getCareerGoals } from '@/lib/api/career-goals'
import { getRoadmap } from '@/lib/api/roadmap'
import { getCurrentUserId } from '@/lib/auth'

export default function CareerPage() {
  const [careerGoal, setCareerGoal] = useState<CareerGoal | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([])
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const userId = getCurrentUserId()
        
        // 커리어 목표 로드
        const careerResponse = await getCareerGoals(userId)
        if (careerResponse.data && careerResponse.data.length > 0) {
          // 가장 최근 연도의 목표를 가져옴
          const latestGoal = careerResponse.data.reduce((latest, current) => 
            current.year > latest.year ? current : latest
          )
          setCareerGoal(latestGoal)
        }

        // 로드맵 로드
        const roadmapResponse = await getRoadmap(userId)
        if (roadmapResponse.data) {
          setRoadmap(roadmapResponse.data)
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error)
        // 에러가 발생해도 빈 상태로 초기화
        setCareerGoal(null)
        setRoadmap([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Target className="h-4 w-4 text-blue-500" />
      case 'planned':
        return <Calendar className="h-4 w-4 text-yellow-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const salaryProgress = careerGoal 
    ? ((careerGoal.currentSalary / careerGoal.targetSalary) * 100)
    : 0

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleOpenEditModal = () => {
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleOpenRoadmapModal = () => {
    setIsRoadmapModalOpen(true)
  }

  const handleCloseRoadmapModal = () => {
    setIsRoadmapModalOpen(false)
  }

  const handleSaveCareerGoal = async (data: CareerGoalFormData) => {
    try {
      const userId = getCurrentUserId()
      // 커리어 목표 저장 후 데이터를 다시 로드
      const careerResponse = await getCareerGoals(userId)
      if (careerResponse.data && careerResponse.data.length > 0) {
        const latestGoal = careerResponse.data.reduce((latest, current) => 
          current.year > latest.year ? current : latest
        )
        setCareerGoal(latestGoal)
      }
    } catch (error) {
      console.error('커리어 목표 저장 실패:', error)
    }
  }

  const handleSaveRoadmap = async (newRoadmap: RoadmapItem[]) => {
    try {
      const userId = getCurrentUserId()
      // 로드맵 저장 후 데이터를 다시 로드
      const roadmapResponse = await getRoadmap(userId)
      if (roadmapResponse.data) {
        setRoadmap(roadmapResponse.data)
      }
    } catch (error) {
      console.error('로드맵 저장 실패:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">커리어 계획</h1>
          <p className="text-gray-600">목표와 성장 로드맵을 관리하세요</p>
        </div>
        <div className="flex space-x-3">
          {!careerGoal && (
            <Button onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              목표 등록
            </Button>
          )}
          {careerGoal && (
            <Button onClick={handleOpenEditModal}>
              목표 수정
            </Button>
          )}
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">커리어 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 - 데이터가 없을 때 */}
      {!isLoading && !careerGoal && roadmap.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">커리어 정보가 없습니다</h3>
            <p className="text-gray-600 mb-4">커리어 목표를 설정하고 성장 로드맵을 만들어보세요!</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleOpenCreateModal}>
                <Plus className="mr-2 h-4 w-4" />
                목표 등록
              </Button>
              <Button variant="outline" onClick={handleOpenRoadmapModal}>
                로드맵 관리
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 데이터가 있을 때만 표시 */}
      {!isLoading && (careerGoal || roadmap.length > 0) && (
        <>

      {/* 연봉 목표 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            연봉 목표
          </CardTitle>
        </CardHeader>
        <CardContent>
          {careerGoal && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">현재 연봉</Label>
                  <div className="text-2xl font-bold text-gray-900">
                    {careerGoal.currentSalary.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">목표 연봉</Label>
                  <div className="text-2xl font-bold text-blue-600">
                    {careerGoal.targetSalary.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">부업 수입 목표</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {careerGoal.sideIncomeTarget.toLocaleString()}원
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>진행률</span>
                  <span>{Math.round(salaryProgress)}%</span>
                </div>
                <Progress value={salaryProgress} className="h-3" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 기술 스택 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5" />
              기술 스택
            </CardTitle>
          </CardHeader>
          <CardContent>
            {careerGoal && (
              <div className="space-y-3">
                {careerGoal.techStack.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{tech}</span>
                    <Badge variant="outline">학습중</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              포트폴리오
            </CardTitle>
          </CardHeader>
          <CardContent>
            {careerGoal && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {careerGoal.portfolioCount}
                  </div>
                  <p className="text-sm text-gray-600">완성된 프로젝트</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>목표</span>
                    <span>5개</span>
                  </div>
                  <Progress value={(careerGoal.portfolioCount / 5) * 100} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 네트워킹 & 학습 목표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              네트워킹 목표
            </CardTitle>
          </CardHeader>
          <CardContent>
            {careerGoal && (
              <div className="space-y-3">
                {careerGoal.networkingGoals.split(', ').map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              학습 목표
            </CardTitle>
          </CardHeader>
          <CardContent>
            {careerGoal && (
              <div className="space-y-3">
                {careerGoal.learningGoals.split(', ').map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

            {/* 성장 로드맵 */}
            <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              성장 로드맵
            </CardTitle>
            <Button onClick={handleOpenRoadmapModal} variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              로드맵 관리
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roadmap.map((item, index) => (
              <div key={item.id} className="relative">
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
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status === 'completed' ? '완료' : 
                         item.status === 'in-progress' ? '진행중' : '계획'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">
                        {item.year}년 {item.quarter}분기
                      </span>
                      <div className="flex space-x-2">
                        {item.skills.map((skill, skillIndex) => (
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
        </CardContent>
      </Card>

        </>
      )}

      {/* 커리어 목표 모달 */}
      <CareerGoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCareerGoal}
        initialData={modalMode === 'edit' && careerGoal ? careerGoal : undefined}
        mode={modalMode}
      />

      {/* 로드맵 관리 모달 */}
      <RoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={handleCloseRoadmapModal}
        onSave={handleSaveRoadmap}
        initialRoadmap={roadmap}
      />
    </div>
  )
}
