import jwt from "jsonwebtoken";
import cookie from "cookie";
import { chatSocket } from "../sockets/chat.socket";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const setupSocketServer = (io) => {
  io.use((socket, next) => {
    try {
      // 🔍 Extract cookies manually from the handshake header
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) return next(new Error("No cookies sent"));

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token; // name of the cookie set in Express

      if (!token) return next(new Error("Missing auth token"));

      // 🔐 Verify JWT
      const decoded = jwt.verify(token, JWT_SECRET);

      socket.userId = decoded.id;
      console.log("✅ Socket authenticated:", socket.userId);
      next();
    } catch (err) {
      console.error("❌ Socket auth failed:", err.message);
      next(new Error("Authentication error"));
    }
  });

  chatSocket(io);
};
