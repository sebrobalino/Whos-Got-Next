import db from '../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS Groups (
        id SERIAL PRIMARY KEY,
        group_name VARCHAR(100) NOT NULL,
        court_id INT REFERENCES Courts(id) on DELETE SET NULL,
        priority BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        queued_at TIMESTAMP DEFAULT NULL,
      )
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function alter() {
  try {
    await db.query(`
        ALTER TABLE groups
        ADD COLUMN captain_id INT REFERENCES usertest(id) ON DELETE SET NULL;
        `)
  } 
  catch (error) {
    console.log(error)
  }
}

// If created and we don't need anymore use down function to drop table 
export async function down() { 
  try {
    await db.query('DROP TABLE "public"."Groups"');
  } catch (error) {
    console.log(error)
  }
}

// Specify fucntion here
// command to run: node --env-file=.env src/migrations/20251022_create_groups_table.js
alter()