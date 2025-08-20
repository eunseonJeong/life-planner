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
      body: JSON.stringify({ ...data, userId }),
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
