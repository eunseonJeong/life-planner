export interface Notification {
  id: string
  userId: string
  type: 'goal_reminder' | 'milestone_reminder' | 'plan_reminder'
  title: string
  message: string
  relatedId: string | null
  relatedType: 'goal' | 'milestone' | 'plan' | null
  isRead: boolean
  createdAt: string
  readAt: string | null
}

export interface NotificationResponse {
  success: boolean
  data?: Notification[]
  count?: number
  unreadCount?: number
  error?: string
}

export interface UpcomingDeadline {
  id: string
  title: string
  type: 'goal' | 'milestone' | 'plan'
  targetDate: string
  daysRemaining: number
  priority: 'high' | 'medium' | 'low'
  category?: string
}

