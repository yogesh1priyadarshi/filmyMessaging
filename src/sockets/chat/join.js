export default function joinHandlers(io, socket) {
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined`);
  });
}
