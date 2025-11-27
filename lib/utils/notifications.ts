/**
 * 알림 관련 유틸리티 함수
 */

export interface UpcomingDeadline {
  id: string
  title: string
  type: 'goal' | 'milestone' | 'plan'
  targetDate: Date
  daysRemaining: number
  priority: 'high' | 'medium' | 'low'
  category?: string
}

/**
 * 목표 일자까지 남은 일수 계산
 */
export function calculateDaysRemaining(targetDate: Date | string | null | undefined): number | null {
  if (!targetDate) return null
  
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * 알림이 필요한지 확인 (일주일 전, 하루 전, 당일)
 */
export function shouldNotify(daysRemaining: number | null): boolean {
  if (daysRemaining === null) return false
  // 일주일 전(7일), 하루 전(1일), 당일(0일)에 알림
  return daysRemaining >= 0 && daysRemaining <= 7
}

/**
 * 알림 메시지 생성
 */
export function generateNotificationMessage(
  title: string,
  daysRemaining: number,
  type: 'goal' | 'milestone' | 'plan'
): string {
  const typeLabel = type === 'goal' ? '목표' : type === 'milestone' ? '마일스톤' : '계획'
  
  if (daysRemaining === 0) {
    return `${title} ${typeLabel}의 마감일이 오늘입니다!`
  } else if (daysRemaining === 1) {
    return `${title} ${typeLabel}까지 하루 남았습니다.`
  } else if (daysRemaining <= 7) {
    return `${title} ${typeLabel}까지 ${daysRemaining}일 남았습니다.`
  }
  
  return `${title} ${typeLabel}까지 ${daysRemaining}일 남았습니다.`
}

/**
 * 알림 우선순위 결정
 */
export function getNotificationPriority(
  daysRemaining: number,
  itemPriority?: string
): 'high' | 'medium' | 'low' {
  // 마감일이 임박할수록 높은 우선순위
  if (daysRemaining <= 1) return 'high'
  if (daysRemaining <= 3) return 'medium'
  if (itemPriority === 'high') return 'medium'
  return 'low'
}

/**
 * 다가오는 마감일 목록 필터링 및 정렬
 */
export function filterUpcomingDeadlines(
  items: Array<{
    id: string
    title: string
    targetDate: Date | string | null
    priority?: string
    category?: string
    status?: string
  }>,
  type: 'goal' | 'milestone' | 'plan',
  maxDays: number = 7
): UpcomingDeadline[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return items
    .filter(item => {
      // 완료된 항목은 제외
      if (item.status === 'completed' || item.status === 'COMPLETED') return false
      
      const daysRemaining = calculateDaysRemaining(item.targetDate)
      if (daysRemaining === null) return false
      
      // 미래 날짜만 포함 (과거는 제외)
      return daysRemaining >= 0 && daysRemaining <= maxDays
    })
    .map(item => {
      const daysRemaining = calculateDaysRemaining(item.targetDate) || 0
      return {
        id: item.id,
        title: item.title,
        type,
        targetDate: typeof item.targetDate === 'string' 
          ? new Date(item.targetDate) 
          : item.targetDate || new Date(),
        daysRemaining,
        priority: getNotificationPriority(
          daysRemaining,
          item.priority
        ),
        category: item.category,
      }
    })
    .sort((a, b) => {
      // 우선순위 순으로 정렬 (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // 같은 우선순위면 남은 일수가 적은 순
      return a.daysRemaining - b.daysRemaining
    })
}

