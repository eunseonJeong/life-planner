'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 로그인 상태 확인
    const userId = localStorage.getItem('userId')
    if (userId) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Life Planner
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            인생 목표를 체계적으로 계획하고 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>커리어 계획</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                성장 로드맵과 기술 스택, 연봉 목표를 체계적으로 관리
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>재무 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                자산 관리와 투자 계획, 목표 달성 시점을 자동 계산
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>부동산 계획</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                지역별 분석과 구입 전략, 청약 정보를 종합적으로 제공
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-x-4">
          <Button 
            size="lg" 
            onClick={() => router.push('/auth')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            시작하기
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/api-test')}
          >
            API 테스트
          </Button>
        </div>
      </div>
    </div>
  )
}
