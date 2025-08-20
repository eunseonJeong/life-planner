import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 목표 목록 조회
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

    const goals = await prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = goals.map((goal: any) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      priority: goal.priority,
      status: goal.status,
      createdAt: goal.createdAt.toISOString().split('T')[0],
      milestones: goal.milestones.map((milestone: any) => ({
        id: milestone.id,
        title: milestone.title,
        targetValue: milestone.targetValue,
        currentValue: milestone.currentValue,
        dueDate: milestone.dueDate,
        status: milestone.status
      }))
    }))

    return NextResponse.json({
      success: true,
      data,
      message: '목표 목록을 성공적으로 조회했습니다.'
    })
  } catch (error) {
    console.error('목표 목록 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '목표 목록 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }   
}

// POST: 목표 생성/수정/삭제
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

    let result: any = null

    if (action === 'add') {
      // 새로운 목표 추가
      result = await prisma.goal.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          category: data.category,
          dueDate: data.targetDate,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          unit: data.unit,
          priority: data.priority,
          status: data.status
        }
      })

      // 마일스톤이 있으면 추가
      if (data.milestones && data.milestones.length > 0) {
        await prisma.milestone.createMany({
          data: data.milestones.map((milestone: any) => ({
            goalId: result.id,
            title: milestone.title,
            targetValue: milestone.targetValue,
            currentValue: milestone.currentValue,
            dueDate: milestone.dueDate,
            status: milestone.status
          }))
        })
      }
    } else if (action === 'update') {
      // 기존 목표 수정
      result = await prisma.goal.update({
        where: { id: data.id },
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          dueDate: data.targetDate,
          targetValue: data.targetValue,
          currentValue: data.currentValue,
          unit: data.unit,
          priority: data.priority,
          status: data.status
        }
      })

      // 마일스톤 업데이트
      if (data.milestones) {
        // 기존 마일스톤 삭제
        await prisma.milestone.deleteMany({
          where: { goalId: data.id }
        })

        // 새 마일스톤 추가
        if (data.milestones.length > 0) {
          await prisma.milestone.createMany({
            data: data.milestones.map((milestone: any) => ({
              goalId: data.id,
              title: milestone.title,
              targetValue: milestone.targetValue,
              currentValue: milestone.currentValue,
              dueDate: milestone.dueDate,
              status: milestone.status
            }))
          })
        }
      }
    } else if (action === 'delete') {
      // 목표 삭제 (마일스톤은 CASCADE로 자동 삭제)
      result = await prisma.goal.delete({
        where: { id }
      })
    }

    // 업데이트된 목록 반환
    const updatedGoals = await prisma.goal.findMany({
      where: { userId },
      include: {
        milestones: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const responseData = updatedGoals.map((goal: any) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      priority: goal.priority,
      status: goal.status,
      createdAt: goal.createdAt.toISOString().split('T')[0],
      milestones: goal.milestones.map((milestone: any) => ({
        id: milestone.id,
        title: milestone.title,
        targetValue: milestone.targetValue,
        currentValue: milestone.currentValue,
        dueDate: milestone.dueDate,
        status: milestone.status
      }))
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '목표가 성공적으로 저장되었습니다.'
    })
  } catch (error) {
    console.error('목표 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '목표 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}
