import { Goal, GoalFormData } from '@/types/goals'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 목표 목록 조회
export async function getGoals(userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const response = await fetch(`/api/goals?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '목표 목록 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('목표 목록 조회 오류:', error)
    throw error
  }
}

// 목표 목록 전체 저장
export async function saveGoals(data: Goal[], userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const response = await fetch('/api/goals', {
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
      const error = new Error(result.error || '목표 목록 저장에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('목표 목록 저장 오류:', error)
    throw error
  }
}

// 새로운 목표 추가
export async function addGoal(data: Omit<GoalFormData, 'id'>, userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const response = await fetch('/api/goals', {
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
      const error = new Error(result.error || '목표 추가에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('목표 추가 오류:', error)
    throw error
  }
}

// 목표 수정
export async function updateGoal(data: GoalFormData, userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const response = await fetch('/api/goals', {
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
      const error = new Error(result.error || '목표 수정에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('목표 수정 오류:', error)
    throw error
  }
}

// 목표 삭제
export async function deleteGoal(id: string, userId: string): Promise<ApiResponse<Goal[]>> {
  try {
    const response = await fetch('/api/goals', {
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
      const error = new Error(result.error || '목표 삭제에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('목표 삭제 오류:', error)
    throw error
  }
}
