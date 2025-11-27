'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, LogOut, Home } from 'lucide-react'
import { NotificationBell } from '@/components/notifications/notification-bell'
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
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className=" mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => router.push('/')}>
                Life Planner
              </h1>
              <p className="text-sm text-gray-600">인생의 모든 순간, 함께</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              <Home className="h-5 w-5" />
            </Button>
            
            {user ? (
              // 로그인한 사용자 UI
              <>
                <NotificationBell />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/dashboard/settings')}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold">
                      {user?.name?.charAt(0) || '사'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user?.name || '사용자'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.email || 'user@example.com'}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              // 로그인하지 않은 사용자 UI
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => router.push('/auth')}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  로그인
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => router.push('/auth')}
                  className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  회원가입
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
