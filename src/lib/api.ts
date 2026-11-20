import { API_BASE_URL } from "@/lib/config";
import { Book } from "@/types";

export interface GetLatestBooksResponse {
  books: Book[];
  error: string | null;
}

/**
 * Fetch the latest books for the Home Page.
 * Returns latest books or a user-friendly error message if backend is unreachable.
 */
export async function getLatestBooks(limit = 6): Promise<GetLatestBooksResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${API_BASE_URL}/books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const json = await res.json();
    const rawBooks: Book[] = Array.isArray(json) ? json : json.data || [];

    // Sort newest first by createdAt if present
    const sorted = [...rawBooks].sort((a, b) => {
      const timeA = a.createdAt ? Date.parse(a.createdAt) : 0;
      const timeB = b.createdAt ? Date.parse(b.createdAt) : 0;
      return timeB - timeA;
    });

    return { books: sorted.slice(0, limit), error: null };
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Unable to connect to the library catalog service.";
    return { books: [], error: message };
  }
}
