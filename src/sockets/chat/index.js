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

    socket.on("call-user", (data) => {
      io.to(data.userToCall).emit("incoming-call", {
        from: socket.id,
        offer: data.offer,
      });
    });

    socket.on("answer-call", (data) => {
      io.to(data.to).emit("call-accepted", data.answer);
    });

    socket.on("ice-candidate", (data) => {
      io.to(data.to).emit("ice-candidate", {
        from: socket.id,
        candidate: data.candidate,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};
