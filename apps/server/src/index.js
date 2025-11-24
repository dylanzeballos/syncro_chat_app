import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initializeWebSocket } from "./config/websocket.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorHandler);

const httpServer = createServer(app);

const io = initializeWebSocket(httpServer);

httpServer.listen(PORT, () => {
  logger.success(`Server running on port ${PORT}`);
  logger.info(`HTTP API: http://localhost:${PORT}/api`);
  logger.info(`WebSocket: ws://localhost:${PORT}`);
});
