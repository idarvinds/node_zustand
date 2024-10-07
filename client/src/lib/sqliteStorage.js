export const sqliteStorage = {
  getItem: async (key) => {
    try {
      const response = await fetch(`http://localhost:5000/api/get-item/${key}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Data fetched from SQLite:', data.value);
        return data.value || null; // Access the `value` property from the response
      }
    } catch (error) {
      console.error('Error fetching data from SQLite:', error);
    }
    return null;
  },

  setItem: async (key, value) => {
    try {
      await fetch('http://localhost:5000/api/set-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: JSON.stringify(value) }),
      });
    } catch (error) {
      console.error('Error saving data to SQLite:', error);
    }
  },

  removeItem: async (key) => {
    try {
      await fetch('http://localhost:5000/api/remove-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
    } catch (error) {
      console.error('Error removing data from SQLite:', error);
    }
  },
};
