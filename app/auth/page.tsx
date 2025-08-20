'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Response parsing error:', parseError)
        setError('서버 응답을 처리할 수 없습니다.')
        return
      }

      if (!response.ok) {
        setError(data.error || '오류가 발생했습니다.')
        return
      }

      // 성공 시 대시보드로 리다이렉트
      if (data.user?.id) {
        // 사용자 ID를 localStorage에 저장
        localStorage.setItem('userId', data.user.id)
        localStorage.setItem('userEmail', data.user.email)
        if (data.user.name) {
          localStorage.setItem('userName', data.user.name)
        }
        
        // getCurrentUserId 함수에서 사용할 수 있도록 설정
        if (typeof window !== 'undefined') {
          // @ts-ignore
          window.setCurrentUserId?.(data.user.id)
        }
        
        router.push('/dashboard')
      } else {
        setError('사용자 정보를 받을 수 없습니다.')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('네트워크 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">
            {isSignup ? '회원가입' : '로그인'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {isSignup ? '새 계정을 만들어보세요' : '계정에 로그인하세요'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? '회원가입' : '로그인'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsSignup(!isSignup)}
              disabled={loading}
            >
              {isSignup ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </Button>
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => router.push('/api-test')}
              disabled={loading}
              className="text-sm"
            >
              API 테스트 페이지
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
