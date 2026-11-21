/**
 * Retrieves and caches the Better Auth JWT used by the BookNook backend for
 * Bearer authentication.
 *
 * The token is fetched from the same-origin endpoint `/api/auth/token`
 * (Better Auth `jwt` plugin's `GET /token` route). The browser sends the
 * Better Auth session cookie automatically, so an active session is required
 * (the endpoint answers 401 when there is none).
 *
 * Notes:
 * - The token is cached in memory only — never localStorage/sessionStorage.
 * - The cached token is refreshed when it is expired or near expiry.
 * - `getAuthToken()` returns `null` when there is no valid session/token.
 * - Safe to call during server rendering: it only uses browser-agnostic
 *   `fetch`, `Date` and `atob`-style decoding, and any failure returns `null`.
 */

const JWT_ENDPOINT = "/api/auth/token";
/**
 * Refresh the cached token when it is within this window of expiry.
 * Better Auth issues JWTs with a 15 minute lifetime by default.
 */
const REFRESH_BUFFER_MS = 30_000;
/** Fallback lifetime used when the JWT has no readable `exp` claim. */
const DEFAULT_EXPIRY_MS = 15 * 60 * 1000;

interface CachedToken {
  token: string;
  /** Absolute expiry time on the `Date.now()` scale, in milliseconds. */
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

/** Decodes the payload of a JWT (base64url JSON) without validating the signature. */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Absolute expiry (ms) of a JWT, or a default when the claim is missing/invalid. */
function tokenExpiryMs(token: string): number {
  const exp = decodeJwtPayload(token)?.exp;
  if (typeof exp === "number" && Number.isFinite(exp)) {
    return exp * 1000;
  }
  return Date.now() + DEFAULT_EXPIRY_MS;
}

async function fetchAuthToken(): Promise<string | null> {
  try {
    const res = await fetch(JWT_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data: unknown = await res.json();
    const token =
      data && typeof data === "object" && typeof (data as { token?: unknown }).token === "string"
        ? (data as { token: string }).token
        : null;

    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

/**
 * Returns the cached token while it is still valid, otherwise fetches a new one.
 */
export async function getAuthToken(options?: { forceRefresh?: boolean }): Promise<string | null> {
  if (options?.forceRefresh) {
    cachedToken = null;
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt - REFRESH_BUFFER_MS) {
    return cachedToken.token;
  }

  const token = await fetchAuthToken();
  if (!token) {
    // A failed fetch means there is no usable token: drop any stale entry.
    cachedToken = null;
    return null;
  }

  cachedToken = { token, expiresAt: tokenExpiryMs(token) };
  return token;
}

/** Discards the cached token so the next call fetches a fresh one. */
export function invalidateAuthToken(): void {
  cachedToken = null;
}
