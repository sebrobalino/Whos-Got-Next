import db from '../config/db.js';

export async function up() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS Usertest (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL, 
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) UNIQUE, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    console.log(error)
  }
}

export async function alter() {
  try {
    await db.query(`
        ALTER TABLE users
        ADD COLUMN statusGame TEXT DEFAULT '';
        `)
  } 
  catch (error) {
    console.log(error)
  }
}

// If created and we don't need anymore use down function to drop table 
export async function down() { 
  try {
    await db.query('DROP TABLE "public"."test24"');
  } catch (error) {
    console.log(error)
  }
}

// Specify fucntion here
// command to run: node --env-file=.env src/migrations/20250926_create_test_table.js
up ()