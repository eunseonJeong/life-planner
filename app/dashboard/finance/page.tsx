'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  PiggyBank,
  CreditCard,
  Home,
  Car,
  Edit
} from 'lucide-react'
import { FinanceModal } from '@/components/finance/finance-modal'
import { LifeStageModal } from '@/components/finance/life-stage-modal'
import { FinancialData, FinancialFormData, LifeStage } from '@/types/finance'
import { getFinancialData, saveFinancialData } from '@/lib/api/finance'
import { getLifeStages } from '@/lib/api/life-stages'
import { getCurrentUserId } from '@/lib/auth'
import { PORTFOLIO_ITEMS } from '@/lib/data/portfolio-items'
import { calculateLifeStageProgress, calculateProgress } from '@/lib/utils/progress'

export default function FinancePage() {
  const [financialData, setFinancialData] = useState<FinancialData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('edit')
  const [isLifeStageModalOpen, setIsLifeStageModalOpen] = useState(false)

  const [lifeStages, setLifeStages] = useState<LifeStage[]>([])

  const [yearlyProjection, setYearlyProjection] = useState<any[]>([])

  useEffect(() => {
    calculateYearlyProjection()
  }, [financialData])

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const userId = getCurrentUserId()
        
        // 자산 정보 로드
        const financialResponse = await getFinancialData(userId)
        if (financialResponse.success && financialResponse.data) {
          setFinancialData(financialResponse.data)
        }

        // 생애주기별 자금 계획 로드
        const lifeStagesResponse = await getLifeStages(userId)
        if (lifeStagesResponse.success && lifeStagesResponse.data) {
          setLifeStages(lifeStagesResponse.data)
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error)
        // 에러가 발생해도 빈 객체로 초기화
        setFinancialData({})
        setLifeStages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const calculateYearlyProjection = () => {
    const projection = []
    let currentAssets = financialData.totalAssets || 0
    const monthlyReturn = (financialData.investmentReturn || 0) / 100 / 12
    const totalMonthlySavings = Object.values(financialData.monthlySavings || {}).reduce((sum, val) => sum + (val || 0), 0)

    // 동적 연도 범위 설정
    const currentYear = new Date().getFullYear()
    const startYear = financialData.year || currentYear
    const endYear = startYear + 10 // 10년간 예측

    for (let year = startYear; year <= endYear; year++) {
      // 연간 자산 증가 계산 (복리)
      for (let month = 0; month < 12; month++) {
        currentAssets = currentAssets * (1 + monthlyReturn) + totalMonthlySavings
      }

      projection.push({
        year,
        assets: Math.round(currentAssets),
        savings: totalMonthlySavings * 12,
        return: Math.round(currentAssets * ((financialData.investmentReturn || 0) / 100))
      })
    }

    setYearlyProjection(projection)
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === 0) return '0원'
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  const getTotalMonthlySavings = () => {
    return Object.values(financialData.monthlySavings || {}).reduce((sum, val) => sum + (val || 0), 0)
  }

  const getTotalMonthlyExpenses = () => {
    return Object.values(financialData.monthlyExpenses || {}).reduce((sum, val) => sum + (val || 0), 0)
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

  const handleOpenModal = (mode: 'create' | 'edit') => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSaveFinancialData = async (data: FinancialFormData) => {
    try {
      const userId = getCurrentUserId()
      const response = await saveFinancialData(data, userId)
      if (response.success && response.data) {
        setFinancialData(response.data)
        console.log('저장된 자산 정보:', response.data)
      }
    } catch (error) {
      console.error('자산 정보 저장 실패:', error)
      throw error
    }
  }

  const overallProgress = calculateLifeStageProgress(lifeStages)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">자산 관리</h1>
          <p className="text-gray-600">생애주기별 자금 계획과 투자 포트폴리오를 관리하세요</p>
        </div>
        <Button onClick={() => handleOpenModal('edit')}>
          자산 정보 수정
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">자산 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 - 데이터가 없을 때 */}
      {!isLoading && Object.keys(financialData).length === 0 && lifeStages.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">자산 정보가 없습니다</h3>
            <p className="text-gray-600 mb-4">자산 정보를 입력하고 생애주기별 자금 계획을 설정해보세요!</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => handleOpenModal('edit')}>
                자산 정보 입력
              </Button>
              <Button variant="outline" onClick={() => setIsLifeStageModalOpen(true)}>
                자금 계획 설정
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 데이터가 있을 때만 표시 */}
      {!isLoading && (Object.keys(financialData).length > 0 || lifeStages.length > 0) && (
        <>

      {/* 현재 자산 현황 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {financialData.totalAssets && financialData.totalAssets > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 자산</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financialData.totalAssets)}</div>
              <p className="text-xs text-muted-foreground">현재 보유 자산</p>
            </CardContent>
          </Card>
        )}

        {getTotalMonthlySavings() > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">월 저축액</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(getTotalMonthlySavings())}</div>
              <p className="text-xs text-muted-foreground">월 저축 가능액</p>
            </CardContent>
          </Card>
        )}

        {financialData.investmentReturn && financialData.investmentReturn > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">투자 수익률</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{financialData.investmentReturn}%</div>
              <p className="text-xs text-muted-foreground">연간 예상 수익률</p>
            </CardContent>
          </Card>
        )}

        {financialData.emergencyFund && financialData.emergencyFund > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">비상금</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(financialData.emergencyFund)}</div>
              <p className="text-xs text-muted-foreground">비상 시 사용 가능</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 생애주기별 자금 계획 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="mr-2 h-5 w-5" />
              생애주기별 자금 계획
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLifeStageModalOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              편집
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lifeStages.map((stage, index) => {
              const progress = calculateProgress(stage.currentAmount, stage.targetAmount)
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium">{stage.stage} ({stage.age}세)</h3>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                    </div>
                    <Badge className={getPriorityColor(stage.priority)}>
                      {stage.priority === 'high' ? '높음' : 
                       stage.priority === 'medium' ? '보통' : '낮음'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>목표: {formatCurrency(stage.targetAmount)}원</span>
                      <span>현재: {formatCurrency(stage.currentAmount)}원</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-right text-sm text-gray-600">
                      {Math.round(progress)}% 달성
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">전체 진행률</span>
              <span className="text-lg font-bold">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* 연도별 자산 예측 */}
      {(financialData.totalAssets || getTotalMonthlySavings() > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="mr-2 h-5 w-5" />
              연도별 자산 예측 ({financialData.year || new Date().getFullYear()}-{(financialData.year || new Date().getFullYear()) + 10})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {yearlyProjection.map((projection, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{projection.year}년</h3>
                    <p className="text-sm text-gray-600">
                      저축: {formatCurrency(projection.savings)} | 
                      수익: {formatCurrency(projection.return)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(projection.assets)}
                    </div>
                    <p className="text-sm text-gray-600">예상 자산</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 투자 포트폴리오 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getTotalMonthlySavings() > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                투자 포트폴리오
              </CardTitle>
            </CardHeader>
                         <CardContent>
                               <div className="space-y-4">
                  {(() => {
                    const totalSavings = getTotalMonthlySavings()
                    
                    return PORTFOLIO_ITEMS
                      .filter(item => financialData.monthlySavings?.[item.key as keyof typeof financialData.monthlySavings] && 
                                      (financialData.monthlySavings[item.key as keyof typeof financialData.monthlySavings] || 0) > 0)
                      .map((item, index) => {
                        const amount = financialData.monthlySavings?.[item.key as keyof typeof financialData.monthlySavings] || 0
                        const percentage = totalSavings > 0 ? Math.round((amount / totalSavings) * 100) : 0
                        
                        return (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 ${item.color} rounded`}></div>
                              <span>{item.label}</span>
                            </div>
                            <span className="font-medium">{percentage}%</span>
                          </div>
                        )
                      })
                  })()}
                </div>
             </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              월별 현금흐름
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialData.monthlyIncome && financialData.monthlyIncome > 0 && (
                <div className="flex justify-between">
                  <span>수입</span>
                  <span className="text-green-600 font-medium">
                    +{formatCurrency(financialData.monthlyIncome)}
                  </span>
                </div>
              )}
              {getTotalMonthlyExpenses() > 0 && (
                <div className="flex justify-between">
                  <span>지출</span>
                  <span className="text-red-600 font-medium">
                    -{formatCurrency(getTotalMonthlyExpenses())}
                  </span>
                </div>
              )}
              {(financialData.monthlyIncome || getTotalMonthlyExpenses() > 0) && <hr />}
              {getTotalMonthlySavings() > 0 && (
                <div className="flex justify-between font-bold">
                  <span>순 현금흐름</span>
                  <span className="text-blue-600">
                    +{formatCurrency(getTotalMonthlySavings())}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

        </>
      )}

      {/* 자산 정보 모달 */}
      <FinanceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveFinancialData}
        initialData={financialData}
        mode={modalMode}
      />

      {/* 생애주기별 자금 계획 모달 */}
      <LifeStageModal
        isOpen={isLifeStageModalOpen}
        onClose={() => setIsLifeStageModalOpen(false)}
      />
    </div>
  )
}
