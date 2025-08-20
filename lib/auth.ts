// 임시 사용자 ID 관리 (실제로는 인증 시스템에서 가져와야 함)
let currentUserId: string | null = null

export function getCurrentUserId(): string {
  if (!currentUserId) {
    // 로컬 스토리지에서 실제 사용자 ID 확인 (auth 페이지에서 설정)
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      currentUserId = storedUserId
    } else {
      // 임시 사용자 ID 생성 (데이터베이스에 존재하지 않음)
      currentUserId = `temp_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('tempUserId', currentUserId)
    }
  }
  return currentUserId
}

export function setCurrentUserId(userId: string): void {
  currentUserId = userId
  localStorage.setItem('tempUserId', userId)
}

export function clearCurrentUserId(): void {
  currentUserId = null
  localStorage.removeItem('tempUserId')
}
