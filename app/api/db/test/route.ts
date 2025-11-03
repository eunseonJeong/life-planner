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
    // 1. DATABASE_URL 환경 변수 확인 및 검증
    const databaseUrl = process.env.DATABASE_URL
    const hasDatabaseUrl = !!databaseUrl
    
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

    // DATABASE_URL 분석 (비밀번호는 마스킹)
    const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
    const match = databaseUrl?.match(urlPattern)
    
    const urlInfo = match ? {
      user: match[1],
      password: match[2].length > 0 ? '***' : '없음',
      host: match[3],
      port: match[4],
      database: match[5],
      isValidFormat: true,
      isDirectConnection: match[4] === '5432',
      isPoolerConnection: match[4] === '6543',
    } : {
      isValidFormat: false,
      error: 'DATABASE_URL 형식이 올바르지 않습니다. postgresql:// 형식이어야 합니다.'
    }

    // URL 형식이 잘못된 경우
    if (!urlInfo.isValidFormat) {
      return NextResponse.json({
        success: false,
        error: urlInfo.error,
        checks: {
          databaseUrlExists: true,
          connection: false,
          tables: false,
        },
        urlInfo
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
      urlInfo: {
        ...urlInfo,
        connectionType: urlInfo.isDirectConnection ? 'Direct Connection (권장)' : 
                       urlInfo.isPoolerConnection ? 'Pooler Connection' : 'Unknown'
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
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error('Database test error:', error)
    
    // Prisma 에러 코드 추출
    const prismaErrorCode = errorMessage.match(/P\d{4}/)?.[0]
    
    // URL 정보 재확인
    const databaseUrl = process.env.DATABASE_URL
    const urlPattern = /postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/
    const match = databaseUrl?.match(urlPattern)
    
    const urlInfo = match ? {
      user: match[1],
      password: match[2].length > 0 ? '***' : '없음',
      host: match[3],
      port: match[4],
      database: match[5],
      isValidFormat: true,
      isDirectConnection: match[4] === '5432',
      isPoolerConnection: match[4] === '6543',
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(match[2]),
    } : {
      isValidFormat: false
    }
    
    // 구체적인 해결 방법 제시
    const specificHints: string[] = []
    
    if (errorMessage.includes('Tenant or user not found') || errorMessage.includes('FATAL')) {
      specificHints.push('사용자명이나 비밀번호가 잘못되었을 수 있습니다')
      specificHints.push('Supabase의 경우 postgres 사용자명을 사용하세요')
      if (urlInfo.hasSpecialChars) {
        specificHints.push('비밀번호 특수문자를 URL 인코딩하세요 (! → %21, @ → %40)')
      }
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
      specificHints.push('데이터베이스 서버에 연결할 수 없습니다')
      specificHints.push('호스트 주소와 포트가 올바른지 확인하세요')
      specificHints.push('Supabase 방화벽 설정을 확인하세요')
    }
    
    if (prismaErrorCode === 'P1001') {
      specificHints.push('데이터베이스 서버에 연결할 수 없습니다')
      specificHints.push('네트워크 연결을 확인하세요')
    }
    
    if (prismaErrorCode === 'P1003') {
      specificHints.push('데이터베이스가 존재하지 않습니다')
      specificHints.push('데이터베이스 이름을 확인하세요 (일반적으로 "postgres")')
    }
    
    return NextResponse.json({
      success: false,
      error: '데이터베이스 연결 실패',
      message: errorMessage,
      prismaErrorCode,
      checks: {
        databaseUrlExists: !!databaseUrl,
        connection: false,
        tables: false,
      },
      urlInfo: match ? {
        ...urlInfo,
        connectionType: urlInfo.isDirectConnection ? 'Direct Connection (권장)' : 
                       urlInfo.isPoolerConnection ? 'Pooler Connection' : 'Unknown'
      } : { isValidFormat: false },
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      hints: specificHints.length > 0 ? specificHints : [
        'DATABASE_URL 형식이 올바른지 확인하세요',
        'Supabase를 사용하는 경우 Direct Connection(포트 5432)을 사용하세요',
        '비밀번호에 특수문자가 있으면 URL 인코딩이 필요합니다 (! → %21)',
        '데이터베이스 서버가 실행 중인지 확인하세요',
        'Supabase Dashboard에서 연결 정보를 다시 확인하세요'
      ]
    }, { status: 500 })
  }
}

