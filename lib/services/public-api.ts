import { 
  PublicApiConfig, 
  TransactionData, 
  StatisticsData,
  ApiQueryParams 
} from '@/types/real-estate'
import { findRegionByCode } from '@/lib/data/region-codes'
import { parseString } from 'xml2js'
import { 
  findComplexNoByDong, 
  deriveDongCortarNoFrom, 
  buildNaverLandUrlWithParams,
  buildNaverLandMobileUrl,
  fetchComplexCenter,
  fetchComplexTopArticleNo,
  toNaverTradeType
} from './naver-land'

// 서비스키 정규화 유틸리티
function normalizeServiceKeyForSearchParams(raw: string): string {
  const cleaned = (raw || '').trim().replace(/\s+/g, '')
  try {
    return decodeURIComponent(cleaned)
  } catch {
    return cleaned
  }
}

const API_CONFIG: PublicApiConfig = {
  serviceKey: normalizeServiceKeyForSearchParams(process.env.NEXT_PUBLIC_PUBLIC_API_KEY || ''),
  baseUrl: 'https://apis.data.go.kr/1613000'
}

// 유틸리티 함수들
function pad2(n: string | number): string {
  return String(n).padStart(2, '0')
}

function pick(obj: any, ...keys: string[]): any {
  for (const key of keys) {
    if (obj && obj[key] !== undefined) return obj[key]
  }
  return undefined
}

function parseAmount(value: any): number {
  if (!value) return 0
  const str = String(value).replace(/[^\d]/g, '')
  return parseInt(str, 10) || 0
}

function isOk(header: any): boolean {
  if (!header) return false
  const code = String(header.resultCode).trim()
  return code === '00' || code === '000' || code === '0'
}

// 월 범위 생성 함수
function* monthRange(from: string, to: string) {
  // from, to: 'YYYY-MM'
  const [fy, fm] = from.split('-').map(Number)
  const [ty, tm] = to.split('-').map(Number)
  const d = new Date(fy, fm - 1, 1)
  const end = new Date(ty, tm - 1, 1)
  while (d <= end) {
    yield { y: String(d.getFullYear()), m: String(d.getMonth() + 1).padStart(2, '0') }
    d.setMonth(d.getMonth() + 1)
  }
}

// XML 응답을 파싱하는 함수 (Promise 기반)
function parseXMLResponse(xmlText: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    parseString(xmlText, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(new Error('응답 데이터 파싱에 실패했습니다.'))
        return
      }

      try {
        
        // 에러 체크
        if (result.cmmMsgHeader) {
          const errorMsg = result.cmmMsgHeader.errMsg || 'API 호출 실패'
          reject(new Error(errorMsg))
          return
        }

        // OpenAPI_ServiceResponse 구조 체크
        if (result.OpenAPI_ServiceResponse?.cmmMsgHeader) {
          const h = result.OpenAPI_ServiceResponse.cmmMsgHeader
          reject(new Error(`${h.errMsg} (${h.returnAuthMsg}/${h.returnReasonCode})`))
          return
        }

        // 성공 응답 파싱 - 여러 구조 시도
        const header = result.response?.header || result.OpenAPI_ServiceResponse?.response?.header
        console.log('파싱된 헤더:', header)
        
        if (!header) {
          console.log('헤더가 없음, 전체 결과:', result)
          // 헤더가 없어도 아이템이 있으면 성공으로 처리
          const items = result.response?.body?.items?.item || 
                       result.OpenAPI_ServiceResponse?.response?.body?.items?.item || []
          const itemArray = Array.isArray(items) ? items : (items ? [items] : [])
          resolve(itemArray.filter((item: any) => item !== null && item !== undefined))
          return
        }

        if (header.resultCode !== '00') {
          const resultMsg = header.resultMsg || 'API 호출 실패'
          reject(new Error(resultMsg))
          return
        }

        // 아이템 파싱 - 여러 구조 시도
        const items = result.response?.body?.items?.item || 
                     result.OpenAPI_ServiceResponse?.response?.body?.items?.item || []
        const itemArray = Array.isArray(items) ? items : (items ? [items] : [])
        
        console.log('파싱된 아이템 수:', itemArray.length)
        resolve(itemArray.filter((item: any) => item !== null && item !== undefined))
      } catch (error) {
        console.error('응답 데이터 처리 실패:', error)
        reject(new Error('응답 데이터 처리에 실패했습니다.'))
      }
    })
  })
}

// 아파트 매매 실거래가 API
export async function getApartmentSaleData(params: {
  year: string
  month: string
  regionCode: string
  page?: number
  limit?: number
}): Promise<TransactionData[]> {
  const { year, month, regionCode, page = 1, limit = 100 } = params // 성능을 위해 100으로 조정
  
  console.log('아파트 매매 데이터 조회 시작:', { year, month, regionCode, page, limit })
  
  try {
    if (!API_CONFIG.serviceKey) {
      throw new Error('공공 API 서비스키가 설정되지 않았습니다. .env.local에 키를 설정하세요.')
    }
    
    const url = `${API_CONFIG.baseUrl}/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade`
    const qs = new URLSearchParams({
      serviceKey: API_CONFIG.serviceKey,
      LAWD_CD: regionCode,
      DEAL_YMD: `${year}${pad2(month)}`,
      pageNo: String(page),
      numOfRows: String(limit),
      _type: 'json'
    })

    const response = await fetch(`${url}?${qs}`)
    const text = await response.text()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${text.slice(0, 300)}`)
    }
    
    // 응답이 XML인지 JSON인지 확인
    let data: any
    if (text.trim().startsWith('<?xml') || text.trim().startsWith('<')) {
      console.log('XML 응답 감지, 파싱 시작...')
      // XML 응답 처리
      const items = await parseXMLResponse(text)
      data = {
        response: {
          header: { resultCode: '00' },
          body: { items: { item: items } }
        }
      }
    } else {
      // JSON 응답 처리
      data = JSON.parse(text)
    }

    // 게이트웨이 오류 체크
    if (data?.OpenAPI_ServiceResponse?.cmmMsgHeader) {
      const h = data.OpenAPI_ServiceResponse.cmmMsgHeader
      throw new Error(`${h.errMsg} (${h.returnAuthMsg}/${h.returnReasonCode})`)
    }
    
    // 헤더 체크
    if (!isOk(data?.response?.header)) {
      throw new Error(data?.response?.header?.resultMsg || 'API 실패')
    }

    // 아이템 추출
    const raw = data?.response?.body?.items?.item ?? []
    const items = Array.isArray(raw) ? raw : (raw ? [raw] : [])
    
    console.log(`${year}-${month} ${regionCode} 매매 거래 건수:`, items.length)

    const region = findRegionByCode(regionCode)
    console.log('지역 정보:', region)
    
    const result = items.map((it: any, idx: number) => {
      const y = pick(it, 'dealYear', '년') ?? year
      const m = pad2(pick(it, 'dealMonth', '월') ?? month)
      const d = pad2(pick(it, 'dealDay', '일') ?? '01')

      const priceManwon = parseAmount(pick(it, 'dealAmount', '거래금액')) // 만원
      const area = parseFloat(String(pick(it, 'excluUseAr', '전용면적') ?? '0'))
      const floor = parseInt(String(pick(it, 'floor', '층') ?? '0'), 10)
      const buildYear = parseInt(String(pick(it, 'buildYear', '건축년도') ?? '0'), 10)
      const dong = String(pick(it, 'umdNm', '법정동') ?? '')
      const jibun = String(pick(it, 'jibun', '지번') ?? '')

      return {
        id: `${regionCode}_${y}${m}_${idx}`,
        dealType: 'sale' as const,
        propertyType: 'apartment' as const,
        dealDate: `${y}-${m}-${d}`,
        price: priceManwon * 10000, // 원화
        areaM2: isNaN(area) ? 0 : area,
        floor: isNaN(floor) ? 0 : floor,
        yearBuilt: isNaN(buildYear) ? 0 : buildYear,
        bjdCode: regionCode,
        sido: region?.sido || '',
        sigungu: region?.sigungu || '',
        dong,
        address: `${region?.sido || ''} ${region?.sigungu || ''} ${dong} ${jibun}`.trim(),
        source: '국토교통부_아파트매매',
        aptName: pick(it, 'aptName', '아파트') || '', // 아파트명 추가
        // 실거래가 공개시스템 링크 추가
        detailUrl: `https://rt.molit.go.kr/new/gis/srh.do?menuGubun=A&gubunCode=LAND&houseType=1&sidoCode=${regionCode.substring(0, 2)}&gugunCode=${regionCode}&dongCode=${regionCode}&bun=${jibun?.split('-')[0] || ''}&ji=${jibun?.split('-')[1] || ''}&aptName=${encodeURIComponent(pick(it, 'aptName', '아파트') || '')}&jibun=${encodeURIComponent(jibun)}`
      }
    })
    
    console.log('매매 매핑 완료, 결과 수:', result.length)
    return result
  } catch (error) {
    console.error('아파트 매매 데이터 조회 실패:', error)
    throw error
  }
}

// 아파트 전월세 실거래가 API
export async function getApartmentRentData(params: {
  year: string
  month: string
  regionCode: string
  page?: number
  limit?: number
}): Promise<TransactionData[]> {
  const { year, month, regionCode, page = 1, limit = 100 } = params // 성능을 위해 100으로 조정
  
  console.log('아파트 전월세 데이터 조회 시작:', { year, month, regionCode, page, limit })
  
  try {
    if (!API_CONFIG.serviceKey) {
      throw new Error('공공 API 서비스키가 설정되지 않았습니다. .env.local에 키를 설정하세요.')
    }
    
    const url = `${API_CONFIG.baseUrl}/RTMSDataSvcAptRent/getRTMSDataSvcAptRent`
    const qs = new URLSearchParams({
      serviceKey: API_CONFIG.serviceKey,
      LAWD_CD: regionCode,
      DEAL_YMD: `${year}${pad2(month)}`,
      pageNo: String(page),
      numOfRows: String(limit),
      _type: 'json'
    })

    const response = await fetch(`${url}?${qs}`)
    const text = await response.text()
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}: ${text.slice(0, 300)}`)
    }
    
    // 응답이 XML인지 JSON인지 확인
    let data: any
    if (text.trim().startsWith('<?xml') || text.trim().startsWith('<')) {
      console.log('XML 응답 감지, 파싱 시작...')
      // XML 응답 처리
      const items = await parseXMLResponse(text)
      data = {
        response: {
          header: { resultCode: '00' },
          body: { items: { item: items } }
        }
      }
    } else {
      console.log('JSON 응답 감지, 파싱 시작...')
      // JSON 응답 처리
      data = JSON.parse(text)
    }

    // 게이트웨이 오류 체크
    if (data?.OpenAPI_ServiceResponse?.cmmMsgHeader) {
      const h = data.OpenAPI_ServiceResponse.cmmMsgHeader
      throw new Error(`${h.errMsg} (${h.returnAuthMsg}/${h.returnReasonCode})`)
    }
    
    // 헤더 체크
    if (!isOk(data?.response?.header)) {
      throw new Error(data?.response?.header?.resultMsg || 'API 실패')
    }

    // 아이템 추출
    const raw = data?.response?.body?.items?.item ?? []
    const items = Array.isArray(raw) ? raw : (raw ? [raw] : [])
    
    console.log(`${year}-${month} ${regionCode} 전월세 거래 건수:`, items.length)

    const region = findRegionByCode(regionCode)
    console.log('전월세 지역 정보:', region)
    
    const result = items.map((it: any, idx: number) => {
      // 날짜는 contractYear/Month/Day 또는 계약년월+계약일
      const ym = pick(it, 'contractYearMonth', '계약년월')
      const y = (pick(it, 'contractYear') ?? (ym ? String(ym).slice(0, 4) : year))
      const m = pad2(pick(it, 'contractMonth') ?? (ym ? String(ym).slice(4, 6) : month))
      const d = pad2(pick(it, 'contractDay', '계약일') ?? '01')

      const depositMan = parseAmount(pick(it, 'rentDeposit', '보증금액')) // 만원
      const feeMan = parseAmount(pick(it, 'rentFee', '월세금액')) // 만원
      const area = parseFloat(String(pick(it, 'excluUseAr', '전용면적') ?? '0'))
      const floor = parseInt(String(pick(it, 'floor', '층') ?? '0'), 10)
      const buildYear = parseInt(String(pick(it, 'buildYear', '건축년도') ?? '0'), 10)
      const dong = String(pick(it, 'umdNm', '법정동') ?? '')
      const jibun = String(pick(it, 'jibun', '지번') ?? '')

      return {
        id: `${regionCode}_${y}${m}_${idx}`,
        dealType: feeMan > 0 ? ('wolse' as const) : ('jeonse' as const),
        propertyType: 'apartment' as const,
        dealDate: `${y}-${m}-${d}`,
        price: 0,
        deposit: depositMan * 10000, // 원화
        monthlyRent: feeMan > 0 ? feeMan * 10000 : undefined,
        areaM2: isNaN(area) ? 0 : area,
        floor: isNaN(floor) ? 0 : floor,
        yearBuilt: isNaN(buildYear) ? 0 : buildYear,
        bjdCode: regionCode,
        sido: region?.sido || '',
        sigungu: region?.sigungu || '',
        dong,
        address: `${region?.sido || ''} ${region?.sigungu || ''} ${dong} ${jibun}`.trim(),
        source: '국토교통부_아파트전월세',
        aptName: pick(it, 'aptName', '아파트') || '', // 아파트명 추가
        // 실거래가 공개시스템 링크 추가
        detailUrl: `https://rt.molit.go.kr/new/gis/srh.do?menuGubun=A&gubunCode=LAND&houseType=1&sidoCode=${regionCode.substring(0, 2)}&gugunCode=${regionCode}&dongCode=${regionCode}&bun=${jibun?.split('-')[0] || ''}&ji=${jibun?.split('-')[1] || ''}&aptName=${encodeURIComponent(pick(it, 'aptName', '아파트') || '')}&jibun=${encodeURIComponent(jibun)}`
      }
    })
    
    console.log('전월세 매핑 완료, 결과 수:', result.length)
    return result
  } catch (error) {
    console.error('아파트 전월세 데이터 조회 실패:', error)
    throw error
  }
}

// 통계 데이터 계산
export function calculateStatistics(transactions: TransactionData[]): StatisticsData {
  if (transactions.length === 0) {
    return {
      period: '',
      regionLevel: 'dong',
      regionCode: '',
      propertyType: '',
      dealType: '',
      count: 0,
      avgPrice: 0,
      medianPrice: 0,
      avgPricePerM2: 0,
      minPrice: 0,
      maxPrice: 0,
      totalArea: 0,
      avgArea: 0
    }
  }

  const prices = transactions.map(t => t.price).filter(p => p > 0)
  const areas = transactions.map(t => t.areaM2).filter(a => a > 0)
  const pricesPerM2 = transactions
    .filter(t => t.price > 0 && t.areaM2 > 0)
    .map(t => t.price / t.areaM2)

  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0
  const medianPrice = prices.length > 0 ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] : 0
  const avgPricePerM2 = pricesPerM2.length > 0 ? pricesPerM2.reduce((a, b) => a + b, 0) / pricesPerM2.length : 0
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
  const totalArea = areas.reduce((a, b) => a + b, 0)
  const avgArea = areas.length > 0 ? totalArea / areas.length : 0

  return {
    period: transactions[0]?.dealDate?.substring(0, 7) || '',
    regionLevel: 'dong',
    regionCode: transactions[0]?.bjdCode || '',
    propertyType: transactions[0]?.propertyType || '',
    dealType: transactions[0]?.dealType || '',
    count: transactions.length,
    avgPrice,
    medianPrice,
    avgPricePerM2,
    minPrice,
    maxPrice,
    totalArea,
    avgArea
  }
}

// 시장 동향 분석
export function analyzeMarketTrend(currentStats: StatisticsData, previousStats?: StatisticsData): 'up' | 'down' | 'stable' {
  if (!previousStats || previousStats.avgPrice === 0) return 'stable'
  
  const changeRate = (currentStats.avgPrice - previousStats.avgPrice) / previousStats.avgPrice * 100
  
  if (changeRate > 2) return 'up'
  if (changeRate < -2) return 'down'
  return 'stable'
}

// 월 범위 조회 + 통계/최근 거래
export async function loadRegionDeals({
  regionCode,
  from = '2024-01',
  to = '2024-12',
  dealType = 'sale',
  serviceKey
}: {
  regionCode: string
  from?: string
  to?: string
  dealType: 'sale' | 'jeonse' | 'wolse'
  serviceKey: string
}) {
  let all: TransactionData[] = []

  for (const { y, m } of monthRange(from, to)) {
    try {
      // 성능을 위해 적절한 limit 사용
      const chunk = dealType === 'sale'
        ? await getApartmentSaleData({ year: y, month: m, regionCode, limit: 100 }) 
        : await getApartmentRentData({ year: y, month: m, regionCode, limit: 100 })

      // 전월세에서 dealType 필터(jeonse/wolse)로 좁히기
      if (dealType !== 'sale') {
        all.push(...chunk.filter(x => (dealType === 'jeonse' ? !x.monthlyRent : !!x.monthlyRent)))
      } else {
        all.push(...chunk)
      }
    } catch (error) {
      console.warn(`${y}-${m} 데이터 조회 실패:`, error)
      // 개별 월 조회 실패 시에도 계속 진행
    }
  }

  // 최신 거래 정렬 (날짜 desc)
  all.sort((a, b) => (a.dealDate < b.dealDate ? 1 : -1))
  const recentTransactions = all // 10건 제한 제거, 모든 거래 표시

  // 네이버부동산 URL 추가 (최근 거래만)
  const enrichedTransactions = await enrichWithNaverUrls(recentTransactions)

  // 통계 계산
  const statistics = calculateStatistics(all)
  
  console.log(`전체 거래 건수: ${all.length}, 최근 거래: ${enrichedTransactions.length}건`)

  return { recentTransactions: enrichedTransactions, statistics, count: all.length }
}

// 거래 데이터에 네이버부동산 URL 추가
async function enrichWithNaverUrls(transactions: TransactionData[]): Promise<TransactionData[]> {
  console.log('네이버 URL 추가 시작, 거래 수:', transactions.length);
  
  // 성능을 위해 최근 거래 10건만 네이버 URL 추가
  const recentTransactions = transactions.slice(0, 10);
  const remainingTransactions = transactions.slice(10);
  
  console.log(`최근 10건에만 네이버 URL 추가, 나머지 ${remainingTransactions.length}건은 기본 데이터만`);
  
  // 최근 거래에만 네이버 URL 추가 시도
  const enriched = await Promise.all(
    recentTransactions.map(async (transaction, index) => {
      try {
        // API 호출 제한을 피하기 위해 지연 추가
        if (index > 0 && index % 3 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 아파트명 추출 개선
        let aptName = '';
        
        // 1. TransactionData의 aptName 필드 확인
        if (transaction.aptName && transaction.aptName.length > 2) {
          aptName = transaction.aptName;
        }
        
        // 2. 원본 데이터에서 아파트명 필드 확인
        if (!aptName) {
          const originalAptName = pick(transaction as any, 'aptName', '아파트', 'aptNm');
          if (originalAptName && originalAptName.length > 2) {
            aptName = originalAptName;
          }
        }
        
        // 3. 주소에서 아파트명 추출 (지번 제외)
        if (!aptName) {
          const addressParts = transaction.address.split(' ');
          // 마지막 부분이 지번(숫자-숫자 형태)이면 제외
          const lastPart = addressParts[addressParts.length - 1];
          if (!/^\d+-\d+$/.test(lastPart) && lastPart.length > 1) {
            aptName = lastPart;
          } else if (addressParts.length > 1) {
            aptName = addressParts[addressParts.length - 2];
          }
        }
        
        console.log(`[${index}] 추출된 아파트명:`, aptName);
        
        // 아파트명이 너무 짧거나 지번 형태면 건너뛰기
        if (!aptName || aptName.length < 2 || /^\d+-\d+$/.test(aptName)) {
          console.log(`[${index}] 유효하지 않은 아파트명, 건너뛰기:`, aptName);
          return transaction;
        }
        
        // 법정동 10자리 코드 추출
        const dong10 = deriveDongCortarNoFrom(transaction.bjdCode, transaction.dong);
        console.log(`[${index}] 법정동 10자리 코드:`, dong10);
        
        if (dong10 && aptName) {
          console.log(`[${index}] 네이버부동산 단지 검색 시작...`);
          // 네이버부동산에서 단지 번호 찾기
          const hit = await findComplexNoByDong(dong10, aptName);
          
          if (hit) {
            // 단지 중심 좌표 가져오기
            const center = await fetchComplexCenter(hit.complexNo);
            console.log(`[${index}] 단지 중심 좌표:`, center);
            
            // 거래 유형에 따른 매물 번호 가져오기
            const tradeType = toNaverTradeType(transaction.dealType);
            const articleNo = await fetchComplexTopArticleNo(hit.complexNo, tradeType);
            console.log(`[${index}] 매물 번호:`, articleNo);
            
            // 네이버부동산 URL 생성 (좌표와 매물 번호 포함)
            const naverUrl = buildNaverLandUrlWithParams(hit.complexNo, {
              ms: center ? { lat: center.lat, lon: center.lon, zoom: 16 } : undefined,
              articleNo: articleNo || undefined,
              a: 'APT'
            });
            
            const naverUrlMobile = buildNaverLandMobileUrl(hit.complexNo, articleNo || undefined);
            
            console.log(`[${index}] 네이버 URL 생성 완료:`, { naverUrl, naverUrlMobile });
            
            return {
              ...transaction,
              naverComplexNo: hit.complexNo,
              naverUrl: naverUrl,
              naverUrlMobile: naverUrlMobile
            };
          } else {
            console.log(`[${index}] 네이버부동산에서 단지를 찾지 못함`);
          }
        } else {
          console.log(`[${index}] 조건 불충족:`, { dong10, aptName });
        }
        
        return transaction;
      } catch (error) {
        console.warn(`[${index}] 네이버 URL 추가 실패:`, error);
        return transaction;
      }
    })
  );
  
  // 나머지 거래는 그대로 추가
  const allTransactions = [...enriched, ...remainingTransactions];
  
  const withNaverUrl = enriched.filter(t => t.naverUrl);
  console.log('네이버 URL 추가 완료. 네이버 URL이 있는 거래 수:', withNaverUrl.length);
  
  return allTransactions;
}
