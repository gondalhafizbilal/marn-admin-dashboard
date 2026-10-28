import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { HTTP_STATUS } from "@/constants";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/token-storage";

import { AppApiError } from "./errors";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

type InterceptorOptions = {
  /** Omit when the backend does not provide a refresh-token endpoint. */
  refreshPath?: string;
};

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(
  client: AxiosInstance,
  refreshPath: string,
): Promise<string | null> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await client.post<RefreshResponse>(refreshPath, {
      refreshToken,
    });

    const { accessToken, refreshToken: nextRefreshToken } = response.data;
    setTokens(accessToken, nextRefreshToken);
    return accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

function getErrorMessage(error: AxiosError<{ message?: string; code?: string }>) {
  return error.response?.data?.message ?? error.message ?? "Request failed";
}

/**
 * Attaches auth + error interceptors to the shared Axios instance.
 * Refresh-token flow is ready for Module 6 auth wiring.
 */
export function attachInterceptors(client: AxiosInstance, options: InterceptorOptions = {}) {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (typeof window !== "undefined") {
        const locale = document.documentElement.lang;
        if (locale) {
          config.headers["Accept-Language"] = locale;
        }
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<{ message?: string; code?: string; errors?: unknown }>) => {
      const originalRequest = error.config as RetryableConfig | undefined;
      const status = error.response?.status;

      if (
        status === HTTP_STATUS.UNAUTHORIZED &&
        originalRequest &&
        !originalRequest._retry &&
        options.refreshPath &&
        !originalRequest.url?.includes(options.refreshPath)
      ) {
        originalRequest._retry = true;

        refreshPromise ??= refreshAccessToken(client, options.refreshPath).finally(() => {
          refreshPromise = null;
        });

        const accessToken = await refreshPromise;

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return client(originalRequest);
        }
      }

      return Promise.reject(
        new AppApiError({
          message: getErrorMessage(error),
          code: error.response?.data?.code,
          statusCode: status,
          details: error.response?.data?.errors,
        }),
      );
    },
  );
}
