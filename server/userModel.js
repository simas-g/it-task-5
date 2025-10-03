import { pool } from "./lib/db.js";

export async function findUserByEmail(email) {
  const query =
    "SELECT id, name, email, password_hash, status, last_login_time FROM users WHERE email = ?";
  try {
    const [rows] = await pool.query(query, [email]);
    return rows[0] || null;
  } catch (error) {
    console.error("Database Error (findUserByEmail):", error);
    throw new Error("Failed to query user data.");
  }
}

export async function findUserByVerificationToken(token) {
  const query =
    "SELECT id, email, status FROM users WHERE verification_token = ?";
  try {
    const [rows] = await pool.query(query, [token]);
    return rows[0] || null;
  } catch (error) {
    console.error("Database Error (findUserByVerificationToken):", error);
    throw new Error("Failed to query user by token.");
  }
}

export async function createUser({
  name,
  email,
  password_hash,
  verification_token,
  status = "unverified",
}) {
  const query = `
    INSERT INTO users 
      (name, email, password_hash, verification_token, status)  
    VALUES (?, ?, ?, ?, ?)
    `;
  try {
    const [result] = await pool.query(query, [
      name,
      email,
      password_hash,
      verification_token,
      status,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Database Error (createUser):", error);
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Duplicate email entry.");
    }
    throw new Error("Failed to create user record.");
  }
}

export async function getAllUsers() {
  const query = `
    SELECT id, name, email, status, last_login_time, created_at
    FROM users 
    ORDER BY last_login_time DESC, created_at DESC
  `;
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error("Database Error (getAllUsers):", error);
    throw new Error("Failed to retrieve user list.");
  }
}

export async function updateUserLoginTime(userId) {
  const query = "UPDATE users SET last_login_time = NOW() WHERE id = ?";

  try {
    const [result] = await pool.query(query, [userId]);
    return result.affectedRows === 1;
  } catch (error) {
    console.error("Database Error (updateUserLoginTime):", error);
    throw new Error("Failed to update user login time.");
  }
}

export async function updateUsersStatus(userIds, newStatus) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return { affectedRows: 0, totalRequested: 0 };
  }
  const query = "UPDATE users SET status = ? WHERE id IN (?)";
  try {
    const [result] = await pool.query(query, [newStatus, userIds]);
    return {
      affectedRows: result.affectedRows,
      totalRequested: userIds.length,
    };
  } catch (error) {
    console.error("Database Error (updateUsersStatus):", error);
    throw new Error("Failed to update user status.");
  }
}

export async function deleteUsersByIds(userIds) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return { affectedRows: 0, totalRequested: 0 };
  }
  const query = "DELETE from users WHERE id IN (?)";
  try {
    const [result] = await pool.query(query, [userIds]);
    return {
      affectedRows: result.affectedRows,
      totalRequested: userIds.length,
    };
  } catch (error) {
    console.error("Database Error (deleteUsers):", error);
    throw new Error("Failed to delete Users.");
  }
}
