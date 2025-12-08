import { Notification, NotificationResponse } from '@/types/notifications'
import { getCurrentUserId } from '@/lib/auth'

const API_BASE = '/api/notifications'

/**
 * 알림 목록 조회
 */
export async function getNotifications(
  userId: string | null,
  options?: { unreadOnly?: boolean; limit?: number }
): Promise<NotificationResponse> {
  // 로그인하지 않은 경우 조기 반환
  if (!userId) {
    return {
      success: false,
      data: [],
      error: '로그인이 필요합니다.',
    }
  }

  try {
    const params = new URLSearchParams()
    if (options?.unreadOnly) params.append('unreadOnly', 'true')
    if (options?.limit) params.append('limit', options.limit.toString())

    const response = await fetch(`${API_BASE}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
    })

    if (!response.ok) {
      // 401 에러는 조용히 처리
      if (response.status === 401) {
        return { success: false, data: [], error: '인증이 필요합니다.' }
      }
      throw new Error('알림 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('알림 조회 스킵:', error instanceof Error ? error.message : error)
    }
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : '알림 조회에 실패했습니다.',
    }
  }
}

/**
 * 알림 체크 및 생성
 */
export async function checkNotifications(userId: string | null): Promise<NotificationResponse> {
  // 로그인하지 않은 경우 조기 반환
  if (!userId) {
    return {
      success: false,
      error: '로그인이 필요합니다.',
    }
  }

  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ action: 'check' }),
    })

    if (!response.ok) {
      // 401 에러는 조용히 처리
      if (response.status === 401) {
        return { success: false, error: '인증이 필요합니다.' }
      }
      throw new Error('알림 체크에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    // 네트워크 에러나 인증 에러는 로그만 남기고 조용히 처리
    if (process.env.NODE_ENV === 'development') {
      console.warn('알림 체크 스킵:', error instanceof Error ? error.message : error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : '알림 체크에 실패했습니다.',
    }
  }
}

/**
 * 알림 읽음 처리
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    const response = await fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ id: notificationId }),
    })

    if (!response.ok) {
      throw new Error('알림 읽음 처리에 실패했습니다.')
    }

    return { success: true }
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알림 읽음 처리에 실패했습니다.',
    }
  }
}

/**
 * 모든 알림 읽음 처리
 */
export async function markAllNotificationsAsRead(): Promise<{ success: boolean; error?: string }> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      return { success: false, error: '로그인이 필요합니다.' }
    }

    const response = await fetch(API_BASE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
      body: JSON.stringify({ markAllAsRead: true }),
    })

    if (!response.ok) {
      throw new Error('알림 읽음 처리에 실패했습니다.')
    }

    return { success: true }
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알림 읽음 처리에 실패했습니다.',
    }
  }
}

