const configuredApiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim() ||
  ""
);

// In development, always prefer Vite proxy (/api -> localhost:5000)
// so auth and app APIs stay on the same origin/session behavior.
const resolvedApiBaseUrl = import.meta.env.DEV
  ? ""
  : configuredApiBaseUrl;

if (import.meta.env.PROD && !configuredApiBaseUrl) {
  console.error(
    "[api] VITE_API_BASE_URL (or VITE_API_URL) must be set for production builds. Requests will use same-origin /api only."
  );
}

const normalizedApiBaseUrl = resolvedApiBaseUrl
  ? resolvedApiBaseUrl.replace(/\/+$/, "")
  : "";

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedApiBaseUrl ? `${normalizedApiBaseUrl}${normalizedPath}` : `/api${normalizedPath}`;
}
