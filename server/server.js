import express from "express";
import cors from "cors";
import "dotenv/config";
import { getUsers } from "./lib/getUsers.js";

const app = express();
app.use(cors());

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
