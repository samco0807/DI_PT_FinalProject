// root/backend/server.jsjE
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
// import routes
import router from "./src/routes/eventRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
const port = process.env.PORT || 3001;
import { fileURLToPath } from "url";
import { authenticateJWT } from "./src/middleware/authMiddleware.js";
import { create } from "domain";
import { createEvent } from "./src/controllers/eventController.js";
dotenv.config();
const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://volunteer4israel.onrender.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use("/", authRoutes);

// Serve React static files
// const __dirname=path.resolve()
if (process.env.PROD === "yes") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// Public route accessible without authentication
app.get("/", (req, res) => {
  res.send("Hello, JWT Authentication");
});

app.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}` });
});

app.post("/createevent", authenticateJWT, createEvent);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
