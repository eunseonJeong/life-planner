import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 계산기 데이터 목록 조회
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

    const calculators = await prisma.calculator.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = calculators.map((calc: any) => ({
      id: calc.id,
      name: calc.name,
      currentAge: calc.currentAge,
      currentSalary: calc.currentSalary,
      monthlyExpenses: calc.monthlyExpenses,
      monthlySavings: calc.monthlySavings,
      investmentReturn: calc.investmentReturn,
      targetAmount: calc.targetAmount,
      targetAge: calc.targetAge,
      portfolio: {
        etf: calc.portfolioEtf,
        stocks: calc.portfolioStocks,
        realEstate: calc.portfolioRealEstate,
        cash: calc.portfolioCash
      },
      createdAt: calc.createdAt.toISOString(),
      updatedAt: calc.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data,
      message: '계산기 데이터를 성공적으로 조회했습니다.'
    })
  } catch (error) {
    console.error('계산기 데이터 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '계산기 데이터 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 계산기 데이터 생성/수정/삭제
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

    // 사용자가 존재하는지 확인
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '유효하지 않은 사용자 ID입니다. 다시 로그인해주세요.'
        },
        { status: 400 }
      )
    }

    let result

    if (action === 'add') {
      // 새로운 계산기 데이터 추가
      result = await prisma.calculator.create({
        data: {
          userId,
          name: data.name,
          currentAge: data.currentAge,
          currentSalary: data.currentSalary,
          monthlyExpenses: data.monthlyExpenses,
          monthlySavings: data.monthlySavings,
          investmentReturn: data.investmentReturn,
          targetAmount: data.targetAmount,
          targetAge: data.targetAge,
          portfolioEtf: data.portfolio.etf,
          portfolioStocks: data.portfolio.stocks,
          portfolioRealEstate: data.portfolio.realEstate,
          portfolioCash: data.portfolio.cash
        }
      })
    } else if (action === 'update') {
      // 기존 데이터 수정
      result = await prisma.calculator.update({
        where: { id: data.id },
        data: {
          name: data.name,
          currentAge: data.currentAge,
          currentSalary: data.currentSalary,
          monthlyExpenses: data.monthlyExpenses,
          monthlySavings: data.monthlySavings,
          investmentReturn: data.investmentReturn,
          targetAmount: data.targetAmount,
          targetAge: data.targetAge,
          portfolioEtf: data.portfolio.etf,
          portfolioStocks: data.portfolio.stocks,
          portfolioRealEstate: data.portfolio.realEstate,
          portfolioCash: data.portfolio.cash
        }
      })
    } else if (action === 'delete') {
      // 데이터 삭제
      result = await prisma.calculator.delete({
        where: { id }
      })
    }

    // 업데이트된 목록 반환
    const calculators = await prisma.calculator.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    const responseData = calculators.map((calc:any) => ({
      id: calc.id,
      name: calc.name,
      currentAge: calc.currentAge,
      currentSalary: calc.currentSalary,
      monthlyExpenses: calc.monthlyExpenses,
      monthlySavings: calc.monthlySavings,
      investmentReturn: calc.investmentReturn,
      targetAmount: calc.targetAmount,
      targetAge: calc.targetAge,
      portfolio: {
        etf: calc.portfolioEtf,
        stocks: calc.portfolioStocks,
        realEstate: calc.portfolioRealEstate,
        cash: calc.portfolioCash
      },
      createdAt: calc.createdAt.toISOString(),
      updatedAt: calc.updatedAt.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '계산기 데이터가 성공적으로 저장되었습니다.'
    })
  } catch (error) {
    console.error('계산기 데이터 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '계산기 데이터 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}
