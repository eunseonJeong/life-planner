import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 임시로 더미 사용자 반환 (DB 연결 문제로 인해)
    const dummyUser = {
      id: 'temp_user_123',
      email: email,
      name: '임시 사용자',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: '로그인이 완료되었습니다. (임시 모드)',
      user: dummyUser,
    })

    // DB 사용 부분 (주석 처리)
    // const user = await prisma.user.findUnique({
    //   where: { email },
    // })

    // if (!user) {
    //   return NextResponse.json(
    //     { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
    //     { status: 401 }
    //   )
    // }

    // const isPasswordValid = await bcrypt.compare(password, user.password)
    // if (!isPasswordValid) {
    //   return NextResponse.json(
    //     { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
    //     { status: 401 }
    //   )
    // }

    // return NextResponse.json({
    //   message: '로그인이 완료되었습니다.',
    //   user,
    // })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
