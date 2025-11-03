import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    return NextResponse.json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('Signup error:', error)
    
    // 데이터베이스 연결 오류인 경우 더 명확한 메시지
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    if (errorMessage.includes('Tenant or user not found') || errorMessage.includes('FATAL')) {
      return NextResponse.json(
        { 
          error: '데이터베이스 연결 오류가 발생했습니다. DATABASE_URL 환경 변수를 확인하거나 마이그레이션을 실행해주세요.',
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    )
  }
}
