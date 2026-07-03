import axios, { type AxiosInstance, type AxiosError } from "axios";
import { toast } from "sonner";

const RATE_LIMIT_TOAST_ID = "api-rate-limit";

function shouldShowRateLimitToast(configUrl?: string): boolean {
  if (!configUrl) return true;
  // Forgot-password handles OTP cooldown with its own UI + timer.
  return !configUrl.includes("reset-password") && !configUrl.includes("verify-otp");
}

export function attachRateLimitInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string; retryAfter?: number }>) => {
      if (error.response?.status === 429) {
        const message =
          error.response.data?.message ||
          "Too many requests. Please slow down and try again.";
        const url = error.config?.url || "";
        if (shouldShowRateLimitToast(url)) {
          toast.error(message, { id: RATE_LIMIT_TOAST_ID, duration: 6000 });
        }
      }
      return Promise.reject(error);
    }
  );
}

/** Applies 429 handling to the default axios instance (login, signup, forgot password). */
export function installGlobalAxiosRateLimitHandler(): void {
  attachRateLimitInterceptor(axios);
}
