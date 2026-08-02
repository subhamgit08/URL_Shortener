
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";


import urlRoutes from "./routes/url_routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

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


export default app;