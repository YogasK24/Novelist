// src/services/dbService.ts
import Dexie, { type Table } from 'dexie';
import type { IBook, ICharacter, ILocation, IPlotEvent, IChapter } from '../types/data';

// 1. DEFINISIKAN KELAS DATABASE
export class NovelistDB extends Dexie {
  // Deklarasi tabel
  books!: Table<IBook>;
  characters!: Table<ICharacter>;
  locations!: Table<ILocation>;
  plotEvents!: Table<IPlotEvent>;
  chapters!: Table<IChapter>;

  constructor() {
    super('NovelistDB'); // Nama database
    // FIX: Mengatasi error 'Property 'version' does not exist on type 'NovelistDB''.
    // Secara eksplisit melakukan casting 'this' ke tipe Dexie untuk membantu TypeScript
    // mengenali method 'version' yang diwarisi dari kelas dasar Dexie.
    (this as Dexie).version(1).stores({
      // Definisikan skema dan index
      // '++id' = auto-increment primary key
      // 'bookId' = index untuk query relasi
      books: '++id, title, lastModified',
      characters: '++id, bookId, name',
      locations: '++id, bookId, name',
      plotEvents: '++id, bookId, order',
      chapters: '++id, bookId, order',
    });
  }
}

// 2. BUAT SATU INSTANCE DATABASE
export const db = new NovelistDB();

// 3. BUAT FUNGSI-FUNGSI HELPER (CRUD API)

// --- Operasi Buku (Books) ---

/** Mengambil semua buku, diurutkan dari yang terbaru */
export const getAllBooks = async (): Promise<IBook[]> => {
  return await db.books.orderBy('lastModified').reverse().toArray();
};

/** Menambah buku baru */
export const addBook = async (title: string): Promise<number> => {
  const newBook: IBook = {
    title,
    createdAt: new Date(),
    lastModified: new Date(),
  };
  return await db.books.add(newBook);
};

/** Update judul buku */
export const updateBookTitle = async (id: number, title: string): Promise<number> => {
  return await db.books.update(id, { title: title, lastModified: new Date() });
};

// --- Operasi Data Anak (Characters, Locations, dll.) ---

/** Mengambil semua karakter untuk 1 buku */
export const getCharactersByBookId = async (bookId: number): Promise<ICharacter[]> => {
  return await db.characters.where('bookId').equals(bookId).toArray();
};

/** Menambah karakter baru */
export const addCharacter = async (character: Omit<ICharacter, 'id'>): Promise<number> => {
  return await db.characters.add(character as ICharacter);
};

/** Update data karakter */
export const updateCharacter = async (id: number, changes: Partial<Omit<ICharacter, 'id' | 'bookId'>>) => {
  // 'Partial<...>' artinya 'changes' bisa berisi 'name' atau 'description' atau keduanya
  return await db.characters.update(id, changes);
};

/** Menghapus karakter berdasarkan ID */
export const deleteCharacter = async (id: number): Promise<void> => {
  return await db.characters.delete(id);
};

/** Mengambil semua lokasi untuk 1 buku */
export const getLocationsByBookId = async (bookId: number): Promise<ILocation[]> => {
  return await db.locations.where('bookId').equals(bookId).toArray();
};

/** Menambah lokasi baru */
export const addLocation = async (location: Omit<ILocation, 'id'>): Promise<number> => {
    return await db.locations.add(location as ILocation);
};

/** Update data lokasi */
export const updateLocation = async (id: number, changes: Partial<Omit<ILocation, 'id' | 'bookId'>>) => {
  return await db.locations.update(id, changes);
};

/** Menghapus lokasi berdasarkan ID */
export const deleteLocation = async (id: number): Promise<void> => {
  return await db.locations.delete(id);
};

/** Mengambil semua event plot untuk 1 buku, diurutkan berdasarkan 'order' */
export const getPlotEventsByBookId = async (bookId: number): Promise<IPlotEvent[]> => {
    return await db.plotEvents.where('bookId').equals(bookId).sortBy('order');
};

/** Menambah event plot baru */
export const addPlotEvent = async (plotEvent: Omit<IPlotEvent, 'id'>): Promise<number> => {
    return await db.plotEvents.add(plotEvent as IPlotEvent);
};

/** Update data plot event (hanya title dan summary) */
export const updatePlotEvent = async (id: number, changes: Partial<Omit<IPlotEvent, 'id' | 'bookId' | 'order'>>) => {
  return await db.plotEvents.update(id, changes);
};

/** Menghapus plot event berdasarkan ID */
export const deletePlotEvent = async (id: number): Promise<void> => {
  return await db.plotEvents.delete(id);
};

/** Mengambil semua bab untuk 1 buku, diurutkan berdasarkan 'order' */
export const getChaptersByBookId = async (bookId: number): Promise<IChapter[]> => {
    return await db.chapters.where('bookId').equals(bookId).sortBy('order');
};

/** Menambah bab baru */
export const addChapter = async (chapter: Omit<IChapter, 'id'>): Promise<number> => {
    return await db.chapters.add(chapter as IChapter);
};

/** Update data bab (misal: judul) */
export const updateChapter = async (id: number, changes: Partial<Omit<IChapter, 'id' | 'bookId' | 'content' | 'order'>>) => {
  // Kita batasi hanya 'title' yang bisa di-update lewat sini
  return await db.chapters.update(id, changes);
};

/** Menghapus bab berdasarkan ID */
export const deleteChapter = async (id: number): Promise<void> => {
  return await db.chapters.delete(id);
};


// --- Operasi Hapus (PENTING!) ---

/** Menghapus buku DAN semua data anaknya (karakter, lokasi, dll) */
export const deleteBookAndData = async (bookId: number): Promise<void> => {
  // Gunakan transaction agar semua operasi sukses atau semua gagal
  // FIX: Mengatasi error 'Property 'transaction' does not exist on type 'NovelistDB''.
  // Sama seperti fix pada method 'version', kita perlu melakukan casting eksplisit
  // agar TypeScript mengenali method 'transaction' yang diwarisi dari Dexie.
  return (db as Dexie).transaction('rw', db.books, db.characters, db.locations, db.plotEvents, db.chapters, async () => {
    // Hapus semua data anak
    await db.characters.where('bookId').equals(bookId).delete();
    await db.locations.where('bookId').equals(bookId).delete();
    await db.plotEvents.where('bookId').equals(bookId).delete();
    await db.chapters.where('bookId').equals(bookId).delete();

    // Hapus buku utamanya
    await db.books.delete(bookId);
  });
};