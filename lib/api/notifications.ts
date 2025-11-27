import { Notification, NotificationResponse } from '@/types/notifications'
import { getCurrentUserId } from '@/lib/auth'

const API_BASE = '/api/notifications'

/**
 * 알림 목록 조회
 */
export async function getNotifications(
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number }
): Promise<NotificationResponse> {
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
      throw new Error('알림 조회에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('알림 조회 실패:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '알림 조회에 실패했습니다.',
    }
  }
}

/**
 * 알림 체크 및 생성
 */
export async function checkNotifications(userId: string): Promise<NotificationResponse> {
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
      throw new Error('알림 체크에 실패했습니다.')
    }

    return await response.json()
  } catch (error) {
    console.error('알림 체크 실패:', error)
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

