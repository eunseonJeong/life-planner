/**
 * 날짜 형식 변환 유틸리티
 */

/**
 * 날짜 문자열을 YYYY.MM.DD 형식으로 변환
 * @param dateStr - YYYYMMDD 또는 YYYY-MM-DD 형식의 날짜 문자열
 * @returns YYYY.MM.DD 형식의 문자열
 */
export function formatDateDot(dateStr: string | undefined | null): string {
  if (!dateStr) return '-'
  
  // YYYY-MM-DD 형식 처리
  if (dateStr.includes('-')) {
    return dateStr.replace(/-/g, '.')
  }
  
  // YYYYMMDD 형식 처리
  if (dateStr.length >= 8) {
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    return `${year}.${month}.${day}`
  }
  
  return dateStr
}

/**
 * 날짜 문자열을 YYYY년 MM월 DD일 형식으로 변환
 * @param dateStr - YYYYMMDD 또는 YYYY-MM-DD 형식의 날짜 문자열
 * @returns YYYY년 MM월 DD일 형식의 문자열
 */
export function formatDateKorean(dateStr: string | undefined | null): string {
  if (!dateStr) return '-'
  
  let year: string, month: string, day: string
  
  // YYYY-MM-DD 형식 처리
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-')
    year = parts[0]
    month = parts[1]
    day = parts[2]
  } else if (dateStr.length >= 8) {
    // YYYYMMDD 형식 처리
    year = dateStr.substring(0, 4)
    month = dateStr.substring(4, 6)
    day = dateStr.substring(6, 8)
  } else {
    return dateStr
  }
  
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 숫자를 한국 통화 형식으로 변환
 * @param amount - 금액 (숫자 또는 문자열)
 * @param suffix - 접미사 (기본값: '원')
 * @returns 포맷된 통화 문자열
 */
export function formatCurrency(
  amount: number | string | undefined | null,
  suffix: string = '원'
): string {
  if (amount === undefined || amount === null || amount === '') return '-'
  
  const num = typeof amount === 'string' ? parseInt(amount, 10) : amount
  
  if (isNaN(num)) return '-'
  
  return new Intl.NumberFormat('ko-KR').format(num) + suffix
}

/**
 * 숫자를 만원 단위로 변환하여 표시
 * @param amount - 금액 (만원 단위)
 * @returns 포맷된 금액 문자열
 */
export function formatPriceInManwon(
  amount: number | string | undefined | null
): string {
  if (amount === undefined || amount === null || amount === '') return '-'
  
  const num = typeof amount === 'string' ? parseInt(amount, 10) : amount
  
  if (isNaN(num)) return '-'
  
  // 억 단위 변환
  if (num >= 10000) {
    const uk = Math.floor(num / 10000)
    const manwon = num % 10000
    if (manwon > 0) {
      return `${uk}억 ${new Intl.NumberFormat('ko-KR').format(manwon)}만원`
    }
    return `${uk}억원`
  }
  
  return `${new Intl.NumberFormat('ko-KR').format(num)}만원`
}

