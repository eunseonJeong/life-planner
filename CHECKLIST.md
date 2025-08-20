# Life Planner 개발 체크리스트

## 📋 현재 상태
- ✅ 기본 UI/UX 구현 완료
- ✅ 모든 페이지 구성 완료 (Prisma 기반)
- ✅ 인증 시스템 (Prisma 연동) 구현 완료
- ✅ 설정 관리 시스템 구현 완료
- ✅ 메뉴 표시/숨김 기능 구현 완료
- ✅ 사용자 설정 localStorage 저장 구현 완료
- ✅ 실시간 설정 변경 감지 및 적용 완료
- ✅ 데이터 구조 분리 (data/settings.ts) 완료
- ✅ 모든 API Prisma 연동 완료
- ✅ 진행률 계산 유틸리티 (NaN 방지) 구현 완료
- ✅ 부동산 공공 API 연동 완료
- ❌ 청약홈/부동산 크롤링 연동 미구현
- ❌ 코드 리팩토링 및 최적화 미완료
- ❌ 테스트 코드 작성 미완료

## 🎯 목표
청약홈/부동산 크롤링 연동, 코드 리팩토링, 테스트 코드 작성 완료

---

## 🔐 인증 시스템 구현

### Prisma 기반 인증 (완료 ✅)
- [x] Prisma 스키마에 User 모델 추가
- [x] bcrypt 비밀번호 해시화 구현
- [x] `/api/auth/signup` - 회원가입 API
- [x] `/api/auth/login` - 로그인 API
- [x] `/api/auth/logout` - 로그아웃 API
- [x] 비밀번호 검증 로직 구현
- [x] 보호된 라우트 구현
- [x] 세션 관리 및 자동 로그인

---

## 📊 대시보드 API 구현

### 계획 관리 API (완료 ✅)
- [x] `GET /api/plans` - 사용자별 계획 목록 조회
- [x] `POST /api/plans` - 새 계획 생성
- [x] `PUT /api/plans/{id}` - 계획 수정
- [x] `DELETE /api/plans/{id}` - 계획 삭제
- [x] `PATCH /api/plans/{id}/progress` - 진행률 업데이트

### 대시보드 통계 API (완료 ✅)
- [x] `GET /api/dashboard/stats` - 전체 통계 데이터
- [x] `GET /api/dashboard/recent-plans` - 최근 계획
- [x] `GET /api/dashboard/progress-summary` - 진행률 요약

---

## 💼 커리어 계획 API 구현

### 커리어 목표 API (완료 ✅)
- [x] `GET /api/career-goals` - 커리어 목표 조회
- [x] `POST /api/career-goals` - 커리어 목표 생성
- [x] `PUT /api/career-goals/{id}` - 커리어 목표 수정
- [x] `DELETE /api/career-goals/{id}` - 커리어 목표 삭제

### 성장 로드맵 API (완료 ✅)
- [x] `GET /api/roadmap` - 성장 로드맵 조회
- [x] `POST /api/roadmap` - 로드맵 단계 추가
- [x] `PUT /api/roadmap/{id}` - 로드맵 단계 수정
- [x] `DELETE /api/roadmap/{id}` - 로드맵 단계 삭제

### 기술 스택 API
- [ ] `GET /api/career/tech-stack` - 기술 스택 조회
- [ ] `POST /api/career/tech-stack` - 기술 스택 추가
- [ ] `PUT /api/career/tech-stack/{id}` - 기술 스택 수정
- [ ] `DELETE /api/career/tech-stack/{id}` - 기술 스택 삭제

---

## 💰 자산 관리 API 구현

### 재무 데이터 API (완료 ✅)
- [x] `GET /api/finance` - 재무 데이터 조회
- [x] `POST /api/finance` - 재무 데이터 생성
- [x] `PUT /api/finance/{id}` - 재무 데이터 수정
- [x] `DELETE /api/finance/{id}` - 재무 데이터 삭제

### 생애주기 계획 API (완료 ✅)
- [x] `GET /api/life-stages` - 생애주기 계획 조회
- [x] `POST /api/life-stages` - 생애주기 계획 생성
- [x] `PUT /api/life-stages/{id}` - 생애주기 계획 수정
- [x] `DELETE /api/life-stages/{id}` - 생애주기 계획 삭제

### 투자 포트폴리오 API
- [ ] `GET /api/financial/portfolio` - 투자 포트폴리오 조회
- [ ] `POST /api/financial/portfolio` - 포트폴리오 항목 추가
- [ ] `PUT /api/financial/portfolio/{id}` - 포트폴리오 항목 수정
- [ ] `DELETE /api/financial/portfolio/{id}` - 포트폴리오 항목 삭제

---

## 🏠 부동산 API 구현

### 부동산 데이터 API (완료 ✅)
- [x] `GET /api/real-estate` - 부동산 데이터 조회 (공공 API 연동)
- [x] `POST /api/real-estate` - 지역 목록 조회
- [x] 공공 데이터 포털 API 연동 (국토교통부 실거래가)
- [x] XML/JSON 응답 파싱 처리
- [x] 지역별 통계 데이터 계산
- [x] 시장 동향 분석
- [x] `POST /api/real-estate-data` - 부동산 데이터 생성 (사용자 저장)
- [x] `PUT /api/real-estate-data/{id}` - 부동산 데이터 수정
- [x] `DELETE /api/real-estate-data/{id}` - 부동산 데이터 삭제

### 청약홈/부동산 크롤링 연동 (진행 예정)
- [ ] 청약홈 크롤링 API 구현
- [ ] 부동산114 크롤링 API 구현
- [ ] 실시간 청약 정보 수집
- [ ] 청약 일정 알림 기능
- [ ] 청약 자격 검증 기능

### 공공 API 연동 완료 사항 (완료 ✅)
- [x] 국토교통부 아파트 매매 실거래가 API 연동
- [x] 국토교통부 아파트 전월세 실거래가 API 연동
- [x] 지역 코드 매핑 (서울, 경기도)
- [x] 통계 데이터 계산 (평균, 중앙값, 최소, 최대)
- [x] 시장 동향 분석 (상승/하락/안정)
- [x] 에러 처리 및 사용자 친화적 메시지
- [x] 환경 변수 설정 가이드 (README.md)

### 지역 분석 API
- [ ] `GET /api/real-estate/regions` - 지역 목록 조회
- [ ] `GET /api/real-estate/regions/{region}` - 특정 지역 분석
- [ ] `POST /api/real-estate/regions` - 지역 분석 데이터 추가

### 구입 방식 API
- [ ] `GET /api/real-estate/purchase-methods` - 구입 방식 목록
- [ ] `GET /api/real-estate/purchase-methods/{method}` - 구입 방식 상세

### 청약 정책 API
- [ ] `GET /api/real-estate/subscription-policies` - 청약 정책 조회
- [ ] `GET /api/real-estate/subscription-policies/{year}` - 연도별 정책

### 경매 프로세스 API
- [ ] `GET /api/real-estate/auction-process` - 경매 프로세스 조회
- [ ] `POST /api/real-estate/auction-process` - 경매 프로세스 단계 추가

---

### 관계 데이터 API
- [ ] `GET /api/relationship-data` - 관계 데이터 조회
- [ ] `POST /api/relationship-data` - 관계 데이터 생성
- [ ] `PUT /api/relationship-data/{id}` - 관계 데이터 수정
- [ ] `DELETE /api/relationship-data/{id}` - 관계 데이터 삭제
---

## 🎯 목표 관리 API 구현

### 목표 API (완료 ✅)
- [x] `GET /api/goals` - 목표 목록 조회
- [x] `POST /api/goals` - 새 목표 생성
- [x] `PUT /api/goals/{id}` - 목표 수정
- [x] `DELETE /api/goals/{id}` - 목표 삭제
- [x] `PATCH /api/goals/{id}/progress` - 목표 진행률 업데이트

### 마일스톤 API (완료 ✅)
- [x] `GET /api/goals/{goalId}/milestones` - 마일스톤 목록 조회
- [x] `POST /api/goals/{goalId}/milestones` - 마일스톤 생성
- [x] `PUT /api/goals/{goalId}/milestones/{id}` - 마일스톤 수정
- [x] `DELETE /api/goals/{goalId}/milestones/{id}` - 마일스톤 삭제

---

## 🧮 재무계산기 API 구현

### 계산기 API (완료 ✅)
- [x] `GET /api/calculator` - 계산기 데이터 조회
- [x] `POST /api/calculator` - 계산기 데이터 생성/수정
- [x] `DELETE /api/calculator/{id}` - 계산기 데이터 삭제
- [x] 재무 목표 달성 계산 기능
- [x] 은퇴 자금 계산 기능
- [x] 투자 수익 계산 기능
- [x] 대출 상환 계산 기능

### 계산 결과 저장 API (완료 ✅)
- [x] `GET /api/calculator/history` - 계산 히스토리 조회
- [x] `POST /api/calculator/save` - 계산 결과 저장
- [x] `DELETE /api/calculator/history/{id}` - 계산 히스토리 삭제

---



## ⚙️ 설정 관리 API 구현

### 사용자 설정 API
- [ ] `GET /api/settings` - 사용자 설정 조회
- [ ] `PUT /api/settings` - 사용자 설정 업데이트
- [ ] `POST /api/settings/reset` - 설정 초기화

### 메뉴 설정 API
- [x] `GET /api/settings/menu` - 메뉴 설정 조회 (localStorage 기반)
- [x] `PUT /api/settings/menu` - 메뉴 설정 업데이트 (localStorage 기반)

### 알람 설정 API
- [ ] `GET /api/settings/alarms` - 알람 설정 조회
- [ ] `PUT /api/settings/alarms` - 알람 설정 업데이트

---

## 🔔 알람 시스템 구현

### 알람 API
- [ ] `GET /api/alarms` - 알람 목록 조회
- [ ] `POST /api/alarms` - 알람 생성
- [ ] `PUT /api/alarms/{id}` - 알람 수정
- [ ] `DELETE /api/alarms/{id}` - 알람 삭제
- [ ] `PATCH /api/alarms/{id}/toggle` - 알람 활성화/비활성화

### 알람 실행 시스템
- [ ] 알람 스케줄러 구현
- [ ] 이메일 알림 시스템
- [ ] 푸시 알림 시스템 (선택사항)
- [ ] 알람 히스토리 관리

---

## 🗄 데이터베이스 스키마 확장

### 새로운 테이블 추가
- [x] `MenuSettings` - 메뉴 표시 설정 (localStorage 기반 구현)
- [x] `AlarmSettings` - 알람 설정 (localStorage 기반 구현)
- [ ] `Alarms` - 알람 데이터
- [ ] `Calculations` - 계산기 히스토리

- [ ] `Milestones` - 마일스톤
- [ ] `TechStacks` - 기술 스택
- [ ] `PortfolioItems` - 포트폴리오 항목

### 기존 테이블 수정
- [ ] `User` 테이블에 설정 관련 필드 추가
- [ ] `Plan` 테이블에 마일스톤 관계 추가
- [ ] `CareerGoal` 테이블에 기술 스택 관계 추가

---

## 🔧 프론트엔드 통합

### API 클라이언트 구현
- [ ] API 클라이언트 유틸리티 생성
- [ ] 에러 핸들링 구현
- [ ] 로딩 상태 관리
- [ ] 캐싱 전략 구현

### 상태 관리
- [x] 사용자 설정 상태 관리 (localStorage 기반)
- [x] 실시간 설정 변경 감지 및 적용
- [ ] 전역 상태 관리 (Context API 또는 Zustand)
- [ ] API 상태 관리

### 컴포넌트 업데이트
- [x] 설정 페이지 컴포넌트 구현 완료
- [x] 사이드바 메뉴 동적 표시/숨김 구현 완료
- [x] 실시간 설정 변경 감지 및 적용 구현 완료
- [x] 커리어 목표 등록/수정 모달 컴포넌트 구현 완료
- [x] 공통 모달 컴포넌트 구현 완료
- [x] 커리어 관련 타입 정의 완료
- [x] 기술 스택 선택 컴포넌트 구현 완료 (뱃지 형태)
- [x] 기술 스택 enum 관리 시스템 구현 완료
- [ ] 모든 페이지에서 Mock 데이터를 API 호출로 교체
- [ ] 로딩 상태 UI 추가
- [ ] 에러 처리 UI 추가
- [ ] 폼 검증 강화

---

## 🔧 코드 리팩토링 및 최적화

### 코드 구조 개선
- [ ] API 응답 형식 표준화
- [ ] 에러 처리 통합
- [ ] 타입 정의 정리
- [ ] 유틸리티 함수 분리
- [ ] 컴포넌트 재사용성 향상

### 성능 최적화
- [ ] API 응답 시간 최적화
- [ ] 데이터베이스 쿼리 최적화
- [ ] 프론트엔드 번들 크기 최적화
- [ ] 이미지 최적화
- [ ] 캐싱 전략 구현

### 코드 품질 향상
- [ ] ESLint 규칙 강화
- [ ] Prettier 설정 통일
- [ ] TypeScript strict 모드 적용
- [ ] 코드 주석 개선
- [ ] 문서화 강화

---

## 🧪 테스트 구현

### API 테스트
- [ ] API 엔드포인트 단위 테스트
- [ ] 데이터베이스 통합 테스트
- [ ] 인증 플로우 테스트
- [ ] 에러 케이스 테스트

### 프론트엔드 테스트
- [ ] 컴포넌트 단위 테스트
- [ ] 페이지 통합 테스트
- [ ] 사용자 플로우 테스트
- [ ] 접근성 테스트

### E2E 테스트
- [ ] 전체 사용자 플로우 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 모바일 반응형 테스트

---

## 🚀 배포 준비

### 환경 설정
- [ ] 프로덕션 데이터베이스 설정 (PostgreSQL)

- [ ] 환경 변수 관리

### 성능 최적화
- [ ] API 응답 시간 최적화
- [ ] 데이터베이스 쿼리 최적화
- [ ] 프론트엔드 번들 크기 최적화

### 보안 강화
- [ ] API 인증 미들웨어 구현
- [ ] 입력 데이터 검증 강화
- [ ] CORS 설정
- [ ] Rate limiting 구현

---

## 📝 문서화

### API 문서
- [ ] Swagger/OpenAPI 문서 작성
- [ ] API 사용 예제 작성
- [ ] 에러 코드 문서화

### 개발 문서
- [ ] 개발 가이드 작성
- [ ] 배포 가이드 작성
- [ ] 트러블슈팅 가이드 작성

---

## 🎯 우선순위

### Phase 1 (완료 ✅)
1. ✅ 인증 시스템 완전 구현
2. ✅ 기본 CRUD API 구현 (계획, 목표, 재무 데이터)
3. ✅ 프론트엔드 API 통합
4. ✅ 부동산 공공 API 연동
5. ✅ 진행률 계산 유틸리티 구현

### Phase 2 (진행 중)
1. 청약홈/부동산 크롤링 연동
2. 코드 리팩토링 및 최적화
3. 테스트 코드 작성
4. 성능 최적화

### Phase 3 (예정)
1. 알람 시스템 구현
2. 모바일 앱 개발

---

## 📊 진행률 추적

- [x] Phase 1 완료 (100%)
- [ ] Phase 2 완료 (0%)
- [ ] Phase 3 완료 (0%)
- [ ] 전체 프로젝트 완료 (60%)

### 완료된 주요 작업
- ✅ 기본 UI/UX 및 모든 페이지 구현
- ✅ 인증 시스템 (Prisma 연동) 구현
- ✅ 설정 관리 시스템 구현
- ✅ 메뉴 표시/숨김 기능 구현
- ✅ 실시간 설정 변경 감지 및 적용
- ✅ 데이터 구조 분리 및 정리
- ✅ 커리어 목표 등록/수정 모달 컴포넌트 구현
- ✅ 공통 모달 컴포넌트 구현
- ✅ 커리어 관련 타입 정의 및 분리
- ✅ 기술 스택 선택 컴포넌트 구현 (뱃지 형태)
- ✅ 기술 스택 enum 관리 시스템 구현
- ✅ 모든 API Prisma 연동 완료
- ✅ 부동산 공공 API 연동 완료
- ✅ 진행률 계산 유틸리티 (NaN 방지) 구현
- ✅ 자산 관리 모듈 완전 구현
- ✅ 목표 관리 모듈 완전 구현
- ✅ 재무계산기 모듈 완전 구현
- ✅ 생애주기별 자금 계획 모듈 완전 구현

### 다음 단계 작업
- 🔄 청약홈/부동산 크롤링 연동
- 🔄 코드 리팩토링 및 최적화
- 🔄 테스트 코드 작성

**마지막 업데이트**: 2025년 08월
