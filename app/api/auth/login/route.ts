import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 사용자 조회 (임시로 비밀번호 검증 없이)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: '로그인이 완료되었습니다.',
      user,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
