import { CheongyakItem, CheongyakDetail, CheongyakListResponse, CheongyakDetailResponse, CheongyakQueryParams } from '@/types/cheongyak'

const API_BASE = '/api/cheongyak'

// 청약 유형
export type CheongyakType = 'apt' | 'officetel' | 'remndr' | 'public_rent' | 'optional' | 'all'

/**
 * 청약홈 분양정보 목록 조회
 * @param type - 청약 유형 (apt, officetel, remndr, public_rent, optional, all)
 * @param params - 조회 파라미터
 */
export async function getCheongyakList(
  params?: CheongyakQueryParams,
  type: CheongyakType = 'apt'
): Promise<CheongyakListResponse> {
  try {
    const queryParams = new URLSearchParams()
    
    // 청약 유형
    queryParams.append('type', type)
    
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.numOfRows) queryParams.append('numOfRows', params.numOfRows.toString())
    if (params?.houseSecd) queryParams.append('houseSecd', params.houseSecd)
    if (params?.rcritPblancSe) queryParams.append('rcritPblancSe', params.rcritPblancSe)
    if (params?.rcritPblancDe) queryParams.append('rcritPblancDe', params.rcritPblancDe)
    if (params?.rcritPblancEndDe) queryParams.append('rcritPblancEndDe', params.rcritPblancEndDe)
    if (params?.sido) queryParams.append('sido', params.sido)
    if (params?.sigungu) queryParams.append('sigungu', params.sigungu)

    const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || '청약홈 정보 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('청약홈 목록 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '청약홈 정보 조회에 실패했습니다.',
    }
  }
}

/**
 * APT 분양정보 조회
 */
export async function getAPTList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'apt')
}

/**
 * 오피스텔/도시형/민간임대/생활숙박시설 분양정보 조회
 */
export async function getOfficetelList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'officetel')
}

/**
 * APT 잔여세대 분양정보 조회
 */
export async function getRemndrList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'remndr')
}

/**
 * 공공지원 민간임대 분양정보 조회
 */
export async function getPublicRentList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'public_rent')
}

/**
 * 임의공급 분양정보 조회
 */
export async function getOptionalList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'optional')
}

/**
 * 모든 유형의 청약정보 통합 조회
 */
export async function getAllCheongyakList(params?: CheongyakQueryParams): Promise<CheongyakListResponse> {
  return getCheongyakList(params, 'all')
}

/**
 * 청약홈 분양정보 상세 조회
 */
export async function getCheongyakDetail(
  houseManageNo: string,
  pblancNo: string,
  type: CheongyakType = 'apt'
): Promise<CheongyakDetailResponse> {
  try {
    const queryParams = new URLSearchParams({
      houseManageNo,
      pblancNo,
      type,
    })

    const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('청약홈 상세정보 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('청약홈 상세 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '청약홈 상세정보 조회에 실패했습니다.',
    }
  }
}

/**
 * 주택형별 상세정보 조회 (분양가 등)
 */
export async function getCheongyakModelDetail(
  houseManageNo: string,
  pblancNo: string,
  type: CheongyakType = 'apt'
): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const queryParams = new URLSearchParams({
      houseManageNo,
      pblancNo,
      type,
      model: 'true', // 주택형별 상세 조회 플래그
    })

    const response = await fetch(`${API_BASE}?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('주택형별 상세정보 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('주택형별 상세 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '주택형별 상세정보 조회에 실패했습니다.',
    }
  }
}
