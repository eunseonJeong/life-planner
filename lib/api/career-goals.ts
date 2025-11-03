import { CareerGoal, CareerGoalFormData } from '@/types/career'

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
  count?: number
}

export async function createCareerGoal(data: CareerGoalFormData, userId: string): Promise<ApiResponse<CareerGoal[]>> {
  try {
    const response = await fetch('/api/career-goals', {
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
      throw new Error(result.error || '커리어 목표 저장에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('커리어 목표 저장 중 오류:', error)
    throw error
  }
}

export async function updateCareerGoal(data: CareerGoalFormData & { id: string }, userId: string): Promise<ApiResponse<CareerGoal[]>> {
  try {
    const response = await fetch('/api/career-goals', {
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
      throw new Error(result.error || '커리어 목표 수정에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('커리어 목표 수정 중 오류:', error)
    throw error
  }
}

export async function deleteCareerGoal(id: string, userId: string): Promise<ApiResponse<CareerGoal[]>> {
  try {
    const response = await fetch('/api/career-goals', {
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
      throw new Error(result.error || '커리어 목표 삭제에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('커리어 목표 삭제 중 오류:', error)
    throw error
  }
}

export async function getCareerGoals(userId: string): Promise<ApiResponse<CareerGoal[]>> {
  try {
    const response = await fetch(`/api/career-goals?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '커리어 목표 조회에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('커리어 목표 조회 중 오류:', error)
    throw error
  }
}
