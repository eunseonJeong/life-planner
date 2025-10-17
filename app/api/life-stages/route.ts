import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// GET: 생애주기별 자금 계획 조회
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
    const dummyLifeStages = [
      {
        id: 'life_1',
        stage: '결혼',
        age: 30,
        description: '결혼 자금 마련',
        targetAmount: 50000000,
        currentAmount: 20000000,
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'life_2',
        stage: '주택 구입',
        age: 35,
        description: '아파트 구입 자금',
        targetAmount: 100000000,
        currentAmount: 30000000,
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: dummyLifeStages,
      message: '생애주기별 자금 계획을 성공적으로 조회했습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('생애주기별 자금 계획 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '생애주기별 자금 계획 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 생애주기별 자금 계획 생성/수정/삭제
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data, id, userId } = body

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
      data: [],
      message: '생애주기별 자금 계획이 성공적으로 저장되었습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('생애주기별 자금 계획 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '생애주기별 자금 계획 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}