import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
//import { chatSocket } from "./src/sockets/chat.socket.js";
import { chatSocket } from "./src/sockets/chat/index.js";
import apiRouter from "./src/routes/apiRoutes.js"
import { connectMongoDB } from "./src/config/MongoDBConfig.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  credentials: true,
}));

// Create HTTP + Socket.io server
const server = http.createServer(app);

app.use("/api/v1",apiRouter);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","https://filmyfronteddummy.onrender.com"],  // your frontend
    methods: ["GET", "POST"],
    credentials: true,                // 🔑 allows cookies to be sent
  },
});

// Setup socket auth + chat logic
chatSocket(io);

connectMongoDB();
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
