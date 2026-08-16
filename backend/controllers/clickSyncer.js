import redisClient from "../config/redis.js";
import URL from "../models/urlSchema.js";

export const syncClicksToDatabase = async () => {
    try {
        const exists = await redisClient.exists("url_clicks");
        if (!exists) return;

        const processingKey = `url_clicks_processing_${Date.now()}`;
        await redisClient.rename("url_clicks", processingKey);

        // 3. Fetch all accumulated clicks
        const clickData = await redisClient.hGetAll(processingKey);
        
        if (Object.keys(clickData).length === 0) return;

        // 4. Format for MongoDB bulkWrite (drastically faster than updating one by one)
        const bulkOperations = Object.entries(clickData).map(([shortCode, clicks]) => ({
            updateOne: {
                filter: { shortCode },
                update: { $inc: { clicks: parseInt(clicks, 10) } }
            }
        }));

        // 5. Execute the bulk update in MongoDB
        await URL.bulkWrite(bulkOperations);

        // 6. Delete the temporary processing key
        await redisClient.del(processingKey);
        
        console.log(`Successfully batched ${bulkOperations.length} URL click updates to MongoDB.`);

    } catch (error) {
        console.error("Failed to sync clicks:", error);
    }
};