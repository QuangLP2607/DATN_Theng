import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./app";
import { initSheetSocket } from "./socket/sheet.socket";

const PORT = Number(process.env.PORT || 5000);

const startServer = async (): Promise<void> => {
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://192.168.0.3:5173"],
      credentials: true,
    },
  });

  initSheetSocket(io);

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://192.168.0.3:${PORT}`);
  });
};

startServer();
