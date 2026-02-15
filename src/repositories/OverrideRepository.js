const db = require("../db");

class OverrideRepository {
  create(featureKey, level, referenceId, enabled) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO overrides (feature_key, level, reference_id, enabled)
         VALUES (?, ?, ?, ?)`,
        [featureKey, level, referenceId, enabled ? 1 : 0],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  }

  find(featureKey, level, referenceId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM overrides 
         WHERE feature_key = ? AND level = ? AND reference_id = ?`,
        [featureKey, level, referenceId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row);
        }
      );
    });
  }
}

module.exports = OverrideRepository;
