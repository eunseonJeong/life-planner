import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 임시로 모든 사용자 데이터 조회 (실제로는 인증된 사용자 ID를 받아야 함)
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 임시 더미 데이터 반환 (DB 연결 문제로 인해)
    const dummyUserData = {
      user: {
        id: userId,
        email: 'temp@example.com',
        name: '임시 사용자',
        createdAt: new Date().toISOString()
      },
      data: {
        plans: [],
        careerGoals: [],
        financialData: [],
        realEstateData: [],
        relationshipData: []
      }
    }

    return NextResponse.json(dummyUserData)

    // DB 사용 부분 (주석 처리)
    // const userData = await prisma.user.findUnique({
    //   where: { id: userId },
    //   include: {
    //     plans: {
    //       orderBy: { createdAt: 'desc' }
    //     },
    //     careerGoals: {
    //       orderBy: { year: 'desc' }
    //     },
    //     financialData: {
    //       orderBy: { createdAt: 'desc' }
    //     },
    //     realEstateData: {
    //       orderBy: { createdAt: 'desc' }
    //     },
    //     relationshipData: {
    //       orderBy: { createdAt: 'desc' }
    //     },
    //   },
    // })

    // if (!userData) {
    //   return NextResponse.json(
    //     { error: '사용자 정보를 찾을 수 없습니다.' },
    //     { status: 404 }
    //   )
    // }

    // return NextResponse.json({
    //   user: {
    //     id: userData.id,
    //     email: userData.email,
    //     name: userData.name,
    //     createdAt: userData.createdAt,
    //   },
    //   data: {
    //     plans: userData.plans,
    //     careerGoals: userData.careerGoals,
    //     financialData: userData.financialData,
    //     realEstateData: userData.realEstateData,
    //     relationshipData: userData.relationshipData,
    //   },
    // })
  } catch (error) {
    console.error('User data fetch error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
