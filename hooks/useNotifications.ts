'use client'

import { useState, useEffect, useCallback } from 'react'
import { getNotifications, checkNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/api/notifications'
import { getCurrentUserId } from '@/lib/auth'
import type { Notification } from '@/types/notifications'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  checkForNewNotifications: () => Promise<void>
}

/**
 * 알림 관리를 위한 커스텀 훅
 * 클라이언트 사이드 폴링을 통해 주기적으로 알림을 체크합니다.
 */
export function useNotifications(pollInterval: number = 5 * 60 * 1000): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = useCallback(async () => {
    const userId = getCurrentUserId()
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getNotifications(userId, { limit: 50 })
      if (response.success && response.data) {
        setNotifications(response.data)
        setUnreadCount(response.unreadCount || 0)
      } else {
        setError(response.error || '알림을 불러오는데 실패했습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알림을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkForNewNotifications = useCallback(async () => {
    const userId = getCurrentUserId()
    if (!userId) return

    try {
      const response = await checkNotifications(userId)
      if (response.success) {
        // 새 알림이 생성되었으면 목록 새로고침
        await loadNotifications()
        
        // 브라우저 알림 권한이 있으면 알림 표시
        if (response.data && response.data.length > 0 && 'Notification' in window) {
          const NotificationAPI = window.Notification as typeof Notification
          if (NotificationAPI.permission === 'granted') {
            response.data.forEach((notification) => {
              new NotificationAPI(notification.title, {
                body: notification.message,
                icon: '/LP_favicon.svg',
                tag: notification.id,
              })
            })
          }
        }
      }
    } catch (err) {
      console.error('알림 체크 실패:', err)
    }
  }, [loadNotifications])

  const markAsRead = useCallback(async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    const result = await markAllNotificationsAsRead()
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      )
      setUnreadCount(0)
    }
  }, [])

  // 초기 로드 및 주기적 폴링
  useEffect(() => {
    loadNotifications()
    checkForNewNotifications()

    // 주기적으로 알림 체크 (기본 5분)
    const interval = setInterval(() => {
      checkForNewNotifications()
    }, pollInterval)

    // 페이지 포커스 시 알림 체크
    const handleFocus = () => {
      checkForNewNotifications()
    }
    window.addEventListener('focus', handleFocus)

    // 브라우저 알림 권한 요청
    if ('Notification' in window) {
      const NotificationAPI = window.Notification as typeof Notification
      if (NotificationAPI.permission === 'default') {
        NotificationAPI.requestPermission()
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleFocus)
    }
  }, [loadNotifications, checkForNewNotifications, pollInterval])

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: loadNotifications,
    markAsRead,
    markAllAsRead,
    checkForNewNotifications,
  }
}

