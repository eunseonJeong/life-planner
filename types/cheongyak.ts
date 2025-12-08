// 청약홈 분양정보 관련 타입 정의

export interface CheongyakItem {
  id: string
  houseManageNo: string // 주택관리번호
  pblancNo: string // 공고번호
  houseNm: string // 주택명
  houseSecdNm: string // 주택구분코드명 (APT, 오피스텔 등)
  houseSecd: string // 주택구분코드
  houseDtlSecdNm: string // 주택상세구분코드명
  rcritPblancDe: string // 모집공고일
  rcritPblancEndDe: string // 모집공고종료일
  przwnerPresnatnDe: string // 당첨자발표일
  cntrctCnclsBgnde: string // 계약시작일
  cntrctCnclsEndde: string // 계약종료일
  hssplyZip: string // 주소 우편번호
  hssplyAdres: string // 주소
  totSuplyHshldco: number // 총공급세대수
  rcritPblancDtlSecdNm: string // 모집공고상세구분코드명
  mdhsTelno: string // 문의전화번호
  bsnsMbyNm: string // 사업주체명
  mdhsTpcdNm: string // 문의유형코드명
  mvnPrearngeYm: string // 입주예정월
  specltRdnEarthAtndNm: string // 특별공급지구명
  subscrptAreaCodeNm?: string // 공급지역명
  hmpgAdres?: string // 홈페이지 주소
  cnstrctEntrpsNm?: string // 시공사명
  pblancUrl?: string // 분양정보 URL
  houseSecdNmDetail?: string // 주택구분상세명
  houseDtlSecdNmDetail?: string // 주택상세구분상세명
  [key: string]: any // 추가 필드 (API 응답의 원본 필드)
}

export interface CheongyakDetail extends CheongyakItem {
  // 상세 정보 추가 필드
  houseTyNm?: string // 주택형명
  suplyPrvuseAr?: number // 공급전용면적
  suplyCmnuseAr?: number // 공급공용면적
  suplyTotAr?: number // 공급전체면적
  prtpce?: number // 분양가격
  etcPblancMatter?: string // 기타공고사항
  pblancUrl?: string // 공고URL
  houseSecdCd?: string // 주택구분코드
  houseDtlSecdCd?: string // 주택상세구분코드
  rcritPblancSeCd?: string // 모집공고구분코드
  rcritPblancDtlSeCd?: string // 모집공고상세구분코드
  specltRdnEarthAtndCd?: string // 특별공급지구코드
  mdhsTpcd?: string // 문의유형코드
  bsnsMbyCd?: string // 사업주체코드
}

export interface CheongyakListResponse {
  success: boolean
  data?: CheongyakItem[]
  count?: number
  error?: string
}

export interface CheongyakDetailResponse {
  success: boolean
  data?: CheongyakDetail
  error?: string
}

export interface CheongyakQueryParams {
  page?: number
  numOfRows?: number
  houseSecd?: string // 주택구분코드 (01:APT, 02:오피스텔 등)
  rcritPblancSe?: string // 모집공고구분 (01:민간사전청약 등)
  rcritPblancDe?: string // 모집공고일 (YYYYMMDD)
  rcritPblancEndDe?: string // 모집공고종료일
  sido?: string // 시도
  sigungu?: string // 시군구
}

