const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
const fallbackProductionApiBaseUrl = "https://next-gen-s7fa.onrender.com/api";

const resolvedApiBaseUrl = configuredApiBaseUrl
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

