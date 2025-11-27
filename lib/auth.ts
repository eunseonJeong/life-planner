// 임시 사용자 ID 관리 (실제로는 인증 시스템에서 가져와야 함)
let currentUserId: string | null = null

/**
 * 클라이언트 사이드에서 사용자 ID 가져오기
 * localStorage를 사용하므로 브라우저 환경에서만 작동
 */
export function getCurrentUserId(): string {
  // 서버 사이드에서는 localStorage를 사용할 수 없음
  if (typeof window === 'undefined') {
    throw new Error('getCurrentUserId()는 클라이언트 사이드에서만 사용할 수 있습니다. 서버 사이드에서는 getUserIdFromRequest()를 사용하세요.')
  }

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

/**
 * 서버 사이드(API 라우트)에서 사용자 ID 가져오기
 * 요청 헤더나 쿠키에서 사용자 ID를 읽음
 */
export function getUserIdFromRequest(request: { headers: Headers | { get: (name: string) => string | null } }): string | null {
  const headers = request.headers
  
  // 헤더에서 사용자 ID 가져오기
  const userId = headers.get('x-user-id') || headers.get('user-id')
  
  if (userId) {
    return userId
  }

  // 쿠키에서 사용자 ID 가져오기 (선택적)
  const cookieHeader = headers.get('cookie')
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)
    
    if (cookies['userId']) {
      return cookies['userId']
    }
  }

  return null
}

export function setCurrentUserId(userId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  currentUserId = userId
  localStorage.setItem('tempUserId', userId)
}

export function clearCurrentUserId(): void {
  if (typeof window === 'undefined') {
    return
  }
  currentUserId = null
  localStorage.removeItem('tempUserId')
}
