import { NextRequest, NextResponse } from 'next/server'
import { buildAccountsFromSnapshot, findLatestFinancialSnapshot, resolveUserIdFromRequest } from '@/lib/server/accounts'

type Params = {
  params: Promise<{ accountId: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const userId = resolveUserIdFromRequest(request)
    const { accountId } = await params

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
    const account = buildAccountsFromSnapshot(snapshot).find((item) => item.id === accountId)

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: '계좌 정보를 찾을 수 없습니다.',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        accountId: account.id,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
        lastUpdated: account.lastUpdated,
      },
      message: '계좌 잔액을 성공적으로 조회했습니다.',
    })
  } catch (error) {
    console.error('계좌 잔액 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '계좌 잔액 조회에 실패했습니다.',
      },
      { status: 500 }
    )
  }
}
