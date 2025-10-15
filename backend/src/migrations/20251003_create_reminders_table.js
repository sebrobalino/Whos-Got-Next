import db from '../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        reminder VARCHAR(255) NOT NULL,
        notes TEXT,
        completed BOOLEAN DEFAULT FALSE,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log(error);
  }

}

export async function down() {
  try {
    await db.query('DROP TABLE IF EXISTS reminders');
  } catch (error) {
    console.log(error);
  }
}

// command to run: node --env-file=.env src/migrations/20251003_create_reminders_table.js
up();