import { socket } from "./socket";

export const joinWorkbook = (workbookId: string) => {
  socket.connect();

  socket.emit("join-workbook", {
    workbookId,
  });
};

export const leaveWorkbook = () => {
  socket.disconnect();
};
