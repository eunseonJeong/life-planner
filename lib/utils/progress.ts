/**
 * 진행률 계산 유틸리티 함수들
 */

/**
 * 기본 진행률 계산 (현재값 / 목표값)
 * @param current 현재값
 * @param target 목표값
 * @returns 진행률 (0-100)
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0
  if (current < 0) return 0
  return Math.min((current / target) * 100, 100)
}

/**
 * 전체 진행률 계산 (완료된 항목 수 / 전체 항목 수)
 * @param completed 완료된 항목 수
 * @param total 전체 항목 수
 * @returns 진행률 (0-100)
 */
export function calculateOverallProgress(completed: number, total: number): number {
  if (total <= 0) return 0
  if (completed < 0) return 0
  return Math.min((completed / total) * 100, 100)
}

/**
 * 목표별 진행률 계산
 * @param goal 목표 객체 (currentValue, targetValue 속성 필요)
 * @returns 진행률 (0-100)
 */
export function calculateGoalProgress(goal: { currentValue: number; targetValue: number }): number {
  return calculateProgress(goal.currentValue, goal.targetValue)
}

/**
 * 생애주기별 진행률 계산
 * @param stages 생애주기 배열 (currentAmount, targetAmount 속성 필요)
 * @returns 전체 진행률 (0-100)
 */
export function calculateLifeStageProgress(stages: Array<{ currentAmount: number; targetAmount: number }>): number {
  if (stages.length === 0) return 0
  
  const totalCurrent = stages.reduce((sum, stage) => sum + stage.currentAmount, 0)
  const totalTarget = stages.reduce((sum, stage) => sum + stage.targetAmount, 0)
  
  return calculateProgress(totalCurrent, totalTarget)
}

/**
 * 목표 상태별 진행률 계산
 * @param goals 목표 배열 (status 속성 필요)
 * @returns { completed: number, total: number, progress: number }
 */
export function calculateGoalsProgress(goals: Array<{ status: string }>) {
  const total = goals.length
  const completed = goals.filter(goal => goal.status === 'completed').length
  const progress = calculateOverallProgress(completed, total)
  
  return {
    completed,
    total,
    progress
  }
}
