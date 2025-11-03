import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 데이터베이스 연결 테스트 API
 * 개발 환경에서만 사용 가능하도록 설정
 */
export async function GET(request: NextRequest) {
  // 프로덕션 환경에서는 비활성화 (보안)
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: '이 API는 프로덕션 환경에서 사용할 수 없습니다.' },
      { status: 403 }
    )
  }

  try {
    // 1. DATABASE_URL 환경 변수 확인
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    
    if (!hasDatabaseUrl) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL 환경 변수가 설정되지 않았습니다.',
        checks: {
          databaseUrlExists: false,
          connection: false,
          tables: false,
        }
      })
    }

    // 2. 데이터베이스 연결 테스트
    await prisma.$connect()
    
    // 3. 간단한 쿼리 테스트
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // 4. 테이블 존재 여부 확인
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `
    
    const hasUsersTable = tables.some(t => t.tablename === 'users')
    
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: '데이터베이스 연결 성공',
      checks: {
        databaseUrlExists: true,
        connection: true,
        tables: hasUsersTable,
      },
      tableCount: tables.length,
      tables: tables.map(t => t.tablename),
      hasUsersTable,
      hint: hasUsersTable 
        ? '테이블이 존재합니다. 연결은 정상입니다.'
        : 'users 테이블이 없습니다. 마이그레이션을 실행하세요: npm run db:migrate'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Database test error:', error)
    
    return NextResponse.json({
      success: false,
      error: '데이터베이스 연결 실패',
      message: errorMessage,
      checks: {
        databaseUrlExists: !!process.env.DATABASE_URL,
        connection: false,
        tables: false,
      },
      details: errorMessage,
      hints: [
        'DATABASE_URL 형식이 올바른지 확인하세요',
        'Supabase를 사용하는 경우 Direct Connection(포트 5432)을 사용하세요',
        '비밀번호에 특수문자가 있으면 URL 인코딩이 필요합니다 (! → %21)',
        '데이터베이스 서버가 실행 중인지 확인하세요'
      ]
    }, { status: 500 })
  }
}

