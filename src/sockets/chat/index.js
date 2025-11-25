import joinHandlers from "./join.js";
import messageHandlers from "./message.js";
import sendHandlers from "./send.js";
import deleteHandlers from "./delete.js";
import readHandlers from "./read.js";
import editHandlers from "./edit.js";

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New socket connected");

    joinHandlers(io, socket);
    messageHandlers(io, socket);
    sendHandlers(io, socket);
    deleteHandlers(io, socket);
    readHandlers(io, socket);
    editHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
