import { createClient } from 'redis';

// Initialize the client using the Render Internal URL stored in your environment variables
const redisClient = createClient({
    url: process.env.REDIS_URL
});

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

export default redisClient;