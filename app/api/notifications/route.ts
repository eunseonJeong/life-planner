import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserIdFromRequest } from '@/lib/auth'
import { 
  filterUpcomingDeadlines, 
  generateNotificationMessage,
  calculateDaysRemaining 
} from '@/lib/utils/notifications'

/**
 * GET /api/notifications
 * 사용자의 알림 목록 조회
 */
export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')

    // 기존 알림 조회
    const where = {
      userId,
      ...(unreadOnly && { isRead: false }),
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    })

    return NextResponse.json({
      success: true,
      data: notifications,
      count: notifications.length,
      unreadCount,
    })
  } catch (error) {
    console.error('알림 조회 실패:', error)
    return NextResponse.json(
      { error: '알림 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/notifications
 * 새로운 알림 생성 또는 알림 체크 및 생성
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { action } = body

    // 알림 체크 및 자동 생성
    if (action === 'check') {
      const newNotifications = await checkAndCreateNotifications(userId)
      return NextResponse.json({
        success: true,
        data: newNotifications,
        count: newNotifications.length,
      })
    }

    // 수동 알림 생성
    const { type, title, message, relatedId, relatedType } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        relatedId: relatedId || null,
        relatedType: relatedType || null,
        isRead: false,
      },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('알림 생성 실패:', error)
    return NextResponse.json(
      { error: '알림 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/notifications
 * 알림 읽음 처리
 */
export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, markAllAsRead } = body

    if (markAllAsRead) {
      // 모든 알림 읽음 처리
      await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      })

      return NextResponse.json({
        success: true,
        message: '모든 알림을 읽음 처리했습니다.',
      })
    }

    if (!id) {
      return NextResponse.json(
        { error: '알림 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 단일 알림 읽음 처리
    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    console.error('알림 업데이트 실패:', error)
    return NextResponse.json(
      { error: '알림 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

/**
 * 목표, 마일스톤, 계획을 체크하여 알림 생성
 */
async function checkAndCreateNotifications(userId: string) {
  const newNotifications = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. 목표 체크
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      status: { not: 'COMPLETED' },
      targetDate: { not: null },
    },
  })

  for (const goal of goals) {
    if (!goal.targetDate) continue
    
    const daysRemaining = calculateDaysRemaining(goal.targetDate)
    if (daysRemaining === null || daysRemaining < 0 || daysRemaining > 7) continue

    // 이미 오늘 생성된 알림이 있는지 확인
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        relatedId: goal.id,
        relatedType: 'goal',
        createdAt: {
          gte: new Date(today),
        },
      },
    })

    if (existingNotification) continue

    const message = generateNotificationMessage(goal.title, daysRemaining, 'goal')
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'goal_reminder',
        title: goal.title,
        message,
        relatedId: goal.id,
        relatedType: 'goal',
        isRead: false,
      },
    })

    newNotifications.push(notification)
  }

  // 2. 마일스톤 체크
  const milestones = await prisma.milestone.findMany({
    where: {
      goal: { userId },
      status: { not: 'COMPLETED' },
      dueDate: { not: null },
    },
    include: { goal: true },
  })

  for (const milestone of milestones) {
    if (!milestone.dueDate) continue
    
    const daysRemaining = calculateDaysRemaining(milestone.dueDate)
    if (daysRemaining === null || daysRemaining < 0 || daysRemaining > 7) continue

    // 이미 오늘 생성된 알림이 있는지 확인
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        relatedId: milestone.id,
        relatedType: 'milestone',
        createdAt: {
          gte: new Date(today),
        },
      },
    })

    if (existingNotification) continue

    const message = generateNotificationMessage(milestone.title, daysRemaining, 'milestone')
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'milestone_reminder',
        title: milestone.title,
        message,
        relatedId: milestone.id,
        relatedType: 'milestone',
        isRead: false,
      },
    })

    newNotifications.push(notification)
  }

  // 3. 계획 체크
  const plans = await prisma.plan.findMany({
    where: {
      userId,
      status: { not: 'COMPLETED' },
      dueDate: { not: null },
    },
  })

  for (const plan of plans) {
    if (!plan.dueDate) continue
    
    const daysRemaining = calculateDaysRemaining(plan.dueDate)
    if (daysRemaining === null || daysRemaining < 0 || daysRemaining > 7) continue

    // 이미 오늘 생성된 알림이 있는지 확인
    const existingNotification = await prisma.notification.findFirst({
      where: {
        userId,
        relatedId: plan.id,
        relatedType: 'plan',
        createdAt: {
          gte: new Date(today),
        },
      },
    })

    if (existingNotification) continue

    const message = generateNotificationMessage(plan.title, daysRemaining, 'plan')
    
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: 'plan_reminder',
        title: plan.title,
        message,
        relatedId: plan.id,
        relatedType: 'plan',
        isRead: false,
      },
    })

    newNotifications.push(notification)
  }

  return newNotifications
}

