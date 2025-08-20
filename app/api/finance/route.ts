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

    const financialData = await prisma.financialData.findFirst({
      where: { userId }
    })

    if (!financialData) {
      return NextResponse.json({
        success: true,
        data: {},
        message: '자산 정보가 없습니다.'
      })
    }

    // Prisma 데이터를 클라이언트 형식으로 변환
    const data = {
      id: financialData.id,
      currentAssets: financialData.currentAssets,
      monthlyIncome: financialData.monthlyIncome,
      monthlyExpenses: {
        housing: financialData.monthlyExpensesHousing,
        food: financialData.monthlyExpensesFood,
        transportation: financialData.monthlyExpensesTransportation,
        utilities: financialData.monthlyExpensesUtilities,
        healthcare: financialData.monthlyExpensesHealthcare,
        entertainment: financialData.monthlyExpensesEntertainment,
        education: financialData.monthlyExpensesEducation,
        other: financialData.monthlyExpensesOther
      },
      monthlySavings: {
        emergency: financialData.monthlySavingsEmergency,
        investment: financialData.monthlySavingsInvestment,
        retirement: financialData.monthlySavingsRetirement,
        other: financialData.monthlySavingsOther
      },
      investmentPortfolio: {
        stocks: financialData.investmentPortfolioStocks,
        bonds: financialData.investmentPortfolioBonds,
        realEstate: financialData.investmentPortfolioRealEstate,
        cash: financialData.investmentPortfolioCash,
        other: financialData.investmentPortfolioOther
      },
      debtInfo: {
        mortgage: financialData.debtInfoMortgage,
        carLoan: financialData.debtInfoCarLoan,
        studentLoan: financialData.debtInfoStudentLoan,
        creditCard: financialData.debtInfoCreditCard,
        other: financialData.debtInfoOther
      },
      createdAt: financialData.createdAt.toISOString(),
      updatedAt: financialData.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data,
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

// POST: 자산 정보 등록/수정
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

    // 기존 데이터 확인
    const existingData = await prisma.financialData.findFirst({
      where: { userId }
    })

    let result

    if (existingData) {
      // 기존 데이터 업데이트
      result = await prisma.financialData.update({
        where: { id: existingData.id },
        data: {
          currentAssets: data.currentAssets,
          monthlyIncome: data.monthlyIncome,
          monthlyExpensesHousing: data.monthlyExpenses?.housing,
          monthlyExpensesFood: data.monthlyExpenses?.food,
          monthlyExpensesTransportation: data.monthlyExpenses?.transportation,
          monthlyExpensesUtilities: data.monthlyExpenses?.utilities,
          monthlyExpensesHealthcare: data.monthlyExpenses?.healthcare,
          monthlyExpensesEntertainment: data.monthlyExpenses?.entertainment,
          monthlyExpensesEducation: data.monthlyExpenses?.education,
          monthlyExpensesOther: data.monthlyExpenses?.other,
          monthlySavingsEmergency: data.monthlySavings?.emergency,
          monthlySavingsInvestment: data.monthlySavings?.investment,
          monthlySavingsRetirement: data.monthlySavings?.retirement,
          monthlySavingsOther: data.monthlySavings?.other,
          investmentPortfolioStocks: data.investmentPortfolio?.stocks,
          investmentPortfolioBonds: data.investmentPortfolio?.bonds,
          investmentPortfolioRealEstate: data.investmentPortfolio?.realEstate,
          investmentPortfolioCash: data.investmentPortfolio?.cash,
          investmentPortfolioOther: data.investmentPortfolio?.other,
          debtInfoMortgage: data.debtInfo?.mortgage,
          debtInfoCarLoan: data.debtInfo?.carLoan,
          debtInfoStudentLoan: data.debtInfo?.studentLoan,
          debtInfoCreditCard: data.debtInfo?.creditCard,
          debtInfoOther: data.debtInfo?.other
        }
      })
    } else {
      // 새 데이터 생성
      result = await prisma.financialData.create({
        data: {
          userId,
          currentAssets: data.currentAssets,
          monthlyIncome: data.monthlyIncome,
          monthlyExpensesHousing: data.monthlyExpenses?.housing,
          monthlyExpensesFood: data.monthlyExpenses?.food,
          monthlyExpensesTransportation: data.monthlyExpenses?.transportation,
          monthlyExpensesUtilities: data.monthlyExpenses?.utilities,
          monthlyExpensesHealthcare: data.monthlyExpenses?.healthcare,
          monthlyExpensesEntertainment: data.monthlyExpenses?.entertainment,
          monthlyExpensesEducation: data.monthlyExpenses?.education,
          monthlyExpensesOther: data.monthlyExpenses?.other,
          monthlySavingsEmergency: data.monthlySavings?.emergency,
          monthlySavingsInvestment: data.monthlySavings?.investment,
          monthlySavingsRetirement: data.monthlySavings?.retirement,
          monthlySavingsOther: data.monthlySavings?.other,
          investmentPortfolioStocks: data.investmentPortfolio?.stocks,
          investmentPortfolioBonds: data.investmentPortfolio?.bonds,
          investmentPortfolioRealEstate: data.investmentPortfolio?.realEstate,
          investmentPortfolioCash: data.investmentPortfolio?.cash,
          investmentPortfolioOther: data.investmentPortfolio?.other,
          debtInfoMortgage: data.debtInfo?.mortgage,
          debtInfoCarLoan: data.debtInfo?.carLoan,
          debtInfoStudentLoan: data.debtInfo?.studentLoan,
          debtInfoCreditCard: data.debtInfo?.creditCard,
          debtInfoOther: data.debtInfo?.other
        }
      })
    }

    // 업데이트된 데이터 반환
    const updatedData = await prisma.financialData.findFirst({
      where: { userId }
    })

    const responseData = {
      id: updatedData!.id,
      currentAssets: updatedData!.currentAssets,
      monthlyIncome: updatedData!.monthlyIncome,
      monthlyExpenses: {
        housing: updatedData!.monthlyExpensesHousing,
        food: updatedData!.monthlyExpensesFood,
        transportation: updatedData!.monthlyExpensesTransportation,
        utilities: updatedData!.monthlyExpensesUtilities,
        healthcare: updatedData!.monthlyExpensesHealthcare,
        entertainment: updatedData!.monthlyExpensesEntertainment,
        education: updatedData!.monthlyExpensesEducation,
        other: updatedData!.monthlyExpensesOther
      },
      monthlySavings: {
        emergency: updatedData!.monthlySavingsEmergency,
        investment: updatedData!.monthlySavingsInvestment,
        retirement: updatedData!.monthlySavingsRetirement,
        other: updatedData!.monthlySavingsOther
      },
      investmentPortfolio: {
        stocks: updatedData!.investmentPortfolioStocks,
        bonds: updatedData!.investmentPortfolioBonds,
        realEstate: updatedData!.investmentPortfolioRealEstate,
        cash: updatedData!.investmentPortfolioCash,
        other: updatedData!.investmentPortfolioOther
      },
      debtInfo: {
        mortgage: updatedData!.debtInfoMortgage,
        carLoan: updatedData!.debtInfoCarLoan,
        studentLoan: updatedData!.debtInfoStudentLoan,
        creditCard: updatedData!.debtInfoCreditCard,
        other: updatedData!.debtInfoOther
      },
      createdAt: updatedData!.createdAt.toISOString(),
      updatedAt: updatedData!.updatedAt.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: responseData,
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
