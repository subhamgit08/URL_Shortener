import { getAuth } from "@clerk/express";
import User from "../models/user.js";
import redisClient from "../config/redis.js";

export const getUserPlan = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success:false , error: "Unauthorized" });
    }

    const cacheKey = `plan:${userId}`;

    // 1. Check Cache
    const cachedPlan = await redisClient.get(cacheKey);
    if (cachedPlan) {
        return res.status(200).json({ plan: cachedPlan });
    }

    // Find user in your database by Clerk ID
    const user = await User.findOne({ clerkId: userId, });

    const planToReturn = user ? user.plan : "free";

    await redisClient.setEx(cacheKey, 3600, planToReturn);

    return res.status(200).json({ plan: planToReturn });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};