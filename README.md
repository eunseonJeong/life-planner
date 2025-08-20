# Life Planner

인생 목표를 체계적으로 계획하고 관리하는 웹 애플리케이션입니다. 커리어, 재무, 부동산, 관계 등 다양한 영역의 목표를 설정하고 추적할 수 있으며, 실시간 분석과 예측 기능을 제공합니다.

## 🚀 주요 기능

- **대시보드**: 전체 현황을 한눈에 볼 수 있는 메인 페이지
- **커리어 계획**: 직업 성장과 기술 개발 계획 관리
- **부동산**: 부동산 투자 및 거주지 계획 관리
- **자산 관리**: 재무 계획과 투자 포트폴리오 관리
- **목표 관리**: 인생 목표 설정 및 추적 관리
- **재무계산기**: 재무 목표 달성 시점 자동 계산
- **분석 리포트**: 목표 달성 현황 및 분석 리포트
- **설정 관리**: 메뉴 표시/숨김 및 알람 설정

## 🛠 기술 스택

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Database**: SQLite (개발), PostgreSQL (프로덕션)
- **ORM**: Prisma
- **Authentication**: Supabase Auth (현재 Mock)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: localStorage (설정 관리)
- **Real-time Updates**: Custom Events


## 📚 API 문서

### 현재 구현 상태
- ✅ 인증 API (Prisma 연동 완료)
- ✅ 사용자 데이터 API (Prisma 연동 완료)
- ✅ 커리어 목표 API (Prisma 연동 완료)
- ✅ 로드맵 API (Prisma 연동 완료)
- ✅ 자산 관리 API (Prisma 연동 완료)
- ✅ 생애주기별 자금 계획 API (Prisma 연동 완료)
- ✅ 목표 관리 API (Prisma 연동 완료)
- ✅ 재무계산기 API (Prisma 연동 완료)
- ✅ 부동산 API (공공 API 연동 완료)
- ✅ 설정 관리 (localStorage 기반)
- ✅ 진행률 계산 유틸리티 (NaN 방지)
- ❌ 청약홈/부동산 크롤링 연동 (향후 구현 예정)

### 인증 API

#### POST /api/auth/signup
회원가입
```json
{
  "email": "user@example.com",
  "password": "password",
  "name": "사용자명"
}
```

#### POST /api/auth/login
로그인
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### POST /api/auth/logout
로그아웃

### 사용자 데이터 API

#### GET /api/user/data?userId={userId}
사용자 데이터 조회
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "사용자명",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "plans": [...],
  "careerGoals": [...],
  "financialData": [...],
  "realEstateData": [...],
  "relationshipData": [...]
}
```

### 커리어 목표 API

#### POST /api/career-goals
커리어 목표 생성/수정
```json
{
  "year": 2025,
  "targetSalary": 80000000,
  "currentSalary": 35000000,
  "sideIncomeTarget": 10000000,
  "techStack": ["React", "Node.js", "TypeScript"],
  "portfolioCount": 3,
  "networkingGoals": "개발자 커뮤니티 활동, 컨퍼런스 참여",
  "learningGoals": "시스템 설계, 클라우드 아키텍처"
}
```

#### GET /api/career-goals
커리어 목표 조회

### 로드맵 API

#### POST /api/roadmap
로드맵 저장
```json
[
  {
    "id": "1",
    "title": "기초 다지기",
    "description": "React, TypeScript 마스터",
    "year": 2024,
    "quarter": 4,
    "status": "completed",
    "skills": ["React", "TypeScript", "Next.js"]
  }
]
```

#### GET /api/roadmap
로드맵 조회

### 부동산 API (공공 API 연동 완료)

#### GET /api/real-estate
실거래가 정보 조회 (국토교통부 공공 API 연동)


#### POST /api/real-estate
지역 목록 조회 (법정동코드 기반)
```json
[
  {
    "value": "11680",
    "label": "서울특별시 강남구",
    "category": "서울특별시",
    "bjdCode": "11680"
  }
]
```

**설정 방법:**
1. [공공데이터포털](https://www.data.go.kr/data/15057511/openapi.do)에서 서비스키 발급
2. `.env.local` 파일에 `NEXT_PUBLIC_PUBLIC_API_KEY=your_key_here` 추가
커리어 목표 조회
```json
{
  "data": [
    {
      "id": "1",
      "year": 2025,
      "targetSalary": 80000000,
      "currentSalary": 35000000,
      "sideIncomeTarget": 10000000,
      "techStack": ["React", "Node.js", "TypeScript"],
      "portfolioCount": 3,
      "networkingGoals": "개발자 커뮤니티 활동, 컨퍼런스 참여",
      "learningGoals": "시스템 설계, 클라우드 아키텍처"
    }
  ],
  "count": 1
}
```

### 자산 관리 API (Prisma 연동 완료)

#### GET /api/finance?userId={userId}
자산 정보 조회

#### POST /api/finance
자산 정보 생성/수정
```json
{
  "userId": "uuid",
  "currentAssets": 50000000,
  "monthlyIncome": 3500000,
  "monthlyExpensesHousing": 800000,
  "monthlyExpensesFood": 400000,
  "monthlySavingsEmergency": 500000,
  "monthlySavingsInvestment": 1000000,
  "investmentPortfolioStocks": 20000000,
  "investmentPortfolioBonds": 10000000,
  "debtInfoMortgage": 300000000
}
```

### 생애주기별 자금 계획 API (Prisma 연동 완료)

#### GET /api/life-stages?userId={userId}
생애주기별 자금 계획 조회

#### POST /api/life-stages
생애주기별 자금 계획 생성/수정

### 목표 관리 API (Prisma 연동 완료)

#### GET /api/goals?userId={userId}
목표 목록 조회

#### POST /api/goals
목표 생성/수정/삭제
```json
{
  "action": "add",
  "userId": "uuid",
  "data": {
    "title": "집 구매",
    "description": "내 집 마련하기",
    "category": "부동산",
    "targetDate": "2027-12-31",
    "targetValue": 500000000,
    "currentValue": 100000000,
    "unit": "원",
    "priority": "high",
    "status": "active"
  }
}
```

### 재무계산기 API (Prisma 연동 완료)

#### GET /api/calculator?userId={userId}
계산기 데이터 조회

#### POST /api/calculator
계산기 데이터 생성/수정
```json
{
  "userId": "uuid",
  "name": "은퇴 자금 계산",
  "currentAge": 30,
  "currentSalary": 50000000,
  "monthlyExpenses": 2000000,
  "monthlySavings": 1500000,
  "investmentReturn": 7.0,
  "targetAmount": 1000000000,
  "targetAge": 60,
  "portfolio": {
    "etf": 40,
    "stocks": 30,
    "realEstate": 20,
    "cash": 10
  }
}
```

## 🗄 데이터베이스 스키마 (Prisma)

### User
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `name`: String?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### CareerGoal
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `year`: Int
- `targetSalary`: Int
- `currentSalary`: Int?
- `sideIncomeTarget`: Int
- `techStack`: String
- `portfolioCount`: Int
- `networkingGoals`: String?
- `learningGoals`: String?

### RoadmapItem
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `title`: String
- `description`: String?
- `year`: Int
- `quarter`: Int
- `status`: String
- `skills`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### FinancialData
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `currentAssets`: Int?
- `monthlyIncome`: Int?
- `monthlyExpensesHousing`: Int?
- `monthlyExpensesFood`: Int?
- `monthlyExpensesTransportation`: Int?
- `monthlyExpensesUtilities`: Int?
- `monthlyExpensesHealthcare`: Int?
- `monthlyExpensesEntertainment`: Int?
- `monthlyExpensesEducation`: Int?
- `monthlyExpensesOther`: Int?
- `monthlySavingsEmergency`: Int?
- `monthlySavingsInvestment`: Int?
- `monthlySavingsRetirement`: Int?
- `monthlySavingsOther`: Int?
- `investmentPortfolioStocks`: Int?
- `investmentPortfolioBonds`: Int?
- `investmentPortfolioRealEstate`: Int?
- `investmentPortfolioCash`: Int?
- `investmentPortfolioOther`: Int?
- `debtInfoMortgage`: Int?
- `debtInfoCarLoan`: Int?
- `debtInfoStudentLoan`: Int?
- `debtInfoCreditCard`: Int?
- `debtInfoOther`: Int?
- `createdAt`: DateTime
- `updatedAt`: DateTime

### LifeStage
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `stage`: String
- `age`: Int
- `description`: String?
- `targetAmount`: Int
- `currentAmount`: Int
- `priority`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Goal
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `title`: String
- `description`: String?
- `category`: String
- `targetDate`: String
- `targetValue`: Int
- `currentValue`: Int
- `unit`: String
- `priority`: String
- `status`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Milestone
- `id`: UUID (Primary Key)
- `goalId`: String (Foreign Key)
- `title`: String
- `targetValue`: Int
- `currentValue`: Int
- `dueDate`: String
- `status`: String

### Calculator
- `id`: UUID (Primary Key)
- `userId`: String (Foreign Key)
- `name`: String
- `currentAge`: Int
- `currentSalary`: Int
- `monthlyExpenses`: Int
- `monthlySavings`: Int
- `investmentReturn`: Float
- `targetAmount`: Int
- `targetAge`: Int
- `portfolioEtf`: Int
- `portfolioStocks`: Int
- `portfolioRealEstate`: Int
- `portfolioCash`: Int
- `createdAt`: DateTime
- `updatedAt`: DateTime

## 🔧 개발 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# 데이터베이스 관련
npm run db:push      # 스키마 변경사항 적용
npm run db:generate  # Prisma 클라이언트 생성
npm run db:studio    # Prisma Studio 실행
```

## 📁 프로젝트 구조

```
life-planner-full/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── auth/          # 인증 API (Mock)
│   │   └── user/          # 사용자 데이터 API (Mock)
│   ├── dashboard/         # 대시보드 페이지들
│   │   ├── analytics/     # 분석 리포트
│   │   ├── calculator/    # 재무계산기
│   │   ├── career/        # 커리어 계획
│   │   ├── finance/       # 자산 관리
│   │   ├── goals/         # 목표 관리
│   │   ├── real-estate/   # 부동산
│   │   └── settings/      # 설정 관리
│   ├── auth/              # 인증 페이지
│   └── layout.tsx         # 루트 레이아웃
├── components/            # React 컴포넌트
│   ├── ui/               # Shadcn UI 컴포넌트
│   │   ├── number-input.tsx      # 숫자 입력 컴포넌트 (toLocaleString 자동 적용)
│   │   └── modal.tsx             # 모달 컴포넌트
│   ├── career/           # 커리어 관련 컴포넌트
│   │   ├── career-goal-modal.tsx  # 커리어 목표 등록/수정 모달
│   │   ├── roadmap-modal.tsx      # 성장 로드맵 관리 모달
│   │   └── tech-stack-selector.tsx # 기술 스택 선택 컴포넌트
│   └── dashboard/        # 대시보드 관련 컴포넌트
│       ├── header.tsx    # 헤더 컴포넌트
│       └── sidebar.tsx   # 사이드바 컴포넌트
├── data/                 # 정적 데이터
│   └── settings.ts       # 메뉴 및 설정 데이터
├── types/                # TypeScript 타입 정의
│   └── career.ts         # 커리어 관련 타입
├── lib/                  # 유틸리티 함수들
├── prisma/               # 데이터베이스 스키마
└── public/               # 정적 파일들
```


## 🚀 개발 로드맵

현재 프로젝트는 Prisma 기반 데이터베이스 연동이 완료되었으며, 다음 단계로 고급 기능 구현과 최적화를 진행할 예정입니다.

### Phase 1 (완료 ✅)
- [x] 기본 UI/UX 구현
- [x] 인증 시스템 (Prisma 연동)
- [x] 설정 관리 시스템
- [x] 실제 API 통신 구현
- [x] 데이터베이스 연동 (Prisma)
- [x] 모든 모듈 API 구현 (커리어, 자산, 목표, 계산기)
- [x] 부동산 공공 API 연동
- [x] 진행률 계산 유틸리티 (NaN 방지)

### Phase 2 (진행 중)
- [ ] 청약홈/부동산 크롤링 연동
- [ ] 코드 리팩토링 및 최적화
- [ ] 테스트 코드 작성
- [ ] 성능 최적화

### Phase 3 (예정)
- [ ] 고급 분석 기능
- [ ] 알람 시스템
- [ ] 모바일 앱 개발

자세한 개발 체크리스트는 [CHECKLIST.md](./CHECKLIST.md)를 참고하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.
# life-planner
