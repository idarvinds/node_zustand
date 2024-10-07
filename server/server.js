const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Set up SQLite database
const dbFilePath = path.join(__dirname, 'zustandStorage.db');
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err);
  } else {
    console.log(`Connected to SQLite database at ${dbFilePath}`);
    db.run(`
      CREATE TABLE IF NOT EXISTS storeData (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  }
});

// API route to save/update data in SQLite
app.post('/api/set-item', (req, res) => {
  const { key, value } = req.body;
  // Store the value as a JSON string to maintain consistency.
  const stringifiedValue = JSON.stringify(value);
  const query = `INSERT INTO storeData (key, value) VALUES (?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value`;
  db.run(query, [key, stringifiedValue], function (err) {
    if (err) {
      console.error('Error saving item to SQLite:', err);
      return res.status(500).send('Failed to save item');
    }
    res.send({ success: true });
  });
});

// API route to get data from SQLite
// API route to get data from SQLite
app.get('/api/get-item/:key', (req, res) => {
  const key = req.params.key;
  db.get('SELECT value FROM storeData WHERE key = ?', [key], (err, row) => {
    if (err) {
      console.error('Error retrieving item from SQLite:', err);
      return res.status(500).json({ error: 'Failed to retrieve item' });
    }
    // If a row is found, attempt to parse the value; if not, return null.
    let value = null;
    try {
      value = row ? JSON.parse(row.value) : null;
    } catch (parseError) {
      console.error('Error parsing JSON value from SQLite:', parseError);
      value = row.value; // Fallback to the raw value if parsing fails.
    }
    res.json({ value });
  });
});


// API route to delete data from SQLite
app.post('/api/remove-item', (req, res) => {
  const { key } = req.body;
  db.run('DELETE FROM storeData WHERE key = ?', [key], function (err) {
    if (err) {
      console.error('Error removing item from SQLite:', err);
      return res.status(500).send('Failed to remove item');
    }
    res.send({ success: true });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
