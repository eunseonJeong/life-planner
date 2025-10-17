import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// GET: 커리어 목표 조회
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
    const dummyCareerGoals = [
      {
        id: 'career_1',
        year: 2024,
        targetSalary: 60000000,
        currentSalary: 50000000,
        techStack: ['React', 'TypeScript', 'Node.js'],
        networkingGoals: '개발자 커뮤니티 참여',
        learningGoals: 'AWS 클라우드 자격증 취득',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: dummyCareerGoals,
      count: dummyCareerGoals.length,
      message: '커리어 목표를 성공적으로 조회했습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('커리어 목표 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '커리어 목표 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 커리어 목표 생성/수정/삭제
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
      message: '커리어 목표가 성공적으로 저장되었습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('커리어 목표 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '커리어 목표 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}