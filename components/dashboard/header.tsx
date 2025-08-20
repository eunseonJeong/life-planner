'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Settings, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // localStorage에서 사용자 정보 가져오기
    const userId = localStorage.getItem('userId')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')

    if (userId && userEmail) {
      setUser({
        id: userId,
        email: userEmail,
        name: userName || '사용자'
      })
    }
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      // localStorage 클리어
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      
      if (response.ok) {
        router.push('/auth')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      // 에러가 발생해도 로컬 스토리지는 클리어
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      router.push('/auth')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => router.push('/')}>Life Planner</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" disabled>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/settings')}>
            <Settings className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>
                {user?.name?.charAt(0) || '사'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || '사용자'}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
