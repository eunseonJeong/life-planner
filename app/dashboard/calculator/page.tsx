"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Edit,
  Trash2,
  Save,
} from "lucide-react";
import { CalculatorModal } from "@/components/calculator/calculator-modal";
import {
  CalculatorData,
  CalculatorFormData,
  CalculationResult,
} from "@/types/calculator";
import { getCalculatorData, deleteCalculatorData } from "@/lib/api/calculator";
import { getCurrentUserId } from "@/lib/auth";

export default function CalculatorPage() {
  const [calculatorList, setCalculatorList] = useState<CalculatorData[]>([]);
  const [selectedCalculator, setSelectedCalculator] =
    useState<CalculatorData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [results, setResults] = useState<CalculationResult | null>(null);

  // 초기 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const userId = getCurrentUserId();
        const response = await getCalculatorData(userId);
        if (response.success && response.data) {
          setCalculatorList(response.data);
          // 첫 번째 계산기를 기본 선택
          if (response.data.length > 0 && !selectedCalculator) {
            setSelectedCalculator(response.data[0]);
          }
        }
      } catch (error) {
        console.error("계산기 데이터 로드 실패:", error);
        setCalculatorList([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 선택된 계산기 변경 시 결과 재계산
  useEffect(() => {
    if (selectedCalculator) {
      calculateFinancialPlan(selectedCalculator);
    }
  }, [selectedCalculator]);

  const calculateFinancialPlan = (data: CalculatorData) => {
    const {
      currentAge,
      currentSalary,
      monthlyExpenses,
      monthlySavings,
      investmentReturn,
      targetAmount,
    } = data;

    // 월 저축액 계산
    const monthlyIncome = currentSalary / 12;
    const actualMonthlySavings = monthlyIncome - monthlyExpenses;

    // 복리 계산 (월 단위)
    const monthlyReturn = investmentReturn / 100 / 12;
    let currentAmount = 0;
    let months = 0;
    let yearlyData = [];

    while (currentAmount < targetAmount && months < 600) {
      // 최대 50년
      currentAmount =
        currentAmount * (1 + monthlyReturn) + actualMonthlySavings;
      months++;

      if (months % 12 === 0) {
        yearlyData.push({
          year: currentAge + Math.floor(months / 12),
          age: currentAge + Math.floor(months / 12),
          amount: Math.round(currentAmount),
          monthlySavings: actualMonthlySavings,
        });
      }
    }

    const targetYear = currentAge + Math.floor(months / 12);
    const targetMonth = months % 12;

    setResults({
      targetYear,
      targetMonth,
      currentAmount: Math.round(currentAmount),
      yearlyData,
      monthlySavings: actualMonthlySavings,
      totalMonths: months,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const getPortfolioColor = (type: keyof CalculatorData["portfolio"]) => {
    switch (type) {
      case "etf":
        return "bg-blue-500";
      case "stocks":
        return "bg-green-500";
      case "realEstate":
        return "bg-purple-500";
      case "cash":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCalculator = async (data: CalculatorFormData) => {
    try {
      // 계산기 저장 후 목록을 다시 로드
      const userId = getCurrentUserId();
      const response = await getCalculatorData(userId);
      if (response.success && response.data) {
        setCalculatorList(response.data);
        // 새로 추가된 계산기를 선택
        if (modalMode === "create") {
          const newCalculator = response.data.find(
            (item) => item.name === data.name
          );
          if (newCalculator) {
            setSelectedCalculator(newCalculator);
          }
        }
      }
    } catch (error) {
      console.error("계산기 저장 실패:", error);
    }
  };

  const handleDeleteCalculator = async (id: string) => {
    if (!confirm("정말로 이 계산기를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const userId = getCurrentUserId();
      await deleteCalculatorData(id, userId);
      const response = await getCalculatorData(userId);
      if (response.success && response.data) {
        setCalculatorList(response.data);
        // 삭제된 계산기가 현재 선택된 것이라면 첫 번째 계산기 선택
        if (selectedCalculator?.id === id) {
          setSelectedCalculator(
            response.data.length > 0 ? response.data[0] : null
          );
        }
      }
    } catch (error) {
      console.error("계산기 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleSelectCalculator = (calculator: CalculatorData) => {
    setSelectedCalculator(calculator);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">재무계산기</h1>
          <p className="text-gray-600">
            연봉별 1억 달성 시점을 자동으로 계산해보세요
          </p>
        </div>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" />새 계산기 추가
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">계산기 정보를 불러오는 중...</p>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 - 데이터가 없을 때 */}
      {!isLoading && calculatorList.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              계산기가 없습니다
            </h3>
            <p className="text-gray-600 mb-4">
              새로운 재무 계산기를 추가해보세요!
            </p>
            <Button onClick={handleOpenCreateModal}>
              <Plus className="mr-2 h-4 w-4" />새 계산기 추가
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 데이터가 있을 때만 표시 */}
      {!isLoading && calculatorList.length > 0 && (
        <>
          {/* 계산기 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  계산기 선택
                </div>
                {selectedCalculator && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleOpenEditModal}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      수정
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteCalculator(selectedCalculator.id!)
                      }
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      삭제
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {calculatorList.map((calculator) => (
                  <div
                    key={calculator.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedCalculator?.id === calculator.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectCalculator(calculator)}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {calculator.name}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>현재 나이: {calculator.currentAge}세</p>
                      <p>
                        현재 연봉: {formatCurrency(calculator.currentSalary)}원
                      </p>
                      <p>
                        목표 금액: {formatCurrency(calculator.targetAmount)}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 선택된 계산기 결과 표시 */}
          {selectedCalculator && results && (
            <>
              {/* 계산 결과 요약 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    계산 결과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {results.targetYear}년
                      </div>
                      <p className="text-sm text-gray-600">목표 달성 연도</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {results.targetMonth}개월
                      </div>
                      <p className="text-sm text-gray-600">추가 필요 개월</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(results.monthlySavings)}원
                      </div>
                      <p className="text-sm text-gray-600">월 저축액</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatCurrency(results.currentAmount)}원
                      </div>
                      <p className="text-sm text-gray-600">최종 자산</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 연도별 자산 변화 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    연도별 자산 변화
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.yearlyData.map((yearData, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">
                            {yearData.year}년 ({yearData.age}세)
                          </h3>
                          <p className="text-sm text-gray-600">
                            월 저축: {formatCurrency(yearData.monthlySavings)}원
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(yearData.amount)}원
                          </div>
                          <p className="text-sm text-gray-600">예상 자산</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 포트폴리오 분포 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    포트폴리오 분포
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedCalculator.portfolio).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 ${getPortfolioColor(
                                key as keyof CalculatorData["portfolio"]
                              )} rounded`}
                            ></div>
                            <span className="capitalize">{key}</span>
                          </div>
                          <span className="font-medium">{value}%</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {/* 계산기 모달 */}
      <CalculatorModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCalculator}
        initialData={
          modalMode === "edit" && selectedCalculator
            ? selectedCalculator
            : undefined
        }
        mode={modalMode}
      />
    </div>
  );
}
