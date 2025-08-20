import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = lifeStages.map((stage: any) => ({
      id: stage.id,
      stage: stage.stage,
      age: stage.age,
      description: stage.description,
      targetAmount: stage.targetAmount,
      currentAmount: stage.currentAmount,
      priority: stage.priority,
      createdAt: stage.createdAt.toISOString(),
      updatedAt: stage.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data,
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

// POST: 생애주기별 자금 계획 저장/수정
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
      // 기존 데이터 삭제 후 새로 저장
      await prisma.lifeStage.deleteMany({
        where: { userId }
      })

      // 새 데이터 저장
      const lifeStages = data.map((stage: any) => ({
        userId,
        stage: stage.stage,
        age: stage.age,
        description: stage.description,
        targetAmount: stage.targetAmount,
        currentAmount: stage.currentAmount,
        priority: stage.priority
      }))

      await prisma.lifeStage.createMany({
        data: lifeStages
      })
    } else if (action === 'add') {
      // 새로운 항목 추가
      result = await prisma.lifeStage.create({
        data: {
          userId,
          stage: data.stage,
          age: data.age,
          description: data.description,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          priority: data.priority
        }
      })
    } else if (action === 'update') {
      // 기존 항목 수정
      result = await prisma.lifeStage.update({
        where: { id: data.id },
        data: {
          stage: data.stage,
          age: data.age,
          description: data.description,
          targetAmount: data.targetAmount,
          currentAmount: data.currentAmount,
          priority: data.priority
        }
      })
    } else if (action === 'delete') {
      // 항목 삭제
      result = await prisma.lifeStage.delete({
        where: { id }
      })
    }

    // 업데이트된 목록 반환
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
      priority: stage.priority,
      createdAt: stage.createdAt.toISOString(),
      updatedAt: stage.updatedAt.toISOString()
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
