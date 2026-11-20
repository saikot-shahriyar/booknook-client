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
