const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

const normalizedApiBaseUrl = configuredApiBaseUrl
  ? configuredApiBaseUrl.replace(/\/+$/, "")
  : "";

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBaseUrl ? `${normalizedApiBaseUrl}${normalizedPath}` : `/api${normalizedPath}`;
}

