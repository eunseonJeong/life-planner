# Sentry 설정 가이드

## 개요
이 프로젝트에 Sentry 에러 모니터링이 설정되었습니다. Sentry는 애플리케이션에서 발생하는 에러를 자동으로 추적하고 리포트합니다.

## 설정 파일
- `sentry.client.config.ts`: 클라이언트 사이드 Sentry 설정
- `sentry.server.config.ts`: 서버 사이드 Sentry 설정
- `sentry.edge.config.ts`: Edge 런타임 Sentry 설정
- `instrumentation.ts`: Next.js 런타임별 Sentry 초기화
- `next.config.js`: Sentry 웹팩 플러그인 설정

## 환경 변수 설정

### 1. `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 추가하세요:

```env
# Sentry DSN (필수)
# Sentry 프로젝트 설정에서 DSN을 복사하여 붙여넣으세요
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id

# Sentry Release 버전 (선택)
# 빌드 시 자동으로 설정되거나 수동으로 설정 가능
NEXT_PUBLIC_SENTRY_RELEASE=life-planner@0.2.0

# Sentry Organization (선택, 소스맵 업로드용)
SENTRY_ORG=your-org-name

# Sentry Project (선택, 소스맵 업로드용)
SENTRY_PROJECT=life-planner

# Sentry Auth Token (선택, 소스맵 업로드용)
# https://sentry.io/settings/account/api/auth-tokens/ 에서 생성
SENTRY_AUTH_TOKEN=your-auth-token
```

### 2. Sentry 프로젝트 생성
1. [Sentry.io](https://sentry.io)에 가입/로그인
2. 새 프로젝트 생성
3. 플랫폼으로 "Next.js" 선택
4. DSN을 복사하여 `.env.local`에 추가

## 사용 방법

### 에러 캡처
Sentry는 자동으로 다음을 캡처합니다:
- 클라이언트 사이드 에러
- 서버 사이드 에러
- API 라우트 에러
- Edge 런타임 에러

### 수동 에러 리포트
특정 에러를 수동으로 리포트하려면:

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // 코드 실행
} catch (error) {
  Sentry.captureException(error);
  // 또는 추가 컨텍스트와 함께
  Sentry.captureException(error, {
    tags: {
      section: "user-authentication",
    },
    extra: {
      userId: "user-123",
    },
  });
}
```

### 커스텀 메시지 전송
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.captureMessage("Something went wrong", "warning");
```

### 사용자 컨텍스트 설정
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.setUser({
  id: "user-123",
  email: "user@example.com",
  username: "username",
});
```

### Breadcrumbs 추가
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.addBreadcrumb({
  category: "auth",
  message: "User logged in",
  level: "info",
});
```

## 개발 환경 설정

개발 환경에서는 `debug: true`로 설정되어 있어 콘솔에 Sentry 이벤트가 출력됩니다.
프로덕션 환경에서는 자동으로 `debug: false`로 설정됩니다.

## 프로덕션 배포

### Vercel 배포 시
1. Vercel 프로젝트 설정에서 환경 변수 추가
2. `NEXT_PUBLIC_SENTRY_DSN` 설정
3. 빌드 시 자동으로 소스맵이 업로드됩니다 (SENTRY_AUTH_TOKEN 설정 시)

### 소스맵 업로드
소스맵을 업로드하려면 다음 환경 변수가 필요합니다:
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `SENTRY_AUTH_TOKEN`

## 성능 모니터링

Sentry는 자동으로 성능 트레이싱을 수행합니다:
- API 라우트 응답 시간
- 페이지 로드 시간
- 데이터베이스 쿼리 시간

## Session Replay

클라이언트 사이드에서 Session Replay가 활성화되어 있습니다:
- 에러 발생 시: 100% 캡처
- 일반 세션: 10% 샘플링

개인정보 보호를 위해:
- 모든 텍스트가 마스킹됩니다
- 모든 미디어가 차단됩니다

## 트러블슈팅

### Sentry가 작동하지 않는 경우
1. 환경 변수가 올바르게 설정되었는지 확인
2. DSN이 올바른지 확인
3. 브라우저 콘솔에서 Sentry 초기화 로그 확인
4. 개발 환경에서는 `debug: true`로 설정되어 있어 콘솔에 로그가 출력됩니다

### 소스맵이 업로드되지 않는 경우
1. `SENTRY_AUTH_TOKEN`이 올바르게 설정되었는지 확인
2. `SENTRY_ORG`와 `SENTRY_PROJECT`가 올바른지 확인
3. 빌드 로그에서 Sentry 관련 에러 확인

## 참고 자료
- [Sentry Next.js 문서](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry React 문서](https://docs.sentry.io/platforms/javascript/guides/react/)

