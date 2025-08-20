'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus } from 'lucide-react'
import { TechStack } from '@/types/career'

interface TechStackSelectorProps {
  selectedTechs: string[]
  onTechsChange: (techs: string[]) => void
  label?: string
  placeholder?: string
}

export function TechStackSelector({
  selectedTechs,
  onTechsChange,
  label = '기술 스택',
  placeholder = '기술을 검색하세요...'
}: TechStackSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  // 기술 스택을 카테고리별로 그룹화
  const techStackGroups = {
    'Frontend': [
      TechStack.REACT, TechStack.VUE, TechStack.ANGULAR, TechStack.NEXTJS,
      TechStack.NUXT, TechStack.TYPESCRIPT, TechStack.JAVASCRIPT,
      TechStack.HTML, TechStack.CSS, TechStack.SASS, TechStack.TAILWIND
    ],
    'Backend': [
      TechStack.NODEJS, TechStack.EXPRESS, TechStack.NESTJS, TechStack.PYTHON,
      TechStack.DJANGO, TechStack.FLASK, TechStack.JAVA, TechStack.SPRING,
      TechStack.KOTLIN, TechStack.GO, TechStack.RUST, TechStack.PHP, TechStack.LARAVEL
    ],
    'Database': [
      TechStack.MYSQL, TechStack.POSTGRESQL, TechStack.MONGODB,
      TechStack.REDIS, TechStack.ELASTICSEARCH
    ],
    'Cloud & DevOps': [
      TechStack.AWS, TechStack.AZURE, TechStack.GCP, TechStack.DOCKER,
      TechStack.KUBERNETES, TechStack.JENKINS, TechStack.GITHUB_ACTIONS
    ],
    'Mobile': [
      TechStack.REACT_NATIVE, TechStack.FLUTTER, TechStack.SWIFT, TechStack.KOTLIN_ANDROID
    ],
    'AI & ML': [
      TechStack.TENSORFLOW, TechStack.PYTORCH, TechStack.SCIKIT_LEARN
    ],
    'Others': [
      TechStack.GIT, TechStack.GRAPHQL, TechStack.REST_API,
      TechStack.MICROSERVICES, TechStack.SYSTEM_DESIGN
    ]
  }

  // 검색어에 맞는 기술 스택 필터링
  const filteredTechs = Object.entries(techStackGroups).reduce((acc, [category, techs]) => {
    const filtered = techs.filter(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTechs.includes(tech)
    )
    if (filtered.length > 0) {
      acc[category] = filtered
    }
    return acc
  }, {} as Record<string, string[]>)

  const handleAddTech = (tech: string) => {
    if (!selectedTechs.includes(tech)) {
      onTechsChange([...selectedTechs, tech])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleRemoveTech = (techToRemove: string) => {
    onTechsChange(selectedTechs.filter(tech => tech !== techToRemove))
  }

  const handleInputFocus = () => {
    setShowDropdown(true)
  }

  const handleInputBlur = () => {
    // 드롭다운 클릭을 위해 약간의 지연
    setTimeout(() => setShowDropdown(false), 200)
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* 선택된 기술 스택 뱃지들 */}
      {selectedTechs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTechs.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {tech}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveTech(tech)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* 검색 입력 */}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* 드롭다운 */}
      {showDropdown && Object.keys(filteredTechs).length > 0 && (
        <div className="absolute z-50 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          {Object.entries(filteredTechs).map(([category, techs]) => (
            <div key={category}>
              <div className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-50 border-b">
                {category}
              </div>
              <div className="p-2">
                {techs.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    onClick={() => handleAddTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 선택된 기술이 없을 때 안내 메시지 */}
      {selectedTechs.length === 0 && (
        <p className="text-sm text-gray-500">
          기술 스택을 검색하여 추가해주세요
        </p>
      )}
    </div>
  )
}
