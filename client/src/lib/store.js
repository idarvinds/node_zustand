import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sqliteStorage } from './sqliteStorage';

// Zustand store using the custom SQLite storage engine
const useStore = create(
  persist(
    (set, get) => ({
      count: 0,
      increaseCount: () => set({ count: get().count + 1 }),
      clearCount: () => set({ count: 0 }),
    }),
    {
      name: 'zustand-sqlite-store', // Key under which the state will be stored
      storage: sqliteStorage,       // Use the custom SQLite storage engine
    }
  )
);
console.log('useStore:', useStore);
export default useStore;
