import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: 자산 정보 조회
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

    const financialData = await prisma.financialData.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1
    })

    if (financialData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: '자산 정보가 없습니다.'
      })
    }

    const data = financialData[0]
    const responseData = {
      id: data.id,
      totalAssets: data.currentAssets,
      monthlyIncome: data.monthlyIncome,
      monthlyExpenses: {
        fixed: data.monthlyExpensesHousing,
        living: data.monthlyExpensesFood,
        other: data.monthlyExpensesOther
      },
      monthlySavings: {
        etf: data.investmentPortfolioOther ? Math.round(data.investmentPortfolioOther * 0.3) : null,
        cma: data.investmentPortfolioCash,
        isa: data.investmentPortfolioOther ? Math.round(data.investmentPortfolioOther * 0.2) : null,
        pension: data.monthlySavingsRetirement,
        stock: data.investmentPortfolioStocks,
        crypto: data.investmentPortfolioOther ? Math.round(data.investmentPortfolioOther * 0.1) : null,
        housing: data.investmentPortfolioRealEstate,
        youth: data.monthlySavingsOther ? Math.round(data.monthlySavingsOther * 0.25) : null
      },
      investmentReturn: 5.0,
      emergencyFund: data.monthlySavingsEmergency,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '자산 정보를 성공적으로 조회했습니다.'
    })
  } catch (error) {
    console.error('자산 정보 조회 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '자산 정보 조회에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}

// POST: 자산 정보 생성/수정
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, userId } = body

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: '사용자 ID가 필요합니다.'
        },
        { status: 400 }
      )
    }

    // 기존 데이터 확인
    const existingData = await prisma.financialData.findFirst({
      where: { userId }
    })

    let result
    if (existingData) {
      // 업데이트
      result = await prisma.financialData.update({
        where: { id: existingData.id },
        data: {
          currentAssets: data.totalAssets || null,
          monthlyIncome: data.monthlyIncome || null,
          monthlyExpensesHousing: data.monthlyExpenses?.fixed || null,
          monthlyExpensesFood: data.monthlyExpenses?.living || null,
          monthlyExpensesTransportation: null,
          monthlyExpensesUtilities: null,
          monthlyExpensesHealthcare: null,
          monthlyExpensesEntertainment: null,
          monthlyExpensesEducation: null,
          monthlyExpensesOther: data.monthlyExpenses?.other || null,
          monthlySavingsEmergency: data.emergencyFund || null,
          monthlySavingsInvestment: (data.monthlySavings?.etf || 0) + (data.monthlySavings?.stock || 0) + (data.monthlySavings?.crypto || 0) || null,
          monthlySavingsRetirement: data.monthlySavings?.pension || null,
          monthlySavingsOther: (data.monthlySavings?.cma || 0) + (data.monthlySavings?.isa || 0) + (data.monthlySavings?.housing || 0) + (data.monthlySavings?.youth || 0) || null,
          investmentPortfolioStocks: data.monthlySavings?.stock || null,
          investmentPortfolioBonds: null,
          investmentPortfolioRealEstate: data.monthlySavings?.housing || null,
          investmentPortfolioCash: data.monthlySavings?.cma || null,
          investmentPortfolioOther: (data.monthlySavings?.etf || 0) + (data.monthlySavings?.isa || 0) + (data.monthlySavings?.pension || 0) + (data.monthlySavings?.crypto || 0) + (data.monthlySavings?.youth || 0) || null,
          debtInfoMortgage: null,
          debtInfoCarLoan: null,
          debtInfoStudentLoan: null,
          debtInfoCreditCard: null,
          debtInfoOther: null
        }
      })
    } else {
      // 생성
      result = await prisma.financialData.create({
        data: {
          userId,
          currentAssets: data.totalAssets || null,
          monthlyIncome: data.monthlyIncome || null,
          monthlyExpensesHousing: data.monthlyExpenses?.fixed || null,
          monthlyExpensesFood: data.monthlyExpenses?.living || null,
          monthlyExpensesTransportation: null,
          monthlyExpensesUtilities: null,
          monthlyExpensesHealthcare: null,
          monthlyExpensesEntertainment: null,
          monthlyExpensesEducation: null,
          monthlyExpensesOther: data.monthlyExpenses?.other || null,
          monthlySavingsEmergency: data.emergencyFund || null,
          monthlySavingsInvestment: (data.monthlySavings?.etf || 0) + (data.monthlySavings?.stock || 0) + (data.monthlySavings?.crypto || 0) || null,
          monthlySavingsRetirement: data.monthlySavings?.pension || null,
          monthlySavingsOther: (data.monthlySavings?.cma || 0) + (data.monthlySavings?.isa || 0) + (data.monthlySavings?.housing || 0) + (data.monthlySavings?.youth || 0) || null,
          investmentPortfolioStocks: data.monthlySavings?.stock || null,
          investmentPortfolioBonds: null,
          investmentPortfolioRealEstate: data.monthlySavings?.housing || null,
          investmentPortfolioCash: data.monthlySavings?.cma || null,
          investmentPortfolioOther: (data.monthlySavings?.etf || 0) + (data.monthlySavings?.isa || 0) + (data.monthlySavings?.pension || 0) + (data.monthlySavings?.crypto || 0) + (data.monthlySavings?.youth || 0) || null,
          debtInfoMortgage: null,
          debtInfoCarLoan: null,
          debtInfoStudentLoan: null,
          debtInfoCreditCard: null,
          debtInfoOther: null
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: '자산 정보가 성공적으로 저장되었습니다.'
    })
  } catch (error) {
    console.error('자산 정보 저장 실패:', error)
    return NextResponse.json(
      {
        success: false,
        error: '자산 정보 저장에 실패했습니다.'
      },
      { status: 500 }
    )
  }
}