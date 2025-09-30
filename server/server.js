import { initializeDatabase } from "./lib/db.js";
import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to initialization errors:",
      error.message
    );
    process.exit(1);
  }
}

startServer();
