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
  AlertTriangle
} from 'lucide-react'
import { menuItems, alarmItems, type MenuItem, type AlarmSetting } from '@/lib/data/settings-items'

export default function SettingsPage() {
  const [menuSettings, setMenuSettings] = useState<{[key: string]: boolean}>({})
  const [alarmSettings, setAlarmSettings] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    // localStorage에서 설정 불러오기
    const savedMenuSettings = localStorage.getItem('menuSettings')
    const savedAlarmSettings = localStorage.getItem('alarmSettings')

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

    setMenuSettings(defaultMenuSettings)
    setAlarmSettings(defaultAlarmSettings)
    
    // 즉시 저장
    localStorage.setItem('menuSettings', JSON.stringify(defaultMenuSettings))
    localStorage.setItem('alarmSettings', JSON.stringify(defaultAlarmSettings))
    
    // 설정 변경을 다른 컴포넌트에 알리기 위한 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent('menuSettingsChanged', {
      detail: defaultMenuSettings
    }))
  }

  const visibleMenuCount = Object.values(menuSettings).filter(Boolean).length
  const totalMenuCount = menuItems.length

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">설정</h1>
          <p className="text-gray-600">앱 설정과 개인화 옵션을 관리하세요</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            초기화
          </Button>
        </div>
      </div>

      {/* 메뉴 표시 설정 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Menu className="mr-2 h-5 w-5" />
            메뉴 표시 설정
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {visibleMenuCount}/{totalMenuCount} 메뉴 표시
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                                 <div className="flex items-center space-x-3">
                   <item.icon className="h-6 w-6 text-gray-600" />
                   <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                                 <div className="flex items-center space-x-2">
                   {item.required && (
                     <Badge variant="secondary" className="text-xs">
                       필수
                     </Badge>
                   )}
                   {menuSettings[item.key] ? (
                     <Eye className="h-4 w-4 text-green-500" />
                   ) : (
                     <EyeOff className="h-4 w-4 text-gray-400" />
                   )}
                   <Switch
                     checked={menuSettings[item.key] || false}
                     onCheckedChange={(enabled) => handleMenuToggle(item.key, enabled)}
                     disabled={item.required}
                   />
                 </div>
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
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-yellow-600">알람 기능은 현재 개발 중입니다</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
                         {alarmItems.map((item) => (
               <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg opacity-50">
                 <div>
                   <h3 className="font-medium">{item.name}</h3>
                   <p className="text-sm text-gray-600">{item.description}</p>
                   <Badge variant="secondary" className="mt-1 text-xs">
                     개발 중
                   </Badge>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Switch
                     checked={false}
                     disabled={true}
                   />
                 </div>
               </div>
             ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                알람 기능은 아직 구현되지 않았습니다. 추후 업데이트에서 제공될 예정입니다.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 설정 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            설정 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">저장된 설정</h3>
                             <div className="space-y-1 text-sm text-gray-600">
                 <div>메뉴 설정: {visibleMenuCount}/{totalMenuCount} 활성화</div>
                 <div>알람 설정: 0/{alarmItems.length} 활성화 (개발 중)</div>
                 <div>마지막 저장: 방금 전</div>
               </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">설정 관리</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>설정은 브라우저에 저장됩니다</div>
                <div>브라우저 데이터 삭제 시 초기화됩니다</div>
                <div>변경사항은 즉시 적용됩니다</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
