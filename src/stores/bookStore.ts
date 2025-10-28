// src/stores/bookStore.ts

import { create } from 'zustand';
import {
  getAllBooks,
  addBook as dbAddBook,
  deleteBookAndData,
  updateBookTitle as dbUpdateBookTitle,
} from '../services/dbService';
import type { IBook } from '../types/data';

// 1. DEFINISIKAN INTERFACE UNTUK STATE DAN ACTIONS
interface BookStoreState {
  books: IBook[];
  isLoading: boolean;

  // Actions
  /** Mengambil semua buku dari DB dan menyimpannya di state */
  fetchBooks: () => Promise<void>;

  /** Menambah buku baru ke DB dan me-refresh state */
  addNewBook: (title: string) => Promise<void>;

  /** Menghapus buku (dan semua datanya) dari DB dan state */
  deleteBook: (bookId: number) => Promise<void>;

  /** Mengupdate judul buku di DB dan state */
  updateBookTitle: (bookId: number, newTitle: string) => Promise<void>;
}

// 2. BUAT ZUSTAND STORE
export const useBookStore = create<BookStoreState>((set, get) => ({
  // --- Initial State ---
  books: [],
  isLoading: false,

  // --- Implementasi Actions ---

  fetchBooks: async () => {
    set({ isLoading: true });
    try {
      const books = await getAllBooks();
      set({ books, isLoading: false });
    } catch (error) {
      console.error("Gagal fetch books:", error);
      set({ isLoading: false });
    }
  },

  addNewBook: async (title: string) => {
    try {
      await dbAddBook(title);
      // Panggil action 'fetchBooks' untuk sinkronisasi penuh
      get().fetchBooks();
    } catch (error) {
      console.error("Gagal menambah buku:", error);
    }
  },

  deleteBook: async (bookId: number) => {
    try {
      await deleteBookAndData(bookId);
      // Update state secara lokal (lebih cepat daripada fetch ulang)
      set((state) => ({
        books: state.books.filter((book) => book.id !== bookId),
      }));
    } catch (error) {
      console.error("Gagal menghapus buku:", error);
    }
  },

  updateBookTitle: async (bookId: number, newTitle: string) => {
    try {
      await dbUpdateBookTitle(bookId, newTitle);
      // Update state secara lokal
      set((state) => ({
        books: state.books.map((book) =>
          book.id === bookId
            ? { ...book, title: newTitle, lastModified: new Date() }
            : book
        ),
      }));
    } catch (error) {
      console.error("Gagal update judul buku:", error);
    }
  },
}));
