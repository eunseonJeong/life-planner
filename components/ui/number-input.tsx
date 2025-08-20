'use client'

import React, { forwardRef } from 'react'
import { Input } from './input'
import { cn } from '@/lib/utils'

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
  placeholder?: string
  className?: string
  showCommas?: boolean // 천 단위 구분자 표시 여부
  min?: number
  max?: number
  readOnly?: boolean
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value = 0, onChange, placeholder, className, showCommas = true, min, max, ...props }, ref) => {
    // 숫자 입력 필드의 포맷팅된 값을 표시하기 위한 함수
    const formatNumberForDisplay = (numValue: number): string => {
      if (numValue === 0) return ''
      return showCommas ? numValue.toLocaleString() : numValue.toString()
    }

    // 숫자 입력 필드의 값을 파싱하는 함수
    const parseNumberInput = (inputValue: string): number => {
      const numericValue = inputValue.replace(/[^\d]/g, '')
      const parsedValue = numericValue ? parseInt(numericValue) : 0
      
      // min, max 제한 적용
      if (min !== undefined && parsedValue < min) return min
      if (max !== undefined && parsedValue > max) return max
      
      return parsedValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseNumberInput(e.target.value)
      onChange?.(newValue)
    }

    return (
      <Input
        ref={ref}
        type="text"
        value={formatNumberForDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(className)}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'
