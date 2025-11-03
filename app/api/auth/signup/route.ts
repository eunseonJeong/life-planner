import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // DATABASE_URL 로깅 (비밀번호 마스킹)
    const databaseUrl = process.env.DATABASE_URL
    console.log('DATABASE_URL:', databaseUrl)
    if (databaseUrl) {
      const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
      const match = databaseUrl.match(urlPattern)
      if (match) {
        const [, user, password, host, port, database] = match
        const maskedPassword = password.length > 0 ? '*'.repeat(Math.min(password.length, 10)) : '없음'
        console.log('=== DATABASE_URL 정보 ===')
        console.log('User:', user)
        console.log('Password:', maskedPassword, `(길이: ${password.length})`)
        console.log('Host:', host)
        console.log('Port:', port)
        console.log('Database:', database)
        console.log('Connection Type:', port === '5432' ? 'Direct Connection' : port === '6543' ? 'Pooler Connection' : 'Unknown')
        console.log('========================')
      } else {
        console.log('⚠️ DATABASE_URL 형식이 올바르지 않습니다.')
        console.log('URL (마스킹됨):', databaseUrl.replace(/:[^:@]+@/, ':***@'))
      }
    } else {
      console.error('❌ DATABASE_URL 환경 변수가 설정되지 않았습니다.')
    }

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
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // 데이터베이스 연결 관련 오류 패턴
    const isDbConnectionError = 
      errorMessage.includes('Tenant or user not found') ||
      errorMessage.includes('FATAL') ||
      errorMessage.includes('Can\'t reach database server') ||
      errorMessage.includes('P1001') || // Prisma connection error
      errorMessage.includes('P1002') || // Prisma connection timeout
      errorMessage.includes('P1003')    // Prisma database does not exist
    
    // 테이블이 없을 때 오류 패턴
    const isTableNotFoundError = 
      errorMessage.includes('does not exist') ||
      errorMessage.includes('P2021') || // Prisma table does not exist
      errorMessage.includes('P2025')    // Prisma record not found
    
    if (isDbConnectionError) {
      return NextResponse.json(
        { 
          error: '데이터베이스 연결 오류가 발생했습니다.',
          message: 'DATABASE_URL 환경 변수를 확인하거나 데이터베이스 연결을 확인해주세요.',
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
          hint: 'Supabase를 사용하는 경우 Direct Connection(포트 5432)을 사용하는지 확인하세요.'
        },
        { status: 500 }
      )
    }
    
    if (isTableNotFoundError) {
      return NextResponse.json(
        { 
          error: '데이터베이스 테이블이 없습니다.',
          message: '마이그레이션을 실행해주세요: npm run db:migrate',
          details: process.env.NODE_ENV === "development" ? errorMessage : undefined
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: `서버 오류가 발생했습니다: ${errorMessage}`,
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
