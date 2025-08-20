import { 
  LayoutDashboard,
  Briefcase,
  Home,
  TrendingUp,
  Heart,
  Target,
  Calculator,
  BarChart3
} from 'lucide-react'

export interface MenuItem {
  key: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  required: boolean
}

export interface AlarmSetting {
  key: string
  name: string
  description: string
  enabled: boolean
}

export const menuItems: MenuItem[] = [
  { 
    key: 'dashboard', 
    name: '대시보드', 
    description: '전체 현황을 한눈에 볼 수 있는 메인 페이지', 
    icon: LayoutDashboard, 
    required: true 
  },
  { 
    key: 'career', 
    name: '커리어 계획', 
    description: '직업 성장과 기술 개발 계획 관리', 
    icon: Briefcase, 
    required: false 
  },
  { 
    key: 'realEstate', 
    name: '부동산', 
    description: '부동산 투자 및 거주지 계획 관리', 
    icon: Home, 
    required: false 
  },
  { 
    key: 'finance', 
    name: '자산 관리', 
    description: '재무 계획과 투자 포트폴리오 관리', 
    icon: TrendingUp, 
    required: false 
  },
  { 
    key: 'relationship', 
    name: '관계/결혼', 
    description: '연애, 결혼 준비 및 관계 관리', 
    icon: Heart, 
    required: false 
  },
  { 
    key: 'goals', 
    name: '목표 관리', 
    description: '인생 목표 설정 및 추적 관리', 
    icon: Target, 
    required: false 
  },
  { 
    key: 'calculator', 
    name: '재무계산기', 
    description: '재무 목표 달성 시점 자동 계산', 
    icon: Calculator, 
    required: false 
  },
  { 
    key: 'analytics', 
    name: '분석 리포트', 
    description: '목표 달성 현황 및 분석 리포트', 
    icon: BarChart3, 
    required: false 
  }
]

export const alarmItems: AlarmSetting[] = [
  { 
    key: 'goalReminder', 
    name: '목표 리마인더', 
    description: '목표 마감일 7일 전 알림', 
    enabled: false 
  },
  // { 
  //   key: 'budgetAlert', 
  //   name: '예산 알림', 
  //   description: '월 예산 초과 시 알림', 
  //   enabled: false 
  // },
  // { 
  //   key: 'milestoneNotification', 
  //   name: '마일스톤 달성', 
  //   description: '중간 목표 달성 시 축하 알림', 
  //   enabled: false 
  // },
  // { 
  //   key: 'weeklyReport', 
  //   name: '주간 리포트', 
  //   description: '매주 일요일 진행상황 리포트', 
  //   enabled: false 
  // },
  // { 
  //   key: 'monthlyReview', 
  //   name: '월간 리뷰', 
  //   description: '매월 말 목표 달성도 리뷰', 
  //   enabled: false 
  // }
]
