'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Menu, 
  Bell, 
  RefreshCw,
  Eye,
  EyeOff,
  AlertTriangle,
  LayoutDashboard
} from 'lucide-react'
import { menuItems, alarmItems, dashboardItems, type MenuItem, type AlarmSetting, type DashboardItem } from '@/lib/data/settings-items'

export default function SettingsPage() {
  const [menuSettings, setMenuSettings] = useState<{[key: string]: boolean}>({})
  const [alarmSettings, setAlarmSettings] = useState<{[key: string]: boolean}>({})
  const [dashboardSettings, setDashboardSettings] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    // localStorage에서 설정 불러오기
    const savedMenuSettings = localStorage.getItem('menuSettings')
    const savedAlarmSettings = localStorage.getItem('alarmSettings')
    const savedDashboardSettings = localStorage.getItem('dashboardSettings')

    if (savedMenuSettings) {
      setMenuSettings(JSON.parse(savedMenuSettings))
    } else {
      // 기본값: 필수 메뉴는 항상 활성화, 나머지는 활성화
      const defaultMenuSettings = menuItems.reduce((acc, item) => {
        acc[item.key] = item.required ? true : true
        return acc
      }, {} as {[key: string]: boolean})
      setMenuSettings(defaultMenuSettings)
    }

    if (savedAlarmSettings) {
      setAlarmSettings(JSON.parse(savedAlarmSettings))
    } else {
      // 기본값: 모든 알람 비활성화 (아직 구현되지 않음)
      const defaultAlarmSettings = alarmItems.reduce((acc, item) => {
        acc[item.key] = false
        return acc
      }, {} as {[key: string]: boolean})
      setAlarmSettings(defaultAlarmSettings)
    }

    if (savedDashboardSettings) {
      setDashboardSettings(JSON.parse(savedDashboardSettings))
    } else {
      // 기본값: 모든 대시보드 항목 활성화
      const defaultDashboardSettings = dashboardItems.reduce((acc, item) => {
        acc[item.key] = item.enabled
        return acc
      }, {} as {[key: string]: boolean})
      setDashboardSettings(defaultDashboardSettings)
    }
  }, [])

  const handleMenuToggle = (key: string, enabled: boolean) => {
    // 필수 메뉴는 비활성화할 수 없음
    const menuItem = menuItems.find(item => item.key === key)
    if (menuItem?.required && !enabled) {
      return
    }
    
    const newSettings = {
      ...menuSettings,
      [key]: enabled
    }
    setMenuSettings(newSettings)
    
    // 즉시 localStorage에 저장하고 다른 컴포넌트에 알림
    localStorage.setItem('menuSettings', JSON.stringify(newSettings))
    window.dispatchEvent(new CustomEvent('menuSettingsChanged', {
      detail: newSettings
    }))
  }

  const handleAlarmToggle = (key: string, enabled: boolean) => {
    const newSettings = {
      ...alarmSettings,
      [key]: enabled
    }
    setAlarmSettings(newSettings)
    
    // 즉시 localStorage에 저장
    localStorage.setItem('alarmSettings', JSON.stringify(newSettings))
  }

  const handleDashboardToggle = (key: string, enabled: boolean) => {
    const newSettings = {
      ...dashboardSettings,
      [key]: enabled
    }
    setDashboardSettings(newSettings)
    
    // 즉시 localStorage에 저장하고 다른 컴포넌트에 알림
    localStorage.setItem('dashboardSettings', JSON.stringify(newSettings))
    window.dispatchEvent(new CustomEvent('dashboardSettingsChanged', {
      detail: newSettings
    }))
  }

  const handleReset = () => {
    // 기본값으로 초기화 (필수 메뉴는 항상 활성화)
    const defaultMenuSettings = menuItems.reduce((acc, item) => {
      acc[item.key] = item.required ? true : true
      return acc
    }, {} as {[key: string]: boolean})

    const defaultAlarmSettings = alarmItems.reduce((acc, item) => {
      acc[item.key] = false
      return acc
    }, {} as {[key: string]: boolean})

    const defaultDashboardSettings = dashboardItems.reduce((acc, item) => {
      acc[item.key] = item.enabled
      return acc
    }, {} as {[key: string]: boolean})

    setMenuSettings(defaultMenuSettings)
    setAlarmSettings(defaultAlarmSettings)
    setDashboardSettings(defaultDashboardSettings)
    
    // 즉시 저장
    localStorage.setItem('menuSettings', JSON.stringify(defaultMenuSettings))
    localStorage.setItem('alarmSettings', JSON.stringify(defaultAlarmSettings))
    localStorage.setItem('dashboardSettings', JSON.stringify(defaultDashboardSettings))
    
    // 이벤트 발생
    window.dispatchEvent(new CustomEvent('menuSettingsChanged', {
      detail: defaultMenuSettings
    }))
    window.dispatchEvent(new CustomEvent('dashboardSettingsChanged', {
      detail: defaultDashboardSettings
    }))
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-600">앱의 표시 및 알림 설정을 관리하세요</p>
        </div>
        <Button onClick={handleReset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          기본값으로 초기화
        </Button>
      </div>

      {/* 메뉴 표시 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Menu className="mr-2 h-5 w-5" />
            메뉴 표시 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Label className="font-medium">{item.name}</Label>
                      {item.required && (
                        <Badge variant="secondary" className="text-xs">필수</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={menuSettings[item.key] || false}
                  onCheckedChange={(enabled) => handleMenuToggle(item.key, enabled)}
                  disabled={item.required}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 대시보드 항목 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5" />
            대시보드 항목 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="font-medium">{item.name}</Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <Switch
                  checked={dashboardSettings[item.key] || false}
                  onCheckedChange={(enabled) => handleDashboardToggle(item.key, enabled)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 알람 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            알람 설정
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alarmItems.length > 0 ? (
              alarmItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="font-medium">{item.name}</Label>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Switch
                    checked={alarmSettings[item.key] || false}
                    onCheckedChange={(enabled) => handleAlarmToggle(item.key, enabled)}
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center p-8 text-center">
                <div>
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">알람 기능 준비 중</h3>
                  <p className="text-gray-600">알람 기능은 현재 개발 중입니다. 곧 사용할 수 있습니다!</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
