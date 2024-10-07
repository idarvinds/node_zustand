import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sqliteStorage } from './sqliteStorage';

const useStore = create(
  persist(
    (set, get) => ({
      count: 0,
      increaseCount: async () => {
        const newCount = get().count + 1;
        await set({ count: newCount });
      },
      clearCount: async () => {
        await set({ count: 0 });
      },
    }),
    {
      name: 'zustand-sqlite-store',
      storage: sqliteStorage,
      version: 1,
      getStorage: () => sqliteStorage,
    }
  )
);

(async () => {
  const storedCount = await sqliteStorage.getItem('count');
  if (storedCount !== null) {
    useStore.setState({ count: storedCount });
  }
})();

export default useStore;
