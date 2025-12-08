import { CheongyakType } from '@/lib/api/cheongyak'

// 주택 유형 옵션
export const HOUSE_TYPE_OPTIONS: { value: CheongyakType; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'apt', label: 'APT (아파트)' },
  { value: 'officetel', label: '오피스텔/도시형/민간임대' },
  { value: 'remndr', label: 'APT 잔여세대' },
  { value: 'public_rent', label: '공공지원 민간임대' },
  { value: 'optional', label: '임의공급' },
]

// 지역 옵션
export const REGION_OPTIONS = [
  { value: 'all', label: '전체 지역' },
  { value: '서울', label: '서울특별시' },
  { value: '경기', label: '경기도' },
  { value: '인천', label: '인천광역시' },
  { value: '부산', label: '부산광역시' },
  { value: '대구', label: '대구광역시' },
  { value: '광주', label: '광주광역시' },
  { value: '대전', label: '대전광역시' },
  { value: '울산', label: '울산광역시' },
  { value: '세종', label: '세종특별자치시' },
  { value: '강원', label: '강원도' },
  { value: '충북', label: '충청북도' },
  { value: '충남', label: '충청남도' },
  { value: '전북', label: '전라북도' },
  { value: '전남', label: '전라남도' },
  { value: '경북', label: '경상북도' },
  { value: '경남', label: '경상남도' },
  { value: '제주', label: '제주특별자치도' },
] as const

export type RegionValue = typeof REGION_OPTIONS[number]['value']

