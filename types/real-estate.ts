// 공공 API 관련 타입
export interface PublicApiConfig {
  serviceKey: string
  baseUrl: string
}

export interface TransactionData {
  id: string
  dealType: 'sale' | 'jeonse' | 'wolse'
  propertyType: 'apartment' | 'villa' | 'officetel' | 'house'
  dealDate: string
  price: number
  deposit?: number
  monthlyRent?: number
  areaM2: number
  floor: number
  yearBuilt: number
  bjdCode: string
  sido: string
  sigungu: string
  dong: string
  address: string
  source: string
  aptName?: string // 아파트명
  detailUrl?: string // 실거래가 공개시스템 링크
  naverComplexNo?: string // 네이버부동산 단지 번호
  naverUrl?: string // 네이버부동산 데스크톱 URL
  naverUrlMobile?: string // 네이버부동산 모바일 URL
}

export interface RegionCode {
  bjdCode: string
  sido: string
  sigungu: string
  dong: string
  hierarchy: string
  fullName: string
}

export interface StatisticsData {
  period: string
  regionLevel: 'sido' | 'sigungu' | 'dong'
  regionCode: string
  propertyType: string
  dealType: string
  count: number
  avgPrice: number
  medianPrice: number
  avgPricePerM2: number
  minPrice: number
  maxPrice: number
  totalArea: number
  avgArea: number
}

export interface RealEstateData {
  region: string
  regionCode: string
  propertyType: string
  dealType: string
  period: string
  statistics: StatisticsData
  recentTransactions: TransactionData[]
  marketTrend: 'up' | 'down' | 'stable'
  lastUpdated: string
}

export interface RegionOption {
  value: string
  label: string
  category: string
  bjdCode: string
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
  count?: number
}

export interface ApiQueryParams {
  dealType?: 'sale' | 'jeonse' | 'wolse'
  propertyType?: 'apartment' | 'villa' | 'officetel' | 'house'
  regionLevel?: 'sido' | 'sigungu' | 'dong'
  regionCode?: string
  from?: string // YYYY-MM
  to?: string // YYYY-MM
  areaMin?: number
  areaMax?: number
  normalization?: 'per_m2' | 'none'
  aggregation?: 'mean' | 'median'
  wolseConvertRate?: number
  page?: number
  limit?: number
}
