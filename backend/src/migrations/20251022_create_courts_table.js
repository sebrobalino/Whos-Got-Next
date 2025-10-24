import db from '../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS Courts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        capacity INT DEFAULT 10
      )
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function alter() {
  try {
    await db.query(`
        ALTER TABLE courts 
        ADD COLUMN status TEXT DEFAULT 'open';
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
// command to run: node --env-file=.env src/migrations/20251022_create_courts_table.js
alter ()