import { RealEstateData, RegionOption, ApiResponse, ApiQueryParams } from '@/types/real-estate'

export async function getRealEstateData(params: ApiQueryParams): Promise<ApiResponse<RealEstateData>> {
  try {
    const queryParams = new URLSearchParams()
    
    // 필수 파라미터
    if (params.regionCode) queryParams.append('regionCode', params.regionCode)
    if (params.dealType) queryParams.append('dealType', params.dealType)
    if (params.propertyType) queryParams.append('propertyType', params.propertyType)
    if (params.from) queryParams.append('from', params.from)
    if (params.to) queryParams.append('to', params.to)
    
    // 선택적 파라미터
    if (params.areaMin) queryParams.append('areaMin', params.areaMin.toString())
    if (params.areaMax) queryParams.append('areaMax', params.areaMax.toString())
    if (params.normalization) queryParams.append('normalization', params.normalization)
    if (params.aggregation) queryParams.append('aggregation', params.aggregation)
    if (params.wolseConvertRate) queryParams.append('wolseConvertRate', params.wolseConvertRate.toString())
    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())

    const response = await fetch(`/api/real-estate?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '부동산 정보 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('부동산 정보 조회 오류:', error)
    throw error
  }
}

export async function getRegionList(): Promise<ApiResponse<RegionOption[]>> {
  try {
    const response = await fetch('/api/real-estate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '지역 목록 조회에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('지역 목록 조회 오류:', error)
    throw error
  }
}
