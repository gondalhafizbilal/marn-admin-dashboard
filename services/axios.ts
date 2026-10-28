import axios, { type AxiosInstance } from "axios";

import { env } from "@/config";

import { attachInterceptors } from "./interceptors";

/**
 * Shared Axios instance.
 * Never import this in components — use repositories instead.
 */
export const apiClient: AxiosInstance = axios.create({
  // Keep the API origin configurable for every environment. `/api` remains the
  // local default in `config/env.ts`, so development proxy behaviour is unchanged.
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

attachInterceptors(apiClient);
