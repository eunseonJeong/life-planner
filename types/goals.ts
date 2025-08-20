export interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: string
  targetValue: number
  currentValue: number
  unit: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused'
  milestones: Milestone[]
  createdAt: string
}

export interface Milestone {
  id: string
  title: string
  targetValue: number
  currentValue: number
  dueDate: string
  status: 'completed' | 'in-progress' | 'planned'
}

export interface GoalFormData {
  id?: string
  title: string
  description: string
  category: string
  targetDate: string
  targetValue: number
  currentValue: number
  unit: string
  priority: 'high' | 'medium' | 'low'
  status: 'active' | 'completed' | 'paused'
  milestones: Milestone[]
}

export interface MilestoneFormData {
  id?: string
  title: string
  targetValue: number
  currentValue: number
  dueDate: string
  status: 'completed' | 'in-progress' | 'planned'
}
