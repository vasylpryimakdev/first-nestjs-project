import { config } from 'dotenv';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

config();

const parseSampleRate = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: parseSampleRate(process.env.SENTRY_TRACES_SAMPLE_RATE, 0),
    profileSessionSampleRate: parseSampleRate(
      process.env.SENTRY_PROFILES_SAMPLE_RATE,
      0,
    ),
    profileLifecycle: 'trace',
    integrations: [nodeProfilingIntegration()],
  });
}
