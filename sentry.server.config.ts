// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Environment 설정
  environment: process.env.NODE_ENV || "development",
  
  // Release 버전 설정
  release: process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE || "life-planner@0.2.0",
  
  // Normalize depth 설정
  normalizeDepth: 6,
  
  // Server-side specific settings
  beforeSend(event, hint) {
    // 개발 환경에서는 모든 이벤트 전송
    if (process.env.NODE_ENV === "development") {
      console.log("Sentry Server Event:", event);
    }
    return event;
  },
});

