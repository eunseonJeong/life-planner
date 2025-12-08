/**
 * 청약홈 분양정보 조회 서비스
 * 한국부동산원 청약홈 API 연동
 * https://www.data.go.kr/data/15098547/openapi.do
 * Swagger: https://infuser.odcloud.kr/api/stages/37000/api-docs
 * 
 * API 목록:
 * 1. getAPTLttotPblancDetail - APT 분양정보 상세조회
 * 2. getUrbtyOfctlLttotPblancDetail - 오피스텔/도시형/민간임대/생활숙박시설 분양정보 상세조회
 * 3. getRemndrLttotPblancDetail - APT 잔여세대 분양정보 상세조회
 * 4. getAPTLttotPblancMdl - APT 분양정보 주택형별 상세조회
 * 5. getUrbtyOfctlLttotPblancMdl - 오피스텔/도시형/민간임대/생활숙박시설 분양정보 주택형별 상세조회
 * 6. getRemndrLttotPblancMdl - APT 잔여세대 분양정보 주택형별 상세조회
 * 7. getPblPvtRentLttotPblancDetail - 공공지원 민간임대 분양정보 상세조회
 * 8. getPblPvtRentLttotPblancMdl - 공공지원 민간임대 분양정보 주택형별 상세조회
 * 9. getOPTLttotPblancDetail - 임의공급 분양정보 상세조회
 * 10. getOPTLttotPblancMdl - 임의공급 분양정보 주택형별 상세조회
 */

import { CheongyakItem, CheongyakDetail, CheongyakQueryParams } from '@/types/cheongyak'

// 청약홈 API 설정
const API_CONFIG = {
  // Decoding된 API 키 사용 (URLSearchParams가 자동으로 인코딩 처리)
  serviceKey: process.env.NEXT_PUBLIC_CHEONGYAK_API_KEY || process.env.NEXT_PUBLIC_PUBLIC_API_KEY || '',
  baseUrl: 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1'
}

// 청약 유형
export type CheongyakType = 'apt' | 'officetel' | 'remndr' | 'public_rent' | 'optional'

// API 엔드포인트 매핑
const ENDPOINTS = {
  apt: {
    list: '/getAPTLttotPblancDetail',
    model: '/getAPTLttotPblancMdl'
  },
  officetel: {
    list: '/getUrbtyOfctlLttotPblancDetail',
    model: '/getUrbtyOfctlLttotPblancMdl'
  },
  remndr: {
    list: '/getRemndrLttotPblancDetail',
    model: '/getRemndrLttotPblancMdl'
  },
  public_rent: {
    list: '/getPblPvtRentLttotPblancDetail',
    model: '/getPblPvtRentLttotPblancMdl'
  },
  optional: {
    list: '/getOPTLttotPblancDetail',
    model: '/getOPTLttotPblancMdl'
  }
}

// API 응답을 CheongyakItem으로 변환
function normalizeCheongyakItem(item: any, index: number): CheongyakItem {
  return {
    id: item.HOUSE_MANAGE_NO || item.PBLANC_NO || `cheongyak_${index}_${Date.now()}`,
    houseManageNo: item.HOUSE_MANAGE_NO || '',
    pblancNo: item.PBLANC_NO || '',
    houseNm: item.HOUSE_NM || '',
    houseSecdNm: item.HOUSE_SECD_NM || '',
    houseSecd: item.HOUSE_SECD || '',
    houseDtlSecdNm: item.HOUSE_DTL_SECD_NM || '',
    rcritPblancDe: item.RCRIT_PBLANC_DE || '',
    rcritPblancEndDe: '', // API에서 별도 제공 안함
    przwnerPresnatnDe: item.PRZWNER_PRESNATN_DE || '',
    cntrctCnclsBgnde: item.CNTRCT_CNCLS_BGNDE || '',
    cntrctCnclsEndde: item.CNTRCT_CNCLS_ENDDE || '',
    hssplyZip: item.HSSPLY_ZIP || '',
    hssplyAdres: item.HSSPLY_ADRES || '',
    totSuplyHshldco: parseInt(item.TOT_SUPLY_HSHLDCO || '0', 10),
    rcritPblancDtlSecdNm: '',
    mdhsTelno: item.MDHS_TELNO || '',
    bsnsMbyNm: item.BSNS_MBY_NM || '',
    mdhsTpcdNm: '',
    mvnPrearngeYm: item.MVN_PREARNGE_YM || '',
    specltRdnEarthAtndNm: item.SPECLT_RDN_EARTH_AT || '',
    // 추가 필드
    subscrptAreaCodeNm: item.SUBSCRPT_AREA_CODE_NM || '',
    hmpgAdres: item.HMPG_ADRES || '',
    cnstrctEntrpsNm: item.CNSTRCT_ENTRPS_NM || '',
    pblancUrl: item.PBLANC_URL || '',
    ...item // 원본 데이터도 포함
  }
}

/**
 * 공통 API 호출 함수
 */
async function fetchCheongyakData(
  endpoint: string,
  params: CheongyakQueryParams = {}
): Promise<CheongyakItem[]> {
  const { page = 1, numOfRows = 100, houseSecd, rcritPblancDe, rcritPblancEndDe, sido } = params

  if (!API_CONFIG.serviceKey) {
    throw new Error('청약홈 API 서비스키가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_CHEONGYAK_API_KEY를 설정하세요.')
  }

  const url = `${API_CONFIG.baseUrl}${endpoint}`
  
  const queryParams = new URLSearchParams({
    serviceKey: API_CONFIG.serviceKey,
    page: String(page),
    perPage: String(numOfRows)
  })

  // 조건 파라미터 추가 (cond[FIELD::OPERATOR] 형식)
  if (houseSecd) {
    queryParams.append('cond[HOUSE_SECD::EQ]', houseSecd)
  }
  if (sido) {
    queryParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', sido)
  }
  if (rcritPblancDe) {
    queryParams.append('cond[RCRIT_PBLANC_DE::GTE]', rcritPblancDe)
  }
  if (rcritPblancEndDe) {
    queryParams.append('cond[RCRIT_PBLANC_DE::LTE]', rcritPblancEndDe)
  }

  console.log('청약홈 API 요청:', `${url}?${queryParams.toString().replace(API_CONFIG.serviceKey, 'API_KEY')}`)

  const response = await fetch(`${url}?${queryParams}`)
  const text = await response.text()

  console.log('청약홈 API 응답 상태:', response.status)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${text.slice(0, 300)}`)
  }

  const data = JSON.parse(text)

  if (data.code && data.code < 0) {
    throw new Error(`API 에러: ${data.msg || 'Unknown error'} (code: ${data.code})`)
  }

  const items = data.data || []
  
  console.log('청약홈 API 결과:', {
    totalCount: data.totalCount,
    currentCount: data.currentCount,
    itemCount: items.length
  })

  return items.map((item: any, index: number) => normalizeCheongyakItem(item, index))
}

/**
 * APT 분양정보 목록 조회
 */
export async function getCheongyakList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    return await fetchCheongyakData(ENDPOINTS.apt.list, params)
  } catch (error) {
    console.error('APT 분양정보 조회 실패:', error)
    throw error
  }
}

/**
 * 오피스텔/도시형/민간임대/생활숙박시설 분양정보 조회
 */
export async function getOfficetelList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    return await fetchCheongyakData(ENDPOINTS.officetel.list, params)
  } catch (error) {
    console.error('오피스텔 분양정보 조회 실패:', error)
    throw error
  }
}

/**
 * APT 잔여세대 분양정보 조회
 */
export async function getRemndrList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    return await fetchCheongyakData(ENDPOINTS.remndr.list, params)
  } catch (error) {
    console.error('잔여세대 분양정보 조회 실패:', error)
    throw error
  }
}

/**
 * 공공지원 민간임대 분양정보 조회
 */
export async function getPublicRentList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    return await fetchCheongyakData(ENDPOINTS.public_rent.list, params)
  } catch (error) {
    console.error('공공지원 민간임대 분양정보 조회 실패:', error)
    throw error
  }
}

/**
 * 임의공급 분양정보 조회
 */
export async function getOptionalList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    return await fetchCheongyakData(ENDPOINTS.optional.list, params)
  } catch (error) {
    console.error('임의공급 분양정보 조회 실패:', error)
    throw error
  }
}

/**
 * 모든 유형의 청약 정보 통합 조회
 */
export async function getAllCheongyakList(params: CheongyakQueryParams = {}): Promise<CheongyakItem[]> {
  try {
    const results = await Promise.allSettled([
      getCheongyakList(params),
      getOfficetelList(params),
      getRemndrList(params),
      getPublicRentList(params),
      getOptionalList(params)
    ])

    const allItems: CheongyakItem[] = []
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value)
      } else {
        console.warn(`청약 유형 ${index} 조회 실패:`, result.reason)
      }
    })

    // 모집공고일 기준 내림차순 정렬
    return allItems.sort((a, b) => {
      const dateA = a.rcritPblancDe || ''
      const dateB = b.rcritPblancDe || ''
      return dateB.localeCompare(dateA)
    })
  } catch (error) {
    console.error('통합 청약정보 조회 실패:', error)
    throw error
  }
}

/**
 * 청약 상세 정보 조회
 */
export async function getCheongyakDetail(
  houseManageNo: string,
  pblancNo: string,
  type: CheongyakType = 'apt'
): Promise<CheongyakDetail | null> {
  try {
    if (!API_CONFIG.serviceKey) {
      throw new Error('청약홈 API 서비스키가 설정되지 않았습니다.')
    }

    const endpoint = ENDPOINTS[type].list
    const url = `${API_CONFIG.baseUrl}${endpoint}`
    
    const queryParams = new URLSearchParams({
      serviceKey: API_CONFIG.serviceKey,
      page: '1',
      perPage: '1',
      'cond[HOUSE_MANAGE_NO::EQ]': houseManageNo,
      'cond[PBLANC_NO::EQ]': pblancNo
    })

    const response = await fetch(`${url}?${queryParams}`)
    const text = await response.text()

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    const data = JSON.parse(text)

    if (data.code && data.code < 0) {
      throw new Error(`API 에러: ${data.msg || 'Unknown error'}`)
    }

    const items = data.data || []
    if (items.length === 0) {
      return null
    }

    return normalizeCheongyakItem(items[0], 0) as CheongyakDetail
  } catch (error) {
    console.error('청약홈 상세정보 조회 실패:', error)
    throw error
  }
}

/**
 * 주택형별 상세 정보 조회 (분양가 등)
 */
export async function getCheongyakModelDetail(
  houseManageNo: string,
  pblancNo: string,
  type: CheongyakType = 'apt'
): Promise<any[]> {
  try {
    if (!API_CONFIG.serviceKey) {
      throw new Error('청약홈 API 서비스키가 설정되지 않았습니다.')
    }

    const endpoint = ENDPOINTS[type].model
    const url = `${API_CONFIG.baseUrl}${endpoint}`
    
    const queryParams = new URLSearchParams({
      serviceKey: API_CONFIG.serviceKey,
      page: '1',
      perPage: '100',
      'cond[HOUSE_MANAGE_NO::EQ]': houseManageNo,
      'cond[PBLANC_NO::EQ]': pblancNo
    })

    const response = await fetch(`${url}?${queryParams}`)
    const data = await response.json()

    if (data.code && data.code < 0) {
      throw new Error(`API 에러: ${data.msg || 'Unknown error'}`)
    }

    return data.data || []
  } catch (error) {
    console.error('주택형별 상세정보 조회 실패:', error)
    throw error
  }
}
