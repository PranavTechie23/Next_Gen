import axios, { type AxiosInstance } from "axios";
import { buildApiUrl } from "@/lib/api";
import { attachRateLimitInterceptor } from "@/lib/httpRateLimit";
import { clearClientAuthState } from "@/lib/authSession";

/** Cookie-based API client — no Bearer token in JavaScript. */
export function createApiClient(basePath: string): AxiosInstance {
  const api = axios.create({
    baseURL: buildApiUrl(basePath),
    withCredentials: true,
  });

  attachRateLimitInterceptor(api);

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        clearClientAuthState();
      }
      return Promise.reject(error);
    }
  );

  return api;
}

/** Session check client (no auth header). */
export const sessionClient = axios.create({
  withCredentials: true,
});

attachRateLimitInterceptor(sessionClient);

sessionClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearClientAuthState();
    }
    return Promise.reject(error);
  }
);
