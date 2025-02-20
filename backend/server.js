// root/backend/server.js
import express from "express";
import cors from "cors";
import router from "./src/routes/eventRoutes.js";
const port = process.env.PORT || 3001;
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

app.use(router);

// Serve React static files
// const __dirname=path.resolve()
if (process.env.PROD === "yes") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`));