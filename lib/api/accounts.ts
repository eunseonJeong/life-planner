import { AccountsPayload } from '@/types/account'

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export async function getAccounts(userId: string, fintechUseNum?: string): Promise<ApiResponse<AccountsPayload>> {
  try {
    const query = new URLSearchParams()
    query.set('userId', userId)
    if (fintechUseNum) {
      query.set('fintech_use_num', fintechUseNum)
    }

    const response = await fetch(`/api/accounts?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계좌 목록 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계좌 목록 조회 오류:', error)
    throw error
  }
}

export async function getAccountBalance(userId: string, accountId: string) {
  try {
    const response = await fetch(`/api/accounts/${accountId}/balance?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
      },
    })

    const result = await response.json()

    if (!response.ok) {
      const error = new Error(result.error || '계좌 잔액 조회에 실패했습니다.')
      ;(error as any).response = { data: result }
      throw error
    }

    return result
  } catch (error) {
    console.error('계좌 잔액 조회 오류:', error)
    throw error
  }
}
