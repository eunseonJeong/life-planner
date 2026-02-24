import { NextRequest, NextResponse } from 'next/server'
import { buildAccountsFromSnapshot, findLatestFinancialSnapshot, resolveUserIdFromRequest } from '@/lib/server/accounts'

export async function GET(request: NextRequest) {
  try {
    const userId = resolveUserIdFromRequest(request)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.',
        },
        { status: 400 }
      )
    }

    const snapshot = await findLatestFinancialSnapshot(userId)
    const accounts = buildAccountsFromSnapshot(snapshot)
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

    return NextResponse.json({
      success: true,
      data: {
        accounts,
        totalBalance,
        currency: 'KRW',
      },
      message: '계좌 목록을 성공적으로 조회했습니다.',
    })
  } catch (error) {
    console.error('계좌 목록 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '계좌 목록 조회에 실패했습니다.',
      },
      { status: 500 }
    )
  }
}
