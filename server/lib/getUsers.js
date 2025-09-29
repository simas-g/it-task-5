import { pool } from "./db.js";

export async function getUsers() {
  const [rows] = await pool.query("SELECT id, email, name FROM users");
  return rows;
}
