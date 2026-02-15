const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./feature-flags.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      default_enabled INTEGER NOT NULL,
      description TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS overrides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      feature_key TEXT NOT NULL,
      level TEXT NOT NULL,
      reference_id TEXT NOT NULL,
      enabled INTEGER NOT NULL,
      UNIQUE(feature_key, level, reference_id)
    )
  `);
});

module.exports = db;
