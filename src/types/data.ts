// src/types/data.ts
export interface IBook {
  id?: number; // Primary Key (opsional karena auto-increment)
  title: string;
  createdAt: Date;
  lastModified: Date;
}

export interface ICharacter {
  id?: number; // Primary Key
  bookId: number; // Foreign Key ke IBook.id
  name: string;
  description: string;
}

export interface ILocation {
  id?: number; // Primary Key
  bookId: number; // Foreign Key ke IBook.id
  name: string;
  description: string;
}

export interface IPlotEvent {
  id?: number; // Primary Key
  bookId: number; // Foreign Key ke IBook.id
  title: string;
  summary: string;
  order: number; // Untuk pengurutan
}

export interface IChapter {
  id?: number; // Primary Key
  bookId: number; // Foreign Key ke IBook.id
  title: string;
  content: string; // Teks naskah novel
  order: number; // Untuk pengurutan bab
}
