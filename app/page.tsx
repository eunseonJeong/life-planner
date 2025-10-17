"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/dashboard/header";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인 (배포 문제로 임시 주석 처리)
    // const userId = localStorage.getItem('userId')
    // if (userId) {
    //   router.push('/dashboard')
    // }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* Header */}
     <Header />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-blue-600 font-semibold">
                  인생 설계 플랫폼
                </p>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  미래로 도약하는
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    인생 설계
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  커리어, 재무, 부동산, 관계까지
                  <br />
                  체계적으로 계획하고 관리하세요
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                >
                  시작하기 <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">
                        <Image
                          src="/icons/bag_icon.png"
                          alt="커리어"
                          width={48}
                          height={48}
                        />
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">커리어</h3>
                    <p className="text-sm text-gray-600">성장 로드맵 관리</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">
                        <Image
                          src="/icons/money_icon.png"
                          alt="재무"
                          width={48}
                          height={48}
                        />
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">재무</h3>
                    <p className="text-sm text-gray-600">자산 관리</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">
                        <Image
                          src="/icons/home_icon.png"
                          alt="부동산"
                          width={48}
                          height={48}
                        />
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">부동산</h3>
                    <p className="text-sm text-gray-600">구입 계획</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-2xl">
                      <Image
                          src="/icons/heart_icon.png"
                          alt="관계"
                          width={48}
                          height={48}
                        />
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">관계</h3>
                    <p className="text-sm text-gray-600">인생 계획</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">주요 기능</h2>
            <p className="text-xl text-gray-600">
              인생의 모든 영역을 체계적으로 관리하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">
                  <Image
                      src="/icons/bag_icon.png"
                      alt="커리어"
                      width={48}
                      height={48}
                    />
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  커리어 계획
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  성장 로드맵과 기술 스택, 연봉 목표를 체계적으로 관리하고
                  <br />
                  목표 달성을 위한 구체적인 계획을 세우세요
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">
                  <Image
                      src="/icons/money_icon.png"
                      alt="재무"
                      width={48}
                      height={48}
                    />
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  재무 관리
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  자산 관리와 투자 계획, 목표 달성 시점을 자동 계산하여
                  <br />
                  체계적인 재무 설계를 도와드립니다
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">
                    <Image
                      src="/icons/home_icon.png"
                      alt="부동산"
                      width={48}
                      height={48}
                    />
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  부동산 계획
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  지역별 분석과 구입 전략, 청약 정보를 종합적으로 제공하여
                  <br />
                  최적의 부동산 투자 계획을 세우세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            지금 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            체계적인 인생 설계로 더 나은 미래를 만들어가세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/dashboard")}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              무료로 시작하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/auth")}
              className="border-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              로그인
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">LP</span>
                </div>
                <span className="text-xl font-bold">Life Planner</span>
              </div>
              <p className="text-gray-400">
                인생의 모든 순간을 체계적으로 계획하고 관리하는 통합 플랫폼
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    커리어 계획
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    재무 관리
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    부동산 계획
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    관계 관리
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    공지사항
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">법적 고지</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    서비스 정책
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Life Planner. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
