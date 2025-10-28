// src/stores/currentBookStore.ts

import { create } from 'zustand';
import {
  db,
  getCharactersByBookId,
  getLocationsByBookId,
  getPlotEventsByBookId,
  getChaptersByBookId,
  addCharacter as dbAddCharacter,
  addLocation as dbAddLocation,
  updateLocation as dbUpdateLocation,
  deleteLocation as dbDeleteLocation,
  addPlotEvent as dbAddPlotEvent,
  updatePlotEvent as dbUpdatePlotEvent,
  deletePlotEvent as dbDeletePlotEvent,
  addChapter as dbAddChapter,
  updateChapter as dbUpdateChapter,
  deleteChapter as dbDeleteChapter,
  updateCharacter as dbUpdateCharacter,
  deleteCharacter as dbDeleteCharacter,
} from '../services/dbService';
import type { IBook, ICharacter, ILocation, IPlotEvent, IChapter } from '../types/data';

// 1. DEFINISIKAN INTERFACE
interface CurrentBookState {
  currentBookId: number | null;
  currentBook: IBook | null;
  characters: ICharacter[];
  locations: ILocation[];
  plotEvents: IPlotEvent[];
  chapters: IChapter[];
  isLoading: boolean;

  // Actions
  /** Mengambil SEMUA data untuk satu buku (detail buku, karakter, lokasi, dll) */
  loadBookData: (bookId: number) => Promise<void>;

  /** Membersihkan state saat user kembali ke dashboard */
  clearBookData: () => void;

  /** Menambah karakter baru ke buku yang sedang dibuka */
  addCharacter: (name: string, description: string) => Promise<void>;

  /** Mengupdate karakter di DB dan state */
  updateCharacter: (id: number, data: { name: string, description: string }) => Promise<void>;

  /** Menghapus karakter dari DB dan state */
  deleteCharacter: (id: number) => Promise<void>;

  /** Menambah lokasi baru ke buku yang sedang dibuka */
  addLocation: (name: string, description: string) => Promise<void>;

  /** Mengupdate lokasi di DB dan state */
  updateLocation: (id: number, data: { name: string, description: string }) => Promise<void>;

  /** Menghapus lokasi dari DB dan state */
  deleteLocation: (id: number) => Promise<void>;

  /** Menambah event plot baru ke buku yang sedang dibuka */
  addPlotEvent: (title: string, summary: string) => Promise<void>;
  
  updatePlotEvent: (id: number, data: { title: string, summary: string }) => Promise<void>;
  
  deletePlotEvent: (id: number) => Promise<void>;

  /** Menambah bab baru ke buku yang sedang dibuka */
  addChapter: (title: string) => Promise<void>;
  
  /** Mengupdate judul bab di DB dan state */
  updateChapter: (id: number, title: string) => Promise<void>;

  /** Menghapus bab dari DB dan state */
  deleteChapter: (id: number) => Promise<void>;
}

// 2. BUAT ZUSTAND STORE
export const useCurrentBookStore = create<CurrentBookState>((set, get) => ({
  // --- Initial State ---
  currentBookId: null,
  currentBook: null,
  characters: [],
  locations: [],
  plotEvents: [],
  chapters: [],
  isLoading: false,

  // --- Implementasi Actions ---

  loadBookData: async (bookId: number) => {
    // Jangan load ulang jika ID buku sama dan tidak sedang loading
    if (get().currentBookId === bookId && !get().isLoading) return;

    set({ isLoading: true, currentBookId: bookId });
    try {
      // Ambil semua data secara paralel (barengan)
      const [bookData, characters, locations, plotEvents, chapters] = await Promise.all([
        db.books.get(bookId),
        getCharactersByBookId(bookId),
        getLocationsByBookId(bookId),
        getPlotEventsByBookId(bookId),
        getChaptersByBookId(bookId),
      ]);

      set({
        currentBook: bookData || null,
        characters: characters || [],
        locations: locations || [],
        plotEvents: plotEvents || [],
        chapters: chapters || [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Gagal load data buku:", error);
      set({ isLoading: false, currentBookId: null });
    }
  },

  clearBookData: () => {
    // Reset semua state ke awal
    set({
      currentBookId: null,
      currentBook: null,
      characters: [],
      locations: [],
      plotEvents: [],
      chapters: [],
      isLoading: false,
    });
  },

  addCharacter: async (name: string, description: string) => {
    const bookId = get().currentBookId;
    if (!bookId) return; // Safety check

    try {
      const newCharData = { bookId, name, description };
      const newId = await dbAddCharacter(newCharData);

      // Update state secara lokal (optimistic update)
      set((state) => ({
        characters: [...state.characters, { id: newId, ...newCharData }],
      }));
    } catch (error) {
      console.error("Gagal menambah karakter:", error);
    }
  },

  updateCharacter: async (id: number, data: { name: string, description: string }) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      await dbUpdateCharacter(id, data);
      
      // Update state secara lokal
      set((state) => ({
        characters: state.characters.map((char) =>
          char.id === id ? { ...char, ...data } : char
        ),
      }));
    } catch (error) {
      console.error("Gagal update karakter:", error);
    }
  },

  deleteCharacter: async (id: number) => {
    try {
      await dbDeleteCharacter(id);

      // Update state secara lokal
      set((state) => ({
        characters: state.characters.filter((char) => char.id !== id),
      }));
    } catch (error) {
      console.error("Gagal menghapus karakter:", error);
    }
  },

  addLocation: async (name: string, description: string) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      const newLocData = { bookId, name, description };
      const newId = await dbAddLocation(newLocData);

      set((state) => ({
        locations: [...state.locations, { id: newId, ...newLocData }],
      }));
    } catch (error) {
      console.error("Gagal menambah lokasi:", error);
    }
  },

  /** Mengupdate lokasi di DB dan state */
  updateLocation: async (id: number, data: { name: string, description: string }) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      await dbUpdateLocation(id, data);
      
      // Update state secara lokal
      set((state) => ({
        locations: state.locations.map((loc) =>
          loc.id === id ? { ...loc, ...data } : loc
        ),
      }));
    } catch (error) {
      console.error("Gagal update lokasi:", error);
    }
  },

  /** Menghapus lokasi dari DB dan state */
  deleteLocation: async (id: number) => {
    try {
      await dbDeleteLocation(id);

      // Update state secara lokal
      set((state) => ({
        locations: state.locations.filter((loc) => loc.id !== id),
      }));
    } catch (error) {
      console.error("Gagal menghapus lokasi:", error);
    }
  },

  addPlotEvent: async (title: string, summary: string) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      // LOGIKA BARU YANG LEBIH AMAN:
      // Cari 'order' tertinggi yang ada, lalu + 1.
      const currentEvents = get().plotEvents;
      const maxOrder = currentEvents.reduce((max, event) => Math.max(max, event.order), 0);
      const newOrder = maxOrder + 1;
      
      const newEventData = { bookId, title, summary, order: newOrder };

      const newId = await dbAddPlotEvent(newEventData as IPlotEvent);
      
      set((state) => ({
        plotEvents: [...state.plotEvents, { id: newId, ...newEventData }],
      }));
    } catch (error) {
      console.error("Gagal menambah plot event:", error);
    }
  },

  /** Mengupdate plot event di DB dan state */
  updatePlotEvent: async (id: number, data: { title: string, summary: string }) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      await dbUpdatePlotEvent(id, data);
      
      set((state) => ({
        plotEvents: state.plotEvents.map((event) =>
          event.id === id ? { ...event, ...data } : event
        ),
      }));
    } catch (error) {
      console.error("Gagal update plot event:", error);
    }
  },

  /** Menghapus plot event dari DB dan state */
  deletePlotEvent: async (id: number) => {
    try {
      await dbDeletePlotEvent(id);

      set((state) => ({
        plotEvents: state.plotEvents.filter((event) => event.id !== id),
      }));
      
    } catch (error) {
      console.error("Gagal menghapus plot event:", error);
    }
  },

  addChapter: async (title: string) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      // LOGIKA BARU YANG LEBIH AMAN:
      // Cari 'order' tertinggi yang ada, lalu + 1.
      const currentChapters = get().chapters;
      const maxOrder = currentChapters.reduce((max, chap) => Math.max(max, chap.order), 0);
      const newOrder = maxOrder + 1;
      
      const newChapterData = { 
        bookId, 
        title, 
        content: "", // Konten diisi nanti lewat editor
        order: newOrder 
      };

      const newId = await dbAddChapter(newChapterData as IChapter);
      
      set((state) => ({
        // Urutkan saat menambah ke state
        chapters: [...state.chapters, { id: newId, ...newChapterData }].sort((a, b) => a.order - b.order),
      }));
    } catch (error) {
      console.error("Gagal menambah bab:", error);
    }
  },
  
  updateChapter: async (id: number, title: string) => {
    const bookId = get().currentBookId;
    if (!bookId) return;

    try {
      await dbUpdateChapter(id, { title });
      set((state) => ({
        chapters: state.chapters.map((chap) =>
          chap.id === id ? { ...chap, title } : chap
        ),
      }));
    } catch (error) {
      console.error("Gagal update bab:", error);
    }
  },

  deleteChapter: async (id: number) => {
    try {
      await dbDeleteChapter(id);
      set((state) => ({
        chapters: state.chapters.filter((chap) => chap.id !== id),
      }));
    } catch (error) {
      console.error("Gagal menghapus bab:", error);
    }
  },
}));