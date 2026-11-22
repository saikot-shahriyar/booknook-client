export type BookCategory =
  | "Fiction"
  | "Science"
  | "History"
  | "Kids"
  | "Others";

export interface Book {
  _id?: string;
  title: string;
  author: string;
  category: BookCategory | string;
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  userName: string;
  userEmail: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Borrow {
  _id?: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  createdAt?: string;
}

/** Backend envelope for list endpoints: `{ success: true, count, data }`. */
export interface ApiListResponse<T> {
  success: true;
  count: number;
  data: T[];
}

/** Backend envelope for single-entity endpoints: `{ success: true, data }`. */
export interface ApiItemResponse<T> {
  success: true;
  data: T;
}

/** Backend envelope for mutation endpoints: `{ success: true, message, data? }`. */
export interface ApiMutationResponse<T = void> {
  success: true;
  message: string;
  data?: T;
}

/** Request body for `POST /books` (returns the created book via `ApiMutationResponse<Book>`). */
export interface CreateBookRequest {
  title: string;
  author: string;
  category: BookCategory;
  image: string;
  description: string;
  totalCopies: number;
}

/** Request body for `PATCH /books/:id` (owner only; `availableCopies` is server-managed). */
export type UpdateBookRequest = {
  title?: string;
  author?: string;
  category?: BookCategory;
  image?: string;
  description?: string;
  totalCopies?: number;
};

/** Backend error envelope: `{ success: false, message }`. */
export interface ApiErrorResponse {
  success: false;
  message: string;
}
