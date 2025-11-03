import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const roadmapItems = await prisma.roadmapItem.findMany({
      where: { userId },
      orderBy: [
        { year: 'desc' },
        { quarter: 'asc' }
      ]
    })

    const data = roadmapItems.map((item: any) => {
      // skills를 배열로 변환 (JSON 문자열이거나 쉼표로 구분된 문자열일 수 있음)
      let skillsArray: string[] = []
      if (item.skills) {
        try {
          // JSON 문자열인 경우
          skillsArray = JSON.parse(item.skills)
        } catch {
          // 쉼표로 구분된 문자열인 경우
          skillsArray = item.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        }
      }

      // quarter를 숫자로 변환
      let quarterNum = item.quarter
      if (typeof item.quarter === 'string') {
        const parsed = parseInt(item.quarter)
        quarterNum = isNaN(parsed) ? 1 : parsed
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        year: item.year,
        quarter: quarterNum,
        status: item.status,
        skills: skillsArray,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      data,
      message: '로드맵 아이템을 성공적으로 조회했습니다.'
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

    let result

    if (action === 'save') {
      // 전체 로드맵을 저장하는 경우 (덮어쓰기 방식)
      // 기존 아이템 삭제
      await prisma.roadmapItem.deleteMany({
        where: { userId }
      })

      // 새 아이템들 생성
      if (Array.isArray(data) && data.length > 0) {
        await prisma.roadmapItem.createMany({
          data: data.map((item: any) => ({
            userId,
            title: item.title,
            description: item.description,
            year: item.year,
            quarter: item.quarter.toString(),
            status: item.status,
            skills: Array.isArray(item.skills) 
              ? JSON.stringify(item.skills) 
              : (typeof item.skills === 'string' ? item.skills : JSON.stringify([]))
          }))
        })
      }
    } else if (action === 'add') {
      result = await prisma.roadmapItem.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          year: data.year,
          quarter: data.quarter.toString(),
          status: data.status,
          skills: Array.isArray(data.skills) 
            ? JSON.stringify(data.skills) 
            : (typeof data.skills === 'string' ? data.skills : JSON.stringify([]))
        }
      })
    } else if (action === 'update') {
      result = await prisma.roadmapItem.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          year: data.year,
          quarter: data.quarter.toString(),
          status: data.status,
          skills: Array.isArray(data.skills) 
            ? JSON.stringify(data.skills) 
            : (typeof data.skills === 'string' ? data.skills : JSON.stringify([]))
        }
      })
    } else if (action === 'delete') {
      result = await prisma.roadmapItem.delete({
        where: { id }
      })
    }

    const updatedItems = await prisma.roadmapItem.findMany({
      where: { userId },
      orderBy: [
        { year: 'desc' },
        { quarter: 'asc' }
      ]
    })

    const responseData = updatedItems.map((item: any) => {
      // skills를 배열로 변환
      let skillsArray: string[] = []
      if (item.skills) {
        try {
          skillsArray = JSON.parse(item.skills)
        } catch {
          skillsArray = item.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        }
      }

      // quarter를 숫자로 변환
      let quarterNum = item.quarter
      if (typeof item.quarter === 'string') {
        const parsed = parseInt(item.quarter)
        quarterNum = isNaN(parsed) ? 1 : parsed
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        year: item.year,
        quarter: quarterNum,
        status: item.status,
        skills: skillsArray,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '로드맵 아이템이 성공적으로 저장되었습니다.'
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