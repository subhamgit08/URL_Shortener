
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";


import urlRoutes from "./routes/url_routes.js";
import payemntRoutes from "./routes/payment_routes.js";
import webhookRoutes from "./routes/webHooks_routes.js";
import userRoutes from "./routes/user_routes.js";
import feedbackRoutes from "./routes/feedback.js";
import adminRoutes from "./routes/admin_routes.js";
import notifications from "./routes/notifications.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173", 
  "https://url-shortener-frontend-omega-sooty.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or Clerk webhooks)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS policy"));
        }
    },
    credentials: true,
}));

app.use("/api/webhooks", express.raw({ type: "application/json" }), webhookRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API working");
});

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy"
    });
});

app.use(clerkMiddleware());
app.use("/api/url", urlRoutes);
app.use("/api/payment", payemntRoutes);
app.use("/api/user", userRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", notifications);

export default app;