import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LifeStageFormData } from '@/types/finance'

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

    const lifeStages = await prisma.lifeStage.findMany({
      where: { userId },
      orderBy: { age: 'asc' }
    })

    const responseData = lifeStages.map((stage: any) => ({
      id: stage.id,
      stage: stage.stage,
      age: stage.age,
      description: stage.description,
      targetAmount: stage.targetAmount,
      currentAmount: stage.currentAmount,
      priority: stage.priority.toLowerCase() as 'high' | 'medium' | 'low'
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '생애주기별 자금 계획을 성공적으로 조회했습니다.'
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

    let result

    if (action === 'save') {
      // 전체 저장 - 기존 데이터 삭제 후 새로 생성
      await prisma.lifeStage.deleteMany({
        where: { userId }
      })

      const newStages = await Promise.all(
        data.map((stage: LifeStageFormData) =>
          prisma.lifeStage.create({
            data: {
              userId,
              stage: stage.stage,
              age: stage.age,
              description: stage.description,
              targetAmount: stage.targetAmount,
              currentAmount: stage.currentAmount,
              priority: stage.priority.toUpperCase()
            }
          })
        )
      )

      result = newStages
    } else if (action === 'add') {
      // 새 항목 추가
      result = await prisma.lifeStage.create({
        data: {
          userId,
          stage: data.stage,
          age: data.age,
          description: data.description,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          priority: data.priority.toUpperCase()
        }
      })
    } else if (action === 'update') {
      // 항목 수정
      result = await prisma.lifeStage.update({
        where: { id: data.id },
        data: {
          stage: data.stage,
          age: data.age,
          description: data.description,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          priority: data.priority.toUpperCase()
        }
      })
    } else if (action === 'delete') {
      // 항목 삭제
      result = await prisma.lifeStage.delete({
        where: { id }
      })
    }

    // 업데이트된 전체 목록 조회
    const updatedStages = await prisma.lifeStage.findMany({
      where: { userId },
      orderBy: { age: 'asc' }
    })

    const responseData = updatedStages.map((stage: any) => ({
      id: stage.id,
      stage: stage.stage,
      age: stage.age,
      description: stage.description,
      targetAmount: stage.targetAmount,
      currentAmount: stage.currentAmount,
      priority: stage.priority.toLowerCase() as 'high' | 'medium' | 'low'
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '생애주기별 자금 계획이 성공적으로 저장되었습니다.'
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