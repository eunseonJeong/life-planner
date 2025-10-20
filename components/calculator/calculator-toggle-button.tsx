'use client'

import { useState } from 'react'
import { Calculator as CalculatorIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calculator } from 'react-calcboard'

// react-calcboard를 사용한 계산기 컴포넌트
const CalcBoardComponent = () => {
  return (
    <div className="w-64">
      <Calculator 
        orientation="portrait"
        enableKeyboard={true}
        theme={{
          numberButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
          operationButton: 'bg-orange-500 hover:bg-orange-600 text-white',
          functionButton: 'bg-gray-500 hover:bg-gray-600 text-white',
          display: 'bg-gray-900 text-white',
          container: 'bg-gray-100',
        }}
      />
    </div>
  )
}

export const CalculatorToggleButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 계산기 토글 버튼 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <CalculatorIcon className="h-6 w-6 text-white" />
        )}
      </Button>

      {/* 계산기 패널 */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2">
          <Card className="p-0 shadow-2xl border-0">
            <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">계산기</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4">
              <CalcBoardComponent />
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
