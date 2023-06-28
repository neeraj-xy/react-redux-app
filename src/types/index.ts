export interface Book {
  id: number;
  book_title: string;
  book_pages: number;
  book_publication_city: string;
  book_publication_year: string;
  book_publication_country: string;
  book_author: string[];
}

export interface APIResponse {
  books: Book[];
  count: number;
}
