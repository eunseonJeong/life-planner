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
      orderBy: { year: 'asc' }
    })

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = careerGoals.map((goal: any) => ({
      id: goal.id,
      year: goal.year,
      targetSalary: goal.targetSalary,
      currentSalary: goal.currentSalary,
      techStack: goal.techStack.split(',').map((tech: string) => tech.trim()),
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

// POST: 커리어 목표 생성/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...data } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.'
        },
        { status: 400 }
      )
    }

    // 유효성 검사
    if (!data.year || data.year < new Date().getFullYear()) {
      return NextResponse.json(
        { 
          success: false,
          error: '올바른 연도를 입력해주세요' 
        },
        { status: 400 }
      )
    }

    if (!data.targetSalary || data.targetSalary <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: '목표 연봉을 입력해주세요' 
        },
        { status: 400 }
      )
    }

    if (!data.currentSalary || data.currentSalary < 0) {
      return NextResponse.json(
        { 
          success: false,
          error: '현재 연봉을 입력해주세요' 
        },
        { status: 400 }
      )
    }

    if (data.techStack.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: '기술 스택을 선택해주세요' 
        },
        { status: 400 }
      )
    }

    if (!data.networkingGoals?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: '네트워킹 목표를 입력해주세요' 
        },
        { status: 400 }
      )
    }

    if (!data.learningGoals?.trim()) {
      return NextResponse.json(
        { 
          success: false,
          error: '학습 목표를 입력해주세요' 
        },
        { status: 400 }
      )
    }

    // 기존 데이터 확인
    const existingGoal = await prisma.careerGoal.findFirst({
      where: { 
        userId,
        year: data.year 
      }
    })

    let result

    if (existingGoal) {
      // 기존 데이터 업데이트
      result = await prisma.careerGoal.update({
        where: { id: existingGoal.id },
        data: {
          targetSalary: data.targetSalary,
          currentSalary: data.currentSalary,
          techStack: Array.isArray(data.techStack) ? data.techStack.join(', ') : data.techStack,
          networkingGoals: data.networkingGoals,
          learningGoals: data.learningGoals
        }
      })
    } else {
      // 새 데이터 생성
      result = await prisma.careerGoal.create({
        data: {
          userId,
          year: data.year,
          targetSalary: data.targetSalary,
          currentSalary: data.currentSalary,
          techStack: Array.isArray(data.techStack) ? data.techStack.join(', ') : data.techStack,
          networkingGoals: data.networkingGoals,
          learningGoals: data.learningGoals
        }
      })
    }

    // 업데이트된 목록 반환
    const updatedGoals = await prisma.careerGoal.findMany({
      where: { userId },
      orderBy: { year: 'asc' }
    })

    const responseData = updatedGoals.map((goal: any) => ({
      id: goal.id,
      year: goal.year,
      targetSalary: goal.targetSalary,
      currentSalary: goal.currentSalary,
      techStack: goal.techStack.split(',').map((tech: string) => tech.trim()),
      networkingGoals: goal.networkingGoals,
      learningGoals: goal.learningGoals,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      count: responseData.length,
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
