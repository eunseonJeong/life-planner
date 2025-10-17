import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// GET: 로드맵 아이템 조회
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
    const dummyRoadmapItems = [
      {
        id: 'roadmap_1',
        title: 'React 마스터하기',
        description: 'React 고급 기능 학습',
        year: 2024,
        quarter: 'Q1',
        status: 'IN_PROGRESS',
        skills: 'React, TypeScript, Redux',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'roadmap_2',
        title: 'AWS 자격증 취득',
        description: 'AWS Solutions Architect 자격증 취득',
        year: 2024,
        quarter: 'Q2',
        status: 'PLANNING',
        skills: 'AWS, Cloud Computing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      success: true,
      data: dummyRoadmapItems,
      message: '로드맵 아이템을 성공적으로 조회했습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('로드맵 아이템 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '로드맵 아이템 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 로드맵 아이템 생성/수정/삭제
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
      message: '로드맵 아이템이 성공적으로 저장되었습니다. (임시 모드)'
    })
  } catch (error) {
    console.error('로드맵 아이템 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '로드맵 아이템 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}