import { API_BASE_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/auth-token";
import { Book, ApiItemResponse, ApiMutationResponse, Borrow } from "@/types";

export interface GetBooksResponse {
  books: Book[];
  error: string | null;
}

/** Timeout applied to every backend request issued through `apiFetch`. */
const API_FETCH_TIMEOUT_MS = 10_000;

/**
 * Normalized error thrown by `apiFetch` for non-2xx responses and transport
 * failures. The message never contains token values.
 */
export class ApiError extends Error {
  /** HTTP status of the failed request (0 when there was no response). */
  readonly status: number;
  /** Parsed JSON body of the failed response, when available. */
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return err.message;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}

/** Reads the backend's standard `{ success: false, message }` error envelope. */
function backendErrorMessage(body: unknown): string | null {
  if (body && typeof body === "object") {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }
  return null;
}

/** Options for `apiFetch` — like `RequestInit`, but plain JSON object bodies are also allowed. */
export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: RequestInit["body"] | Record<string, unknown> | null;
}

/**
 * Reusable fetch wrapper for the BookNook backend (`booknook-server`).
 *
 * - Targets `API_BASE_URL` and supports GET, POST, PATCH and DELETE.
 * - Adds `Authorization: Bearer <jwt>` when a valid Better Auth JWT is
 *   available; public requests still work without one (no login required).
 * - Adds `Content-Type: application/json` when sending JSON bodies.
 * - Uses an `AbortController` timeout and handles non-JSON responses safely.
 * - Non-2xx responses throw `ApiError` carrying the status and parsed body.
 *
 * Note: automatic 401 redirects/retries are intentionally out of scope for
 * this layer and can be layered on by callers.
 */
export async function apiFetch<T = unknown>(path: string, init: ApiFetchOptions = {}): Promise<T> {
  const { body: providedBody, ...restInit } = init;
  const method = (init.method ?? "GET").toUpperCase();
  const hasBody = providedBody != null && method !== "GET" && method !== "HEAD";

  const headers = new Headers(init.headers);

  // Attach the Better Auth JWT when available; never overrides an explicit header.
  const token = await getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_FETCH_TIMEOUT_MS);

  // Forward caller-provided abort signals into the timeout controller.
  if (init.signal) {
    if (init.signal.aborted) {
      controller.abort();
    } else {
      init.signal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  const fetchInit: RequestInit = { ...restInit, method, headers, signal: controller.signal };

  if (hasBody) {
    const isFormData = typeof FormData !== "undefined" && providedBody instanceof FormData;
    const isURLSearchParams =
      typeof URLSearchParams !== "undefined" && providedBody instanceof URLSearchParams;

    if (!isFormData && !isURLSearchParams) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      fetchInit.body =
        typeof providedBody === "string" ? providedBody : JSON.stringify(providedBody);
    } else {
      fetchInit.body = providedBody as BodyInit;
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, fetchInit);

    const text = await res.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }
    }

    if (!res.ok) {
      throw new ApiError(
        backendErrorMessage(data) ?? `Server returned status ${res.status}`,
        res.status,
        data
      );
    }

    return data as T;
  } catch (err) {
    if (controller.signal.aborted) {
      throw new ApiError("Request timed out", 0);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetch the latest books for the Home Page.
 * Returns latest books or a user-friendly error message if backend is unreachable.
 */
export async function getLatestBooks(limit = 6): Promise<GetBooksResponse> {
  try {
    const json = await apiFetch<{ data?: Book[] }>(`/books`, { cache: "no-store" });

    const books = json?.data;
    const rawBooks: Book[] = Array.isArray(books) ? books : [];

    // Sort newest first by createdAt if present
    const sorted = [...rawBooks].sort((a, b) => {
      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return timeB - timeA;
    });

    return { books: sorted.slice(0, limit), error: null };
  } catch (err) {
    const message = errorMessage(err, "Unable to connect to the library catalog service.");
    return { books: [], error: message };
  }
}

/**
 * Fetch all available books for the All Books page.
 * Returns all books or a user-friendly error message if backend is unreachable.
 */
export async function getAllBooks(): Promise<GetBooksResponse> {
  try {
    const json = await apiFetch<{ data?: Book[] }>(`/books`, { cache: "no-store" });

    const books = json?.data;
    const rawBooks: Book[] = Array.isArray(books) ? books : [];

    // Sort newest first by createdAt if present
    const sorted = [...rawBooks].sort((a, b) => {
      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return timeB - timeA;
    });

    return { books: sorted, error: null };
  } catch (err) {
    const message = errorMessage(err, "Unable to connect to the library catalog service.");
    return { books: [], error: message };
  }
}

/**
 * Fetch a single book by its database ID from the backend.
 * Returns the backend response: `{ success: true, data: Book }`.
 */
export async function getBookById(id: string): Promise<ApiItemResponse<Book>> {
  const trimmedId = id.trim();

  if (!trimmedId) {
    throw new ApiError("Book ID is required.", 400);
  }

  return apiFetch<ApiItemResponse<Book>>(`/books/${encodeURIComponent(trimmedId)}`, {
    cache: "no-store",
  });
}

/**
 * Borrow a book copy from the backend.
 * Sends only `{ bookId }` — the backend derives the user from the JWT.
 * Returns the backend response: `{ success: true, message, data: Borrow }`.
 */
export async function borrowBook(bookId: string): Promise<ApiMutationResponse<Borrow>> {
  const trimmedId = bookId.trim();

  if (!trimmedId) {
    throw new ApiError("Book ID is required.", 400);
  }

  return apiFetch<ApiMutationResponse<Borrow>>("/borrows", {
    method: "POST",
    body: { bookId: trimmedId },
    cache: "no-store",
  });
}
