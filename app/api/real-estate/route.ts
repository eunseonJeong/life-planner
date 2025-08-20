import { NextRequest, NextResponse } from 'next/server'
import { RealEstateData, ApiQueryParams, RegionOption } from '@/types/real-estate'
import { 
  loadRegionDeals
} from '@/lib/services/public-api'
import { ALL_REGION_CODES, findRegionByCode } from '@/lib/data/region-codes'

// 서비스키 정규화 유틸리티
function normalizeServiceKeyForSearchParams(raw: string): string {
  const cleaned = (raw || '').trim().replace(/\s+/g, '') // 개행/공백 제거
  try {
    // Encoding 키라면 %xx를 원문으로 되돌린 후 SearchParams가 '한 번'만 인코딩하게
    return decodeURIComponent(cleaned)
  } catch {
    // 이미 Decoding 키라면 그대로 사용 (SearchParams가 인코딩해줌)
    return cleaned
  }
}

// 공공 API를 통한 부동산 데이터 조회
async function getRealEstateDataFromPublicApi(params: ApiQueryParams): Promise<RealEstateData> {
  const {
    dealType = 'sale',
    propertyType = 'apartment',
    regionCode,
    from = '2024-01',
    to = '2024-12',
    areaMin,
    areaMax,
    normalization = 'none',
    aggregation = 'mean',
    wolseConvertRate = 0.05
  } = params

  if (!regionCode) {
    throw new Error('지역 코드가 필요합니다.')
  }

  const region = findRegionByCode(regionCode)
  if (!region) {
    throw new Error('유효하지 않은 지역 코드입니다.')
  }

  const apiKey = normalizeServiceKeyForSearchParams(process.env.NEXT_PUBLIC_PUBLIC_API_KEY || '')
  if (!apiKey) {
    throw new Error('공공 API 서비스키가 설정되지 않았습니다.')
  }

  try {
    // 월 범위 조회 + 통계/최근 거래
    const { recentTransactions, statistics, count } = await loadRegionDeals({
      regionCode,
      from,
      to,
      dealType,
      serviceKey: apiKey
    })

    // 면적 필터링
    let filteredTransactions = recentTransactions
    if (areaMin || areaMax) {
      filteredTransactions = recentTransactions.filter(t => {
        if (areaMin && t.areaM2 < areaMin) return false
        if (areaMax && t.areaM2 > areaMax) return false
        return true
      })
    }

    return {
      region: region.fullName,
      regionCode,
      propertyType,
      dealType,
      period: from,
      statistics,
      recentTransactions: filteredTransactions,
      marketTrend: 'stable', // 시장 동향은 별도 계산 필요
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('공공 API 데이터 조회 실패:', error)
    throw error
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    console.log('API 호출 파라미터:', Object.fromEntries(searchParams.entries()))
    
    // API 키 확인
    const apiKey = (process.env.NEXT_PUBLIC_PUBLIC_API_KEY || '').trim()
    if (!apiKey) {
      console.error('API 키가 설정되지 않음')
      return NextResponse.json({ 
        error: '공공 API 서비스키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_PUBLIC_API_KEY를 설정해주세요.' 
      }, { status: 500 })
    }
    
    console.log('API 키 확인됨, 길이:', apiKey.length)
    
    // 쿼리 파라미터 파싱
    const params: ApiQueryParams = {
      dealType: (searchParams.get('dealType') as 'sale' | 'jeonse' | 'wolse') || 'sale',
      propertyType: (searchParams.get('propertyType') as 'apartment' | 'villa' | 'officetel' | 'house') || 'apartment',
      regionCode: searchParams.get('regionCode') || '',
      from: searchParams.get('from') || '2024-01',
      to: searchParams.get('to') || '2024-12',
      areaMin: searchParams.get('areaMin') ? parseInt(searchParams.get('areaMin')!) : undefined,
      areaMax: searchParams.get('areaMax') ? parseInt(searchParams.get('areaMax')!) : undefined,
      normalization: (searchParams.get('normalization') as 'per_m2' | 'none') || 'none',
      aggregation: (searchParams.get('aggregation') as 'mean' | 'median') || 'mean',
      wolseConvertRate: searchParams.get('wolseConvertRate') ? parseFloat(searchParams.get('wolseConvertRate')!) : 0.05,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    }

    console.log('파싱된 파라미터:', params)

    if (!params.regionCode) {
      console.error('지역 코드가 없음')
      return NextResponse.json({ 
        error: '지역 코드 파라미터가 필요합니다.' 
      }, { status: 400 })
    }

    console.log('공공 API 호출 시작...')
    const data = await getRealEstateDataFromPublicApi(params)
    console.log('공공 API 호출 성공')
    
    return NextResponse.json({ 
      data,
      message: '부동산 정보를 성공적으로 조회했습니다.'
    }, { status: 200 })
  } catch (error) {
    console.error('부동산 정보 조회 오류:', error)
    console.error('에러 스택:', error instanceof Error ? error.stack : '스택 없음')
    
    // 에러 타입에 따른 메시지 분기
    let errorMessage = '부동산 정보 조회에 실패했습니다.'
    if (error instanceof Error) {
      if (error.message.includes('API 서비스키')) {
        errorMessage = error.message
      } else if (error.message.includes('HTTP')) {
        errorMessage = `API 서버 오류: ${error.message}`
      } else if (error.message.includes('파싱')) {
        errorMessage = 'API 응답 데이터 처리 중 오류가 발생했습니다.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}

// 지역 목록 조회 API
export async function POST(request: NextRequest) {
  try {
    const regions: RegionOption[] = ALL_REGION_CODES.map(region => ({
      value: region.bjdCode,
      label: region.fullName,
      category: region.sido,
      bjdCode: region.bjdCode
    }))

    return NextResponse.json({ 
      data: regions,
      message: '지역 목록을 성공적으로 조회했습니다.'
    }, { status: 200 })
  } catch (error) {
    console.error('지역 목록 조회 오류:', error)
    return NextResponse.json({ 
      error: '지역 목록 조회에 실패했습니다.' 
    }, { status: 500 })
  }
}
