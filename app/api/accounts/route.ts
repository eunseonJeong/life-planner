import { NextRequest, NextResponse } from 'next/server'
import { AccountSummary } from '@/types/account'

type OpenBankingBalanceResponse = {
  rsp_code?: string
  rsp_message?: string
  bank_name?: string
  fintech_use_num?: string
  balance_amt?: string
  available_amt?: string
  product_name?: string
  account_type?: string
  last_tran_date?: string
}

const OPENBANKING_BASE_URL = process.env.OPENBANKING_BASE_URL || 'https://openapi.openbanking.or.kr'

const pad2 = (n: number) => String(n).padStart(2, '0')

const createTranDtime = () => {
  // OpenBanking spec: YYYYMMDDHHmmss (KST)
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return `${kst.getUTCFullYear()}${pad2(kst.getUTCMonth() + 1)}${pad2(kst.getUTCDate())}${pad2(kst.getUTCHours())}${pad2(kst.getUTCMinutes())}${pad2(kst.getUTCSeconds())}`
}

const createBankTranId = (clientUseCode: string) => {
  const code = clientUseCode.trim()
  if (!/^\d{10}$/.test(code)) {
    throw new Error('OPENBANKING_CLIENT_USE_CODE는 10자리 숫자여야 합니다.')
  }

  const random9 = Math.floor(Math.random() * 1_000_000_000)
    .toString()
    .padStart(9, '0')

  return `${code}U${random9}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fintechUseNum = searchParams.get('fintech_use_num') || process.env.OPENBANKING_FINTECH_USE_NUM
    const clientUseCode = process.env.OPENBANKING_CLIENT_USE_CODE
    const inboundAuth = request.headers.get('authorization')
    const accessTokenFromHeader = inboundAuth?.startsWith('Bearer ')
      ? inboundAuth.replace('Bearer ', '').trim()
      : request.headers.get('x-openbanking-token')
    const accessToken = process.env.OPENBANKING_ACCESS_TOKEN || accessTokenFromHeader

    if (!accessToken) {
      return NextResponse.json(
        {
          success: false,
          error: '오픈뱅킹 access_token이 필요합니다.',
          hint: 'OPENBANKING_ACCESS_TOKEN 환경변수 또는 Authorization: Bearer <token> 헤더를 설정하세요.',
        },
        { status: 500 }
      )
    }

    if (!fintechUseNum) {
      return NextResponse.json(
        {
          success: false,
          error: 'fintech_use_num이 필요합니다.',
          hint: '쿼리 파라미터 fintech_use_num 또는 OPENBANKING_FINTECH_USE_NUM 환경변수를 설정하세요.',
        },
        { status: 400 }
      )
    }

    if (!clientUseCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'OPENBANKING_CLIENT_USE_CODE 환경변수가 필요합니다.',
          hint: '이용기관코드(10자리)를 OPENBANKING_CLIENT_USE_CODE에 설정하세요.',
        },
        { status: 500 }
      )
    }

    const bankTranId = createBankTranId(clientUseCode)
    const tranDtime = createTranDtime()

    const url = new URL('/v2.0/account/balance/fin_num', OPENBANKING_BASE_URL)
    url.searchParams.set('fintech_use_num', fintechUseNum)
    url.searchParams.set('bank_tran_id', bankTranId)
    url.searchParams.set('tran_dtime', tranDtime)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    })

    const payload = (await response.json()) as OpenBankingBalanceResponse

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: '오픈뱅킹 잔액조회 호출에 실패했습니다.',
          status: response.status,
          details: payload,
        },
        { status: response.status }
      )
    }

    if (payload.rsp_code !== 'A0000') {
      return NextResponse.json(
        {
          success: false,
          error: payload.rsp_message || '오픈뱅킹 잔액조회 응답 오류',
          code: payload.rsp_code,
          details: payload,
        },
        { status: 400 }
      )
    }

    const balance = Number(payload.balance_amt || 0)
    const account: AccountSummary = {
      id: payload.fintech_use_num || fintechUseNum,
      type: 'CASH_ACCOUNT',
      name: payload.product_name || payload.bank_name || '오픈뱅킹 계좌',
      balance: Number.isNaN(balance) ? 0 : balance,
      currency: 'KRW',
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: {
        accounts: [account],
        totalBalance: account.balance,
        currency: 'KRW',
        availableAmount: payload.available_amt || '0',
        bankName: payload.bank_name || '',
        fintechUseNum: payload.fintech_use_num || fintechUseNum,
        raw: payload,
      },
      message: '오픈뱅킹 잔액을 성공적으로 조회했습니다.',
    })
  } catch (error) {
    console.error('오픈뱅킹 잔액 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '오픈뱅킹 잔액 조회에 실패했습니다.',
      },
      { status: 500 }
    )
  }
}
