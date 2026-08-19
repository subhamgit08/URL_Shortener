import { createClient } from 'redis';

// Initialize the client using the Render Internal URL stored in your environment variables
const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    password: "1234"
});

export const redisSubscriber = redisClient.duplicate();

// Event listeners to monitor the connection status
redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.on('connect', () => {
    console.log('Successfully connected to Redis');
});

redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis...');
});

// Connect immediately when the backend starts up
await redisClient.connect();
await redisSubscriber.connect();

export default redisClient;