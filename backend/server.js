import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import {connectDB} from "./config/mongoDB.js";
import { syncClicksToDatabase } from './controllers/clickSyncer.js';
import { redisSubscriber } from "./config/redis.js";

const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://url-shortener-frontend-omega-sooty.vercel.app"],
    credentials: true,
  },
});

// 1. Handle Browser WebSocket connections
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // When a user clicks "Subscribe" on the frontend
  socket.on("subscribe_to_notifications", () => {
    socket.join("subscribers_room"); // Add them to a specific room
    console.log(`User ${socket.id} subscribed!`);
  });

  socket.on("unsubscribe_from_notifications", () => {
    socket.leave("subscribers_room"); // Takes them out of the room
    console.log(`User ${socket.id} unsubscribed`);
  });
});

// 2. Listen to Redis Pub/Sub and forward to Socket.io
redisSubscriber.subscribe("admin_notifications", (message) => {
  console.log("Redis received message:", message);
  // Broadcast the message ONLY to users who joined the 'subscribers_room'
  io.to("subscribers_room").emit("new_admin_message", message);
});

const PORT = process.env.PORT || 3000;


const startServer = async () => {
    try {
        await connectDB();

        setInterval(syncClicksToDatabase, 5 * 60 * 1000);

        server.listen(PORT, () => {
            console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error("Failed to start server");
        console.error(err.message);
        process.exit(1);
    }
};

startServer();