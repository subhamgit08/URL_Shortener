import dotenv from "dotenv";
dotenv.config();
import { Queue } from "bullmq";

let connection;

if (process.env.MODE === "production") {
    // Render Redis
    connection = {
        url: process.env.REDIS_URL
    };
} else {
    // Local Redis
    connection = {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: {}
    };
}

export { connection };

export const notificationQueue = new Queue(
    "notification-queue",
    {
        connection
    }
);

export const backgroundQueue = new Queue(
    "background-tasks", 
    {
        connection
    }
);