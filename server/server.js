import "dotenv/config";
import { initializeDatabase } from "./lib/db.js";
import app from "./app.js";

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(8080, () => {
      console.log(`Server is running on ${process.env.BASE_URL}`);
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
