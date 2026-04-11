import pool from '../../db/db.js';
export default async function connecting() {
  try {
    const client = await pool.connect();
    console.log("DB connected");
    client.release();
  } catch (err) {
    console.error("DB connection failed:", err);
  }

}