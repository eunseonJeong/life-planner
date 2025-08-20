import { CalculatorData, CalculatorFormData } from '@/types/calculator'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 계산기 데이터 목록 조회
export async function getCalculatorData(userId: string): Promise<ApiResponse<CalculatorData[]>> {
  try {
    const response = await fetch(`/api/calculator?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계산기 데이터 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계산기 데이터 조회 오류:', error)
    throw error
  }
}

// 계산기 데이터 목록 전체 저장
export async function saveCalculatorData(data: CalculatorData[]): Promise<ApiResponse<CalculatorData[]>> {
  try {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        data
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계산기 데이터 저장에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계산기 데이터 저장 오류:', error)
    throw error
  }
}

// 새로운 계산기 데이터 추가
export async function addCalculatorData(data: Omit<CalculatorFormData, 'id'>, userId: string): Promise<ApiResponse<CalculatorData[]>> {
  try {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'add',
        data,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계산기 데이터 추가에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계산기 데이터 추가 오류:', error)
    throw error
  }
}

// 계산기 데이터 수정
export async function updateCalculatorData(data: CalculatorFormData, userId: string): Promise<ApiResponse<CalculatorData[]>> {
  try {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update',
        data,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계산기 데이터 수정에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계산기 데이터 수정 오류:', error)
    throw error
  }
}

// 계산기 데이터 삭제
export async function deleteCalculatorData(id: string, userId: string): Promise<ApiResponse<CalculatorData[]>> {
  try {
    const response = await fetch('/api/calculator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        id,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계산기 데이터 삭제에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계산기 데이터 삭제 오류:', error)
    throw error
  }
}
