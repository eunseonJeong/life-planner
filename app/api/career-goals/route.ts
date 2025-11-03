import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    const careerGoals = await prisma.careerGoal.findMany({
      where: { userId },
      orderBy: { year: 'desc' }
    })

    const data = careerGoals.map((goal: any) => ({
      id: goal.id,
      year: goal.year,
      targetSalary: goal.targetSalary,
      currentSalary: goal.currentSalary,
      sideIncomeTarget: goal.sideIncomeTarget,
      techStack: goal.techStack ? goal.techStack.split(',') : [],
      portfolioCount: goal.portfolioCount,
      networkingGoals: goal.networkingGoals,
      learningGoals: goal.learningGoals,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      message: '커리어 목표를 성공적으로 조회했습니다.'
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

    let result

    if (action === 'add') {
      result = await prisma.careerGoal.create({
        data: {
          userId,
          year: data.year,
          targetSalary: data.targetSalary,
          currentSalary: data.currentSalary,
          sideIncomeTarget: data.sideIncomeTarget || 0,
          techStack: data.techStack ? data.techStack.join(',') : '',
          portfolioCount: data.portfolioCount || 0,
          networkingGoals: data.networkingGoals || null,
          learningGoals: data.learningGoals || null
        }
      })
    } else if (action === 'update') {
      result = await prisma.careerGoal.update({
        where: { id: data.id },
        data: {
          year: data.year,
          targetSalary: data.targetSalary,
          currentSalary: data.currentSalary,
          sideIncomeTarget: data.sideIncomeTarget || 0,
          techStack: data.techStack ? data.techStack.join(',') : '',
          portfolioCount: data.portfolioCount || 0,
          networkingGoals: data.networkingGoals || null,
          learningGoals: data.learningGoals || null
        }
      })
    } else if (action === 'delete') {
      result = await prisma.careerGoal.delete({
        where: { id }
      })
    }

    const updatedGoals = await prisma.careerGoal.findMany({
      where: { userId },
      orderBy: { year: 'desc' }
    })

    const responseData = updatedGoals.map((goal: any) => ({
      id: goal.id,
      year: goal.year,
      targetSalary: goal.targetSalary,
      currentSalary: goal.currentSalary,
      sideIncomeTarget: goal.sideIncomeTarget,
      techStack: goal.techStack ? goal.techStack.split(',') : [],
      portfolioCount: goal.portfolioCount,
      networkingGoals: goal.networkingGoals,
      learningGoals: goal.learningGoals,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '커리어 목표가 성공적으로 저장되었습니다.'
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