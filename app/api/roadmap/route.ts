import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const roadmapItems = await prisma.roadmapItem.findMany({
      where: { userId },
      orderBy: [{ year: 'asc' }, { quarter: 'asc' }]
    })

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = roadmapItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      year: item.year,
      quarter: item.quarter,
      status: item.status,
      skills: item.skills.split(',').map((skill: string) => skill.trim()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }))

    return NextResponse.json({ 
      success: true,
      data, 
      count: data.length 
    }, { status: 200 })
  } catch (error) {
    console.error('로드맵 조회 실패:', error)
    return NextResponse.json({ 
      success: false,
      error: '로드맵 조회에 실패했습니다.' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data, userId } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.'
        },
        { status: 400 }
      )
    }

    if (action === 'save') {
      // 기존 데이터 삭제 후 새로 저장
      await prisma.roadmapItem.deleteMany({
        where: { userId }
      })

      // 새 데이터 저장
      const roadmapItems = data.map((item: any) => ({
        userId,
        title: item.title,
        description: item.description,
        year: item.year,
        quarter: item.quarter,
        status: item.status,
        skills: Array.isArray(item.skills) ? item.skills.join(', ') : item.skills
      }))

      await prisma.roadmapItem.createMany({
        data: roadmapItems
      })
    }

    // 업데이트된 목록 반환
    const updatedItems = await prisma.roadmapItem.findMany({
      where: { userId },
      orderBy: [{ year: 'asc' }, { quarter: 'asc' }]
    })

    const responseData = updatedItems.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      year: item.year,
      quarter: item.quarter,
      status: item.status,
      skills: item.skills.split(',').map((skill: string) => skill.trim()),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    }))

    return NextResponse.json({ 
      success: true,
      message: '로드맵이 성공적으로 저장되었습니다.',
      data: responseData,
      count: responseData.length
    }, { status: 201 })
  } catch (error) {
    console.error('로드맵 저장 실패:', error)
    return NextResponse.json({ 
      success: false,
      error: '로드맵 저장에 실패했습니다.' 
    }, { status: 500 })
  }
}
