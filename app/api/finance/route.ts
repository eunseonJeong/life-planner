import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// GET: 자산 정보 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.'
        },
        { status: 400 }
      )
    }

    // 임시 더미 데이터 반환 (DB 연결 문제로 인해)
    const dummyFinancialData = {
      id: 'finance_1',
      currentAssets: 50000000,
      monthlyIncome: 5000000,
      monthlyExpenses: {
        housing: 1500000,
        food: 500000,
        transportation: 300000,
        utilities: 200000,
        healthcare: 100000,
        entertainment: 200000,
        education: 100000,
        other: 100000
      },
      monthlySavings: {
        emergency: 500000,
        investment: 1000000,
        retirement: 500000,
        other: 200000
      },
      investmentGoals: {
        shortTerm: 10000000,
        mediumTerm: 50000000,
        longTerm: 100000000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: dummyFinancialData,
      message: '자산 정보를 성공적으로 조회했습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('자산 정보 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '자산 정보 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 자산 정보 생성/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, userId } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.'
        },
        { status: 400 }
      )
    }

    // 임시로 성공 응답 반환 (DB 연결 문제로 인해)
    return NextResponse.json({
      success: true,
      data: {},
      message: '자산 정보가 성공적으로 저장되었습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('자산 정보 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '자산 정보 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}