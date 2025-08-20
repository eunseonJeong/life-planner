import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({
      message: '로그아웃이 완료되었습니다.',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
