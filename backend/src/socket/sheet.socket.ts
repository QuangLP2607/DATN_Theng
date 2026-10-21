import type { Server, Socket } from "socket.io";

const initSheetSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    /*
     * Join Sheet room
     */
    socket.on("sheet:join", (sheetId: string) => {
      if (!sheetId) {
        return;
      }

      const room = `sheet:${sheetId}`;

      socket.join(room);

      console.log(`📄 Socket ${socket.id} joined ${room}`);

      socket.emit("sheet:joined", {
        sheetId,
      });
    });

    /*
     * Leave Sheet room
     */
    socket.on("sheet:leave", (sheetId: string) => {
      if (!sheetId) {
        return;
      }

      const room = `sheet:${sheetId}`;

      socket.leave(room);

      console.log(`📄 Socket ${socket.id} left ${room}`);
    });

    /*
     * Disconnect
     */
    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export { initSheetSocket };
