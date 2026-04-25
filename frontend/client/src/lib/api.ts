const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const fallbackProductionApiBaseUrl = "https://next-gen-s7fa.onrender.com/api";

// In development, always prefer Vite proxy (/api -> localhost:5000)
// so auth and app APIs stay on the same origin/session behavior.
const resolvedApiBaseUrl = import.meta.env.DEV
  ? ""
  : configuredApiBaseUrl
    ? configuredApiBaseUrl
    : import.meta.env.PROD
      ? fallbackProductionApiBaseUrl
      : "";

const normalizedApiBaseUrl = resolvedApiBaseUrl
  ? resolvedApiBaseUrl.replace(/\/+$/, "")
  : "";

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBaseUrl ? `${normalizedApiBaseUrl}${normalizedPath}` : `/api${normalizedPath}`;
}

