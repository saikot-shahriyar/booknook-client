import { API_BASE_URL } from "@/lib/config";
import { getAuthToken } from "@/lib/auth-token";
import {
  Book,
  ApiItemResponse,
  ApiMutationResponse,
  Borrow,
  CreateBookRequest,
  UpdateBookRequest,
} from "@/types";

export interface GetBooksResponse {
  books: Book[];
  error: string | null;
}

export interface GetBorrowsResponse {
  borrows: Borrow[];
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

/**
 * Fetch the signed-in user's active borrow records via `GET /borrows`.
 * The backend derives the user from the verified JWT — no client-supplied
 * identity is sent. Returns the borrows or a user-friendly error message.
 */
export async function getMyBorrows(): Promise<GetBorrowsResponse> {
  try {
    const json = await apiFetch<{ data?: Borrow[] }>(`/borrows`, { cache: "no-store" });

    // Defensive filter: only items that carry the borrow record `_id` can be
    // used for returns, so the list always contains usable record IDs.
    const borrows = Array.isArray(json?.data)
      ? json.data.filter((borrow): borrow is Borrow => Boolean(borrow._id))
      : [];
    return { borrows, error: null };
  } catch (err) {
    const message = errorMessage(err, "Unable to load your borrowed books. Please try again.");
    return { borrows: [], error: message };
  }
}

/**
 * Return a borrowed book via `DELETE /borrows/:id` (the borrow record ID, not
 * the book ID). The backend verifies the record belongs to the authenticated
 * user and restores the book's `availableCopies` by 1.
 */
export async function deleteBorrow(
  id: string
): Promise<ApiMutationResponse<{ bookId: string; bookTitle: string }>> {
  const trimmedId = id.trim();

  if (!trimmedId) {
    throw new ApiError("Borrow ID is required.", 400);
  }

  return apiFetch<ApiMutationResponse<{ bookId: string; bookTitle: string }>>(
    `/borrows/${encodeURIComponent(trimmedId)}`,
    { method: "DELETE", cache: "no-store" }
  );
}

/**
 * Upload a book cover image through the server-side proxy route.
 *
 * The image is posted as FormData to the same-origin Next.js route
 * `POST /api/upload`; that route uploads the file to ImgBB using the
 * server-side `IMGBB_API_KEY` (the key never reaches the browser) and
 * returns the hosted image URL.
 *
 * This intentionally bypasses `apiFetch()`: it prefixes the Express backend
 * base URL (`API_BASE_URL`), and the Express backend has no `/api/upload`
 * route — this request used to 404 there.
 */
export async function uploadBookImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    cache: "no-store",
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      backendErrorMessage(body) ?? `Image upload failed with status ${response.status}.`,
      response.status,
      body
    );
  }

  const url = (body as ApiMutationResponse<{ url: string }> | null)?.data?.url;
  if (typeof url !== "string" || !url) {
    throw new ApiError("Image upload failed. Please try again.", 502);
  }

  return url;
}

/**
 * Add a new book to the library via the backend.
 * Returns the backend response: `{ success: true, message, data: Book }`.
 */
export async function createBook(data: CreateBookRequest): Promise<ApiMutationResponse<Book>> {
  return apiFetch<ApiMutationResponse<Book>>("/books", {
    method: "POST",
    body: {
      title: data.title,
      author: data.author,
      category: data.category,
      image: data.image,
      description: data.description,
      totalCopies: data.totalCopies,
    },
    cache: "no-store",
  });
}

/**
 * Fetch the books added by a specific user via `GET /books?userEmail=...`.
 * Returns the user's books or a user-friendly error message.
 */
export async function getMyBooks(userEmail: string): Promise<GetBooksResponse> {
  const email = userEmail.trim();

  if (!email) {
    return { books: [], error: "Unable to load your books. Please sign in again." };
  }

  try {
    const json = await apiFetch<{ data?: Book[] }>(
      `/books?userEmail=${encodeURIComponent(email)}`,
      { cache: "no-store" }
    );
    const books = Array.isArray(json?.data) ? json.data : [];
    return { books, error: null };
  } catch (err) {
    const message = errorMessage(err, "Unable to load your books. Please try again.");
    return { books: [], error: message };
  }
}

/**
 * Update an existing book. The backend only allows the creator who added the
 * book (403 otherwise — ownership is derived from the verified JWT, not the
 * client).
 */
export async function updateBook(
  id: string,
  data: UpdateBookRequest
): Promise<ApiMutationResponse<Book>> {
  const trimmedId = id.trim();

  if (!trimmedId) {
    throw new ApiError("Book ID is required.", 400);
  }

  return apiFetch<ApiMutationResponse<Book>>(`/books/${encodeURIComponent(trimmedId)}`, {
    method: "PATCH",
    body: data,
    cache: "no-store",
  });
}

/**
 * Delete a book. The backend only allows the creator who added the book
 * (403 otherwise — ownership is derived from the verified JWT, not the
 * client).
 */
export async function deleteBook(id: string): Promise<ApiMutationResponse<void>> {
  const trimmedId = id.trim();

  if (!trimmedId) {
    throw new ApiError("Book ID is required.", 400);
  }

  return apiFetch<ApiMutationResponse<void>>(`/books/${encodeURIComponent(trimmedId)}`, {
    method: "DELETE",
    cache: "no-store",
  });
}
