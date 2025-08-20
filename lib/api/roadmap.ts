import { RoadmapItem } from '@/types/career'

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
  count?: number
}

export async function getRoadmap(userId: string): Promise<ApiResponse<RoadmapItem[]>> {
  try {
    const response = await fetch(`/api/roadmap?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '로드맵 조회에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('로드맵 조회 오류:', error)
    throw error
  }
}

export async function saveRoadmap(roadmap: RoadmapItem[], userId: string): Promise<ApiResponse<RoadmapItem[]>> {
  try {
    const response = await fetch('/api/roadmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        data: roadmap,
        userId
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || '로드맵 저장에 실패했습니다.')
    }

    return result
  } catch (error) {
    console.error('로드맵 저장 오류:', error)
    throw error
  }
}
