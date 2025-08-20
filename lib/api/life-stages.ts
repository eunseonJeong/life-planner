import { LifeStage, LifeStageFormData } from '@/types/finance'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 생애주기별 자금 계획 조회
export async function getLifeStages(userId: string): Promise<ApiResponse<LifeStage[]>> {
  try {
    const response = await fetch(`/api/life-stages?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '생애주기별 자금 계획 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('생애주기별 자금 계획 조회 오류:', error)
    throw error
  }
}

// 생애주기별 자금 계획 전체 저장
export async function saveLifeStages(data: LifeStage[], userId: string): Promise<ApiResponse<LifeStage[]>> {
  try {
    const response = await fetch('/api/life-stages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        data,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '생애주기별 자금 계획 저장에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('생애주기별 자금 계획 저장 오류:', error)
    throw error
  }
}

// 새로운 생애주기 항목 추가
export async function addLifeStage(data: Omit<LifeStageFormData, 'id'>, userId: string): Promise<ApiResponse<LifeStage[]>> {
  try {
    const response = await fetch('/api/life-stages', {
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
      const error = new Error(result.error || '생애주기 항목 추가에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('생애주기 항목 추가 오류:', error)
    throw error
  }
}

// 생애주기 항목 수정
export async function updateLifeStage(data: LifeStageFormData, userId: string): Promise<ApiResponse<LifeStage[]>> {
  try {
    const response = await fetch('/api/life-stages', {
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
      const error = new Error(result.error || '생애주기 항목 수정에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('생애주기 항목 수정 오류:', error)
    throw error
  }
}

// 생애주기 항목 삭제
export async function deleteLifeStage(id: string, userId: string): Promise<ApiResponse<LifeStage[]>> {
  try {
    const response = await fetch('/api/life-stages', {
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
      const error = new Error(result.error || '생애주기 항목 삭제에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('생애주기 항목 삭제 오류:', error)
    throw error
  }
}
