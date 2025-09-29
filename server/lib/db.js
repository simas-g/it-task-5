import mysql from "mysql2";

const pool = mysql.createPool(process.env.DATABASE_URL).promise();

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL Connection Pool initialized successfully");
    connection.release();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
export { pool, initializeDatabase };
