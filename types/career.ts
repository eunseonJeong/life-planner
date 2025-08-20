export interface CareerGoal {
  id: string
  year: number
  targetSalary: number
  currentSalary: number
  sideIncomeTarget: number
  techStack: string[]
  portfolioCount: number
  networkingGoals: string
  learningGoals: string
}

export interface RoadmapItem {
  id: string
  title: string
  description: string
  year: number
  quarter: number
  status: 'completed' | 'in-progress' | 'planned'
  skills: string[]
}

export enum TechStack {
  // Frontend
  REACT = 'React',
  VUE = 'Vue.js',
  ANGULAR = 'Angular',
  NEXTJS = 'Next.js',
  NUXT = 'Nuxt.js',
  TYPESCRIPT = 'TypeScript',
  JAVASCRIPT = 'JavaScript',
  HTML = 'HTML',
  CSS = 'CSS',
  SASS = 'Sass',
  TAILWIND = 'Tailwind CSS',
  
  // Backend
  NODEJS = 'Node.js',
  EXPRESS = 'Express.js',
  NESTJS = 'NestJS',
  PYTHON = 'Python',
  DJANGO = 'Django',
  FLASK = 'Flask',
  JAVA = 'Java',
  SPRING = 'Spring Boot',
  KOTLIN = 'Kotlin',
  GO = 'Go',
  RUST = 'Rust',
  PHP = 'PHP',
  LARAVEL = 'Laravel',
  
  // Database
  MYSQL = 'MySQL',
  POSTGRESQL = 'PostgreSQL',
  MONGODB = 'MongoDB',
  REDIS = 'Redis',
  ELASTICSEARCH = 'Elasticsearch',
  
  // Cloud & DevOps
  AWS = 'AWS',
  AZURE = 'Azure',
  GCP = 'Google Cloud',
  DOCKER = 'Docker',
  KUBERNETES = 'Kubernetes',
  JENKINS = 'Jenkins',
  GITHUB_ACTIONS = 'GitHub Actions',
  
  // Mobile
  REACT_NATIVE = 'React Native',
  FLUTTER = 'Flutter',
  SWIFT = 'Swift',
  KOTLIN_ANDROID = 'Kotlin (Android)',
  
  // AI & ML
  TENSORFLOW = 'TensorFlow',
  PYTORCH = 'PyTorch',
  SCIKIT_LEARN = 'Scikit-learn',
  
  // Others
  GIT = 'Git',
  GRAPHQL = 'GraphQL',
  REST_API = 'REST API',
  MICROSERVICES = 'Microservices',
  SYSTEM_DESIGN = 'System Design'
}

export interface CareerGoalFormData {
  year: number
  targetSalary: number
  currentSalary: number
  sideIncomeTarget: number
  techStack: string[]
  portfolioCount: number
  networkingGoals: string
  learningGoals: string
}
