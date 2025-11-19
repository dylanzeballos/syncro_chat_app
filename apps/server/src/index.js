import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { testConnection } from "./config/database.js";
import { setupWebSocket } from "./config/websocket.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

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

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

setupWebSocket(io);

const startServer = async () => {
  try {
    await testConnection();
    httpServer.listen(WS_PORT, () => {
      logger.info(`HTTP + WebSocket Server running on port ${WS_PORT}`);
    });

    app.listen(PORT, () => {
      logger.info(`API Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, closing servers...");
  httpServer.close(() => {
    logger.info("Servers closed");
    process.exit(0);
  });
});
