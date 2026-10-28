/**
 * Centralized environment variable access.
 * Validation with Zod will be added in a later module.
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "/api",
} as const;

export type Env = typeof env;
