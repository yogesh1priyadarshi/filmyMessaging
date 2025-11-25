import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { connectMongoDB } from "./config/MongoDBConfig.js";
import { chatSocket } from "./sockets/chat.socket.js";
import apiRoutes from "./routes/apiRoutes.js";

dotenv.config();
connectMongoDB();

const app = express();
app.use(express.json());

// REST Routes
app.use("/api/v1", apiRoutes)


// Create HTTP + Socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

chatSocket(io);

export default server;
