// backend/server.js
import express from "express";
import cors from "cors";
import router from "./src/routes/eventRoutes.js";
const port = 3000;
import dotenv from "dotenv";
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(router);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));