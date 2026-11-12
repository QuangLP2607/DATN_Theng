import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { connectRedis } from "./config/redis";

const PORT = Number(process.env.PORT || 5000);

const startServer = async (): Promise<void> => {
  try {
    console.log("[Server] Starting...");

    // Connect Redis
    await connectRedis();

    console.log("[Server] Redis initialized");

    const httpServer = http.createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: ["http://localhost:5173", "http://192.168.0.3:5173"],
        credentials: true,
      },
    });

    io.on("connection", (socket) => {
      console.log(`[Socket.IO] Client connected: ${socket.id}`);

      socket.on("disconnect", () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      });
    });

    httpServer.on("error", (error) => {
      console.error("[Server] HTTP error:", error);
    });

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log("--------------------------------");
      console.log(`[Server] Running on port ${PORT}`);
      console.log(`[Server] Local: http://localhost:${PORT}`);
      console.log(`[Server] Network: http://192.168.0.3:${PORT}`);
      console.log("[Socket.IO] Initialized");
      console.log("--------------------------------");
    });
  } catch (error) {
    console.error("[Server] Startup failed:", error);
    process.exit(1);
  }
};

startServer();
