'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { menuItems } from '@/lib/data/settings-items'

const navigation = menuItems.map(item => ({
  key: item.key,
  name: item.name,
  href: item.key === 'dashboard' ? '/dashboard' : `/dashboard/${item.key === 'realEstate' ? 'real-estate' : item.key}`,
  icon: item.icon
}))

export function Sidebar() {
  const pathname = usePathname()
  const [menuSettings, setMenuSettings] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    // localStorage에서 메뉴 설정 불러오기
    const savedSettings = localStorage.getItem('menuSettings')
    if (savedSettings) {
      setMenuSettings(JSON.parse(savedSettings))
    } else {
      // 기본값: 모든 메뉴 활성화
      const defaultSettings = navigation.reduce((acc, item) => {
        acc[item.key] = true
        return acc
      }, {} as {[key: string]: boolean})
      setMenuSettings(defaultSettings)
      localStorage.setItem('menuSettings', JSON.stringify(defaultSettings))
    }
  }, [])

  // 설정 변경을 감지하기 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('menuSettings')
      if (savedSettings) {
        setMenuSettings(JSON.parse(savedSettings))
      }
    }

    const handleMenuSettingsChanged = (event: CustomEvent) => {
      setMenuSettings(event.detail)
    }

    // storage 이벤트는 다른 탭에서만 발생하므로, 주기적으로 확인
    const interval = setInterval(() => {
      const savedSettings = localStorage.getItem('menuSettings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        if (JSON.stringify(parsed) !== JSON.stringify(menuSettings)) {
          setMenuSettings(parsed)
        }
      }
    }, 1000)

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('menuSettingsChanged', handleMenuSettingsChanged as EventListener)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('menuSettingsChanged', handleMenuSettingsChanged as EventListener)
      clearInterval(interval)
    }
  }, [menuSettings])

  // 설정이 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    if (Object.keys(menuSettings).length > 0) {
      localStorage.setItem('menuSettings', JSON.stringify(menuSettings))
    }
  }, [menuSettings])

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isVisible = menuSettings[item.key] !== false // 기본값은 true

            if (!isVisible) return null

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
