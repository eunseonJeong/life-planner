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
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { 
  Home, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Building,
  FileText,
  Calculator,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Search,
  RefreshCw
} from 'lucide-react'
import { RealEstateData, RegionOption } from '@/types/real-estate'
import { getRealEstateData, getRegionList } from '@/lib/api/real-estate'

interface Region {
  name: string
  averagePrice: number
  priceChange: number
  pros: string[]
  cons: string[]
  rating: number
  description: string
}

interface PurchaseMethod {
  method: string
  description: string
  pros: string[]
  cons: string[]
  minBudget: number
  maxBudget: number
  risk: 'low' | 'medium' | 'high'
}

interface AuctionProcess {
  step: number
  title: string
  description: string
  duration: string
  cost: number
  status: 'completed' | 'in-progress' | 'planned'
}

export default function RealEstatePage() {
  const [selectedRegion, setSelectedRegion] = useState('11680') // 강남구 코드
  const [selectedDealType, setSelectedDealType] = useState<'sale' | 'jeonse' | 'wolse'>('sale')
  const [selectedPropertyType, setSelectedPropertyType] = useState<'apartment' | 'villa' | 'officetel' | 'house'>('apartment')
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 0, 1), // 2024년 1월 1일
    to: new Date(2024, 0, 31)   // 2024년 1월 31일
  })
  const [regionList, setRegionList] = useState<RegionOption[]>([])
  const [realEstateData, setRealEstateData] = useState<RealEstateData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [purchaseMethods] = useState<PurchaseMethod[]>([
    {
      method: '전세',
      description: '보증금만 내고 월세 없이 거주',
      pros: ['월세부담없음', '투자리스크낮음', '이사편리'],
      cons: ['보증금많음', '수익성낮음', '자본이동성낮음'],
      minBudget: 500000000,
      maxBudget: 2000000000,
      risk: 'low'
    },
    {
      method: '매매',
      description: '부동산을 완전 소유',
      pros: ['자산가치상승', '수익성높음', '자유로운활용'],
      cons: ['초기자금많음', '유지비용높음', '리스크높음'],
      minBudget: 2000000000,
      maxBudget: 10000000000,
      risk: 'high'
    },
    {
      method: '경매',
      description: '법원 경매를 통한 구입',
      pros: ['시세대비저렴', '투자수익성높음', '다양한선택'],
      cons: ['정보부족', '리스크높음', '복잡한절차'],
      minBudget: 300000000,
      maxBudget: 5000000000,
      risk: 'high'
    },
    {
      method: '청약',
      description: '정부 지원 주택 청약',
      pros: ['정부지원', '시세대비저렴', '안정성높음'],
      cons: ['자격제한', '선택지한정', '대기시간길음'],
      minBudget: 200000000,
      maxBudget: 800000000,
      risk: 'low'
    }
  ])

  const [auctionProcess] = useState<AuctionProcess[]>([
    {
      step: 1,
      title: '물건조사',
      description: '경매 물건의 상세 정보 조사',
      duration: '2-3주',
      cost: 500000,
      status: 'completed'
    },
    {
      step: 2,
      title: '입찰신청',
      description: '경매 참여 신청 및 보증금 납부',
      duration: '1주',
      cost: 1000000,
      status: 'in-progress'
    },
    {
      step: 3,
      title: '입찰참여',
      description: '실제 경매 입찰 참여',
      duration: '1일',
      cost: 0,
      status: 'planned'
    },
    {
      step: 4,
      title: '낙찰',
      description: '경매 낙찰 및 대금 납부',
      duration: '1주',
      cost: 0,
      status: 'planned'
    },
    {
      step: 5,
      title: '인수인계',
      description: '부동산 인수 및 등기',
      duration: '2-3주',
      cost: 2000000,
      status: 'planned'
    }
  ])

  // 지역 목록 로드
  useEffect(() => {
    const loadRegionList = async () => {
      try {
        const response = await getRegionList()
        if (response.data) {
          setRegionList(response.data)
        }
      } catch (error) {
        console.error('지역 목록 로드 실패:', error)
        setError('지역 목록을 불러오는데 실패했습니다.')
      }
    }

    loadRegionList()
  }, [])

  // 선택된 지역의 부동산 정보 로드
  useEffect(() => {
    const loadRealEstateData = async () => {
      if (!selectedRegion || !dateRange?.from || !dateRange?.to) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const fromDate = format(dateRange.from, 'yyyy-MM')
        const toDate = format(dateRange.to, 'yyyy-MM')
        
        const response = await getRealEstateData({
          regionCode: selectedRegion,
          dealType: selectedDealType,
          propertyType: selectedPropertyType,
          from: fromDate,
          to: toDate
        })
        if (response.data) {
          setRealEstateData(response.data)
        }
      } catch (error: any) {
        console.error('부동산 정보 로드 실패:', error)
        
        // 에러 메시지 처리
        let errorMessage = '부동산 정보를 불러오는데 실패했습니다.'
        if (error?.response?.data?.error) {
          errorMessage = error.response.data.error
        } else if (error?.message) {
          errorMessage = error.message
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    loadRealEstateData()
  }, [selectedRegion, selectedDealType, selectedPropertyType, dateRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'planned':
        return <Calendar className="h-4 w-4 text-gray-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">부동산</h1>
          <p className="text-gray-600">지역별 분석과 구입 전략을 종합적으로 관리하세요</p>
        </div>
        <Button>
          <RefreshCw className="mr-2 h-4 w-4" />
          정보 새로고침
        </Button>
      </div>

      {/* 지역 선택 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            지역 선택
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">지역</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {regionList.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">거래 유형</label>
              <Select value={selectedDealType} onValueChange={(value: 'sale' | 'jeonse' | 'wolse') => setSelectedDealType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">매매</SelectItem>
                  <SelectItem value="jeonse">전세</SelectItem>
                  <SelectItem value="wolse">월세</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">건물 유형</label>
              <Select value={selectedPropertyType} onValueChange={(value: 'apartment' | 'villa' | 'officetel' | 'house') => setSelectedPropertyType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">아파트</SelectItem>
                  <SelectItem value="villa">빌라</SelectItem>
                  <SelectItem value="officetel">오피스텔</SelectItem>
                  <SelectItem value="house">단독주택</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">조회 기간</label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 지역별 거주지 분석 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            지역별 거주지 분석
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>부동산 정보를 불러오는 중...</span>
            </div>
          )}

          {realEstateData && !isLoading && (
            <div className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{realEstateData.region} 지역 분석</h3>
                  <p className="text-gray-600 mb-4">
                    {realEstateData.dealType === 'sale' ? '매매' : realEstateData.dealType === 'jeonse' ? '전세' : '월세'} 
                    거래 현황 ({dateRange?.from && dateRange?.to ? 
                      `${format(dateRange.from, 'yyyy년 MM월 dd일')} ~ ${format(dateRange.to, 'yyyy년 MM월 dd일')}` : 
                      realEstateData.period})
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">거래 건수</span>
                      <span className="font-medium">{realEstateData.statistics.count.toLocaleString()}건</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">평균 거래가</span>
                      <span className="font-medium">{formatCurrency(realEstateData.statistics.avgPrice)}원</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">중앙값 거래가</span>
                      <span className="font-medium">{formatCurrency(realEstateData.statistics.medianPrice)}원</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">평균 단가 (㎡)</span>
                      <span className="font-medium">{formatCurrency(realEstateData.statistics.avgPricePerM2)}원/㎡</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">거래 범위</span>
                      <span className="font-medium">
                        {formatCurrency(realEstateData.statistics.minPrice)} ~ {formatCurrency(realEstateData.statistics.maxPrice)}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">평균 면적</span>
                      <span className="font-medium">{realEstateData.statistics.avgArea.toFixed(1)}㎡</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">시장 동향</span>
                      <Badge 
                        variant={realEstateData.marketTrend === 'up' ? 'default' : 
                                realEstateData.marketTrend === 'down' ? 'destructive' : 'secondary'}
                      >
                        {realEstateData.marketTrend === 'up' ? '상승' : 
                         realEstateData.marketTrend === 'down' ? '하락' : '안정'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">최종 업데이트</span>
                      <span className="text-sm text-gray-500">
                        {new Date(realEstateData.lastUpdated).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-700 mb-2">최근 거래 내역</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {realEstateData.recentTransactions.map((transaction, index) => (
                        <div key={transaction.id} className="border rounded p-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">{transaction.address}</span>
                            <span className="text-gray-500">{transaction.dealDate}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{transaction.areaM2}㎡ / {transaction.floor}층</span>
                            <span className="font-medium">
                              {transaction.dealType === 'sale' 
                                ? formatCurrency(transaction.price) + '원'
                                : transaction.dealType === 'jeonse'
                                ? formatCurrency(transaction.deposit || 0) + '원 (전세)'
                                : `${formatCurrency(transaction.deposit || 0)}원 + ${formatCurrency(transaction.monthlyRent || 0)}원/월`
                              }
                            </span>
                          </div>
                          {transaction.naverUrl && (
                            <div className="mt-1">
                              <a 
                                href={transaction.naverUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:text-green-800 underline"
                              >
                                네이버부동산 →
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 주택 구입 방식 비교 */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            주택 구입 방식 비교
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {purchaseMethods.map((method) => (
              <div key={method.method} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{method.method}</h3>
                  <Badge className={getRiskColor(method.risk)}>
                    {method.risk === 'low' ? '낮음' : 
                     method.risk === 'medium' ? '보통' : '높음'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                
                <div className="space-y-2 mb-3">
                  <div className="text-xs">
                    <span className="font-medium">예산: </span>
                    {formatCurrency(method.minBudget)} ~ {formatCurrency(method.maxBudget)}원
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-green-700">장점</h4>
                  {method.pros.slice(0, 2).map((pro, index) => (
                    <div key={index} className="text-xs text-gray-600">• {pro}</div>
                  ))}
                </div>
                
                <div className="space-y-1 mt-2">
                  <h4 className="text-xs font-medium text-red-700">단점</h4>
                  {method.cons.slice(0, 2).map((con, index) => (
                    <div key={index} className="text-xs text-gray-600">• {con}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}

      {/* 2025년 청약 정책 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            2025년 청약 정책 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">신혼부부 특별공급</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">자격요건</span>
                  <span className="text-sm font-medium">결혼 7년 이내</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">소득기준</span>
                  <span className="text-sm font-medium">연소득 7,000만원 이하</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">자산기준</span>
                  <span className="text-sm font-medium">6억원 이하</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">공급비율</span>
                  <span className="text-sm font-medium">전용면적 85㎡ 이하 50%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">생애최초 특별공급</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">자격요건</span>
                  <span className="text-sm font-medium">무주택자</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">소득기준</span>
                  <span className="text-sm font-medium">연소득 5,000만원 이하</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">자산기준</span>
                  <span className="text-sm font-medium">3억원 이하</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">공급비율</span>
                  <span className="text-sm font-medium">전용면적 85㎡ 이하 30%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 경매 진행 프로세스 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            경매 진행 프로세스
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auctionProcess.map((process, index) => (
              <div key={process.step} className="relative">
                {index < auctionProcess.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(process.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {process.step}. {process.title}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {process.duration}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mt-1">{process.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      예상 비용: {formatCurrency(process.cost)}원
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
