import dotenv from "dotenv";
dotenv.config();

import { createClient } from "redis";

let redisClient;

if (process.env.MODE === "production") {
    // Render Redis
    redisClient = createClient({
        url: process.env.REDIS_URL,
    });
} else {
    // Local Redis
    redisClient = createClient({
        url: process.env.REDIS_EXTERNAL_URL
    });
}

export const redisSubscriber = redisClient.duplicate();



redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

redisClient.on("connect", () => {
    console.log("Successfully connected to Redis");
});

redisClient.on("reconnecting", () => {
    console.log("Reconnecting to Redis...");
});

await redisClient.connect();
await redisSubscriber.connect();

export default redisClient;