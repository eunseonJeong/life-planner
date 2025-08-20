'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApiTestPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const handleSignup = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })
      const data = await response.json()
      setResult(data)
      if (data.user?.id) {
        setUserId(data.user.id)
      }
    } catch (error) {
      setResult({ error: '요청 실패' })
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setResult(data)
      if (data.user?.id) {
        setUserId(data.user.id)
      }
    } catch (error) {
      setResult({ error: '요청 실패' })
    }
    setLoading(false)
  }

  const handleGetUserData = async () => {
    if (!userId) {
      setResult({ error: '먼저 로그인해주세요.' })
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/user/data?userId=${userId}`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: '요청 실패' })
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      const data = await response.json()
      setResult(data)
      setUserId(null)
    } catch (error) {
      setResult({ error: '요청 실패' })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">API 테스트</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>사용자 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">이름 (선택사항)</label>
              <Input
                type="text"
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">이메일</label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {userId && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>사용자 ID:</strong> {userId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API 테스트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleSignup} disabled={loading}>
                회원가입
              </Button>
              <Button onClick={handleLogin} disabled={loading}>
                로그인
              </Button>
              <Button onClick={handleGetUserData} disabled={loading || !userId}>
                데이터 조회
              </Button>
              <Button onClick={handleLogout} disabled={loading}>
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>결과</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
