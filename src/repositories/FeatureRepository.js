const db = require("../db");

class FeatureRepository {
  create(key, defaultEnabled, description) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO features (key, default_enabled, description) VALUES (?, ?, ?)`,
        [key, defaultEnabled ? 1 : 0, description],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, key, defaultEnabled, description });
        }
      );
    });
  }

  findByKey(key) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM features WHERE key = ?`, [key], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  findAll() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM features`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = FeatureRepository;
