# 배포 가이드

## 운영 환경 데이터베이스 마이그레이션

운영 환경에서 데이터베이스 테이블이 없는 경우 다음 단계를 따르세요:

### 방법 1: 자동 마이그레이션 (권장)

배포 시 자동으로 마이그레이션이 실행됩니다 (`package.json`의 `build` 스크립트에 포함됨).

### 방법 2: 수동 마이그레이션

운영 환경에서 다음 명령어를 실행하세요:

```bash
# 마이그레이션 상태 확인
npm run db:migrate:status

# 마이그레이션 실행
npm run db:migrate
```

### 방법 3: Vercel 배포 시

Vercel 대시보드에서 환경 변수 `DATABASE_URL`이 설정되어 있는지 확인하고, 빌드 시 자동으로 마이그레이션이 실행됩니다.

### 주의사항

- 운영 환경에서는 `prisma db push` 대신 `prisma migrate deploy`를 사용해야 합니다
- 마이그레이션은 데이터베이스에 직접 접근할 수 있는 환경에서 실행해야 합니다
- 마이그레이션 실행 전에 데이터베이스 백업을 권장합니다

## 문제 해결

### "table does not exist" 오류 발생 시

1. `DATABASE_URL` 환경 변수가 올바르게 설정되어 있는지 확인
2. 데이터베이스 연결이 정상인지 확인
3. 마이그레이션 실행: `npm run db:migrate`

### PostgreSQL 마이그레이션 생성

기존 마이그레이션이 SQLite 형식인 경우, PostgreSQL 환경에서 새로운 마이그레이션을 생성해야 합니다:

```bash
# 로컬에서 PostgreSQL 연결 설정 후
DATABASE_URL="postgresql://..." npm run db:migrate:dev
```

또는 운영 데이터베이스에 직접 연결하여:

```bash
DATABASE_URL="운영_DATABASE_URL" npm run db:migrate
```

