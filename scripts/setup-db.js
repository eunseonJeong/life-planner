#!/usr/bin/env node

/**
 * 데이터베이스 설정 스크립트
 * DATABASE_URL이 설정되어 있으면 PostgreSQL 스키마 사용
 * 그렇지 않으면 SQLite 스키마 사용 (로컬 개발)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const hasDatabaseUrl = !!process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

if (hasDatabaseUrl || isProduction) {
  console.log('📦 PostgreSQL 스키마로 Prisma 클라이언트 생성 중...');
  execSync('prisma generate', { stdio: 'inherit' });
} else {
  console.log('📦 SQLite 스키마로 Prisma 클라이언트 생성 중 (로컬 개발)...');
  execSync('prisma generate --schema=./prisma/schema.sqlite.prisma', { stdio: 'inherit' });
  console.log('✅ SQLite 데이터베이스 준비 완료!');
}

