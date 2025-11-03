import { FinancialData, FinancialFormData } from '@/types/finance'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 자산 정보 조회
export async function getFinancialData(userId: string): Promise<ApiResponse<FinancialData>> {
  try {
    const response = await fetch(`/api/finance?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '자산 정보 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('자산 정보 조회 오류:', error)
    throw error
  }
}

// 자산 정보 저장/수정
export async function saveFinancialData(data: FinancialFormData, userId: string): Promise<ApiResponse<FinancialData>> {
  try {
    const response = await fetch('/api/finance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, userId }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '자산 정보 저장에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('자산 정보 저장 오류:', error)
    throw error
  }
}
