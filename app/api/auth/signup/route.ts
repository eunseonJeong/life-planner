import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'
// import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    // 임시로 더미 사용자 반환 (DB 연결 문제로 인해)
    const dummyUser = {
      id: `temp_user_${Date.now()}`,
      email: email,
      name: name || '임시 사용자',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: '회원가입이 완료되었습니다. (임시 모드)',
      user: {
        id: dummyUser.id,
        email: dummyUser.email,
        name: dummyUser.name,
      },
    })

    // DB 사용 부분 (주석 처리)
    // const existingUser = await prisma.user.findUnique({
    //   where: { email },
    // })

    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: '이미 존재하는 이메일입니다.' },
    //     { status: 400 }
    //   )
    // }

    // const hashedPassword = await bcrypt.hash(password, 10)

    // const user = await prisma.user.create({
    //   data: {
    //     email,
    //     password: hashedPassword,
    //     name: name || null,
    //   },
    // })

    // return NextResponse.json({
    //   message: '회원가입이 완료되었습니다.',
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     name: user.name,
    //   },
    // })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
